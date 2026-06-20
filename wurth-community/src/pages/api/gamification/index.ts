import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { requireRole, extractUserId } from '../../../middleware/rbac';
import { qrValidations, userBadges, xpLedger, feedPreferences } from '../../../db/schema-extended';
import { eq } from 'drizzle-orm';

/**
 * MODULE 3: ENGAGEMENT, ALGORITHMIC FEEDS & GAMIFICATION
 * 
 * Layer: API Gateway
 * Endpoints:
 *   POST /api/gamification/qr-validate - Validate QR code and award XP
 *   GET /api/gamification/badges - Get user's badges
 *   POST /api/gamification/badges/pin - Pin badge to profile
 *   GET /api/gamification/xp-ledger - View XP transaction history
 *   POST /api/feed/preferences - Set feed personalization preferences
 *   GET /api/feed/personalized - Get algorithmic feed
 * 
 * RBAC:
 *   - Students can validate their own QR codes
 *   - All users can view their own badges and XP
 *   - Admins can view analytics across users
 */

export default requireRole('student', 'wurth_employee', 'sys_admin')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/gamification/qr-validate
    // Student scans ephemeral QR code at event
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.endsWith('/qr-validate')) {
      if (userRole !== 'student') {
        return res.status(403).json({ error: 'Only students can validate QR codes' });
      }

      const { qrCode, eventId, eventName, eventDate } = req.body;

      try {
        // Check if QR code was already scanned
        const existing = db
          .select()
          .from(qrValidations)
          .where(eq(qrValidations.qrCode, qrCode))
          .get();

        if (existing) {
          return res.status(400).json({ error: 'QR code already scanned' });
        }

        // Calculate if QR code is expired
        const expiresAt = new Date(eventDate).getTime() + 24 * 60 * 60 * 1000; // 24h validity
        const isExpired = Date.now() > expiresAt;

        const xpReward = isExpired ? 0 : 50; // Full XP if not expired

        // Record QR validation
        const validation = db
          .insert(qrValidations)
          .values({
            studentId: userId,
            qrCode,
            qrType: 'event', // Could be 'guest_lecture', 'workshop', etc.
            eventId,
            eventName,
            eventDate: new Date(eventDate),
            generatedAt: new Date(),
            expiresAt: new Date(expiresAt),
            isExpired: isExpired ? 1 : 0,
            validatedAt: new Date(),
            xpAwarded: xpReward,
          })
          .run();

        // Award XP if not expired
        if (!isExpired) {
          db.insert(xpLedger)
            .values({
              studentId: userId,
              activityType: 'event',
              activityId: `event_${eventId}`,
              xpDelta: xpReward,
              totalXpAfter: 0, // TODO: Calculate
              description: `Event attendance: ${eventName}`,
              transactionId: `qr_${qrCode}`,
            })
            .run();
        }

        return res.status(201).json({
          success: true,
          xpAwarded: xpReward,
          message: isExpired ? 'QR code expired - no XP awarded' : 'Event attendance confirmed!',
        });
      } catch (error) {
        console.error('Error validating QR code:', error);
        return res.status(500).json({ error: 'Failed to validate QR code' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/gamification/badges
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.includes('/gamification/badges')) {
      try {
        const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : userId;

        // RBAC: Can only view own badges unless admin
        if (userRole === 'student' && studentId !== userId) {
          return res.status(403).json({ error: 'Cannot view another student\'s badges' });
        }

        const badges = db
          .select()
          .from(userBadges)
          .where(eq(userBadges.studentId, studentId))
          .all();

        // Sort by pinned first, then by earn date
        const sorted = badges.sort((a, b) => {
          if (a.pinnedAt && !b.pinnedAt) return -1;
          if (!a.pinnedAt && b.pinnedAt) return 1;
          return (b.earnedAt?.getTime() || 0) - (a.earnedAt?.getTime() || 0);
        });

        return res.status(200).json({
          success: true,
          badges: sorted,
          count: sorted.length,
        });
      } catch (error) {
        console.error('Error fetching badges:', error);
        return res.status(500).json({ error: 'Failed to fetch badges' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/gamification/badges/pin
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.includes('/badges/pin')) {
      const { badgeId } = req.body;

      try {
        // Verify badge belongs to student
        const badge = db
          .select()
          .from(userBadges)
          .where(eq(userBadges.id, badgeId))
          .get();

        if (!badge || badge.studentId !== userId) {
          return res.status(403).json({ error: 'Badge not found or not owned by you' });
        }

        // Update pin
        db.update(userBadges)
          .set({
            pinnedAt: new Date(),
            displayOrder: 1,
          })
          .where(eq(userBadges.id, badgeId))
          .run();

        return res.status(200).json({
          success: true,
          message: 'Badge pinned to profile',
        });
      } catch (error) {
        console.error('Error pinning badge:', error);
        return res.status(500).json({ error: 'Failed to pin badge' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/gamification/xp-ledger
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.includes('/xp-ledger')) {
      const { limit = 20, offset = 0 } = req.query;

      try {
        const ledger = db
          .select()
          .from(xpLedger)
          .where(eq(xpLedger.studentId, userId))
          .limit(parseInt(limit as string))
          .offset(parseInt(offset as string))
          .all();

        // Calculate total XP
        const totalXp = db
          .select()
          .from(xpLedger)
          .where(eq(xpLedger.studentId, userId))
          .all()
          .reduce((sum, record) => sum + record.xpDelta, 0);

        return res.status(200).json({
          success: true,
          ledger,
          totalXp,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        });
      } catch (error) {
        console.error('Error fetching XP ledger:', error);
        return res.status(500).json({ error: 'Failed to fetch XP ledger' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/feed/preferences
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.includes('/feed/preferences')) {
      const {
        majorCategory,
        minorInterests,
        careerPath,
        contentTypes,
        industryFocus,
      } = req.body;

      try {
        // Check if preferences exist
        const existing = db
          .select()
          .from(feedPreferences)
          .where(eq(feedPreferences.studentId, userId))
          .get();

        if (existing) {
          db.update(feedPreferences)
            .set({
              majorCategory,
              minorInterests: JSON.stringify(minorInterests),
              careerPath,
              contentTypes: JSON.stringify(contentTypes),
              industryFocus: JSON.stringify(industryFocus),
              updatedAt: new Date(),
            })
            .where(eq(feedPreferences.studentId, userId))
            .run();
        } else {
          db.insert(feedPreferences)
            .values({
              studentId: userId,
              majorCategory,
              minorInterests: JSON.stringify(minorInterests),
              careerPath,
              contentTypes: JSON.stringify(contentTypes),
              industryFocus: JSON.stringify(industryFocus),
            })
            .run();
        }

        return res.status(200).json({
          success: true,
          message: 'Feed preferences updated',
        });
      } catch (error) {
        console.error('Error updating feed preferences:', error);
        return res.status(500).json({ error: 'Failed to update preferences' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/feed/personalized
    // Algorithm would typically query content matching student's preferences
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.includes('/feed/personalized')) {
      try {
        const prefs = db
          .select()
          .from(feedPreferences)
          .where(eq(feedPreferences.studentId, userId))
          .get();

        // TODO: Implement NLP-based content ranking
        // For now, return mock feed with student's preferences
        const mockFeed = [
          {
            id: '1',
            type: 'case_study',
            title: 'Building Wireless Charging RX ICs',
            majorCategory: prefs?.majorCategory || 'electrical_engineering',
            relevanceScore: 0.95,
          },
          {
            id: '2',
            type: 'tutorial',
            title: 'Power Electronics Fundamentals',
            majorCategory: prefs?.majorCategory || 'electrical_engineering',
            relevanceScore: 0.87,
          },
        ];

        return res.status(200).json({
          success: true,
          feed: mockFeed,
          userPreferences: prefs,
        });
      } catch (error) {
        console.error('Error fetching personalized feed:', error);
        return res.status(500).json({ error: 'Failed to fetch feed' });
      }
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  }
);
