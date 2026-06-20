import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { requireRole, extractUserId } from '../../../middleware/rbac';
import { telemetryRecords, hardwareProfiles } from '../../../db/schema-extended';
import { eq, and } from 'drizzle-orm';

/**
 * MODULE 1: EMPIRICAL TELEMETRY & HARDWARE PORTFOLIO API
 * 
 * Layer: API Gateway
 * Endpoints:
 *   POST /api/telemetry/record - Log hardware/simulation telemetry
 *   GET /api/telemetry/records - Retrieve student's telemetry (with RBAC)
 *   GET /api/telemetry/portfolio - Get aggregated portfolio snapshot
 *   GET /api/telemetry/leaderboard - Compare metrics across cohort (filtered by role)
 * 
 * RBAC:
 *   - Students can only read/write their own telemetry
 *   - Corporate admins/employees can read all student data for recruiting insights
 *   - Sys admins can read/write anything
 */

export default requireRole('student', 'wurth_employee', 'sys_admin')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/telemetry/record
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.endsWith('/telemetry/record')) {
      // Only students can write their own telemetry
      if (userRole !== 'student') {
        return res.status(403).json({ error: 'Only students can record telemetry' });
      }

      const {
        profileId,
        impedanceMagnitude,
        impedancePhase,
        powerLoss,
        thermalTemp,
        simulationToolchain,
        designIteration,
        convergenceMetrics,
        testDurationMs,
        passedValidation,
        errorFlag,
        errorDescription,
      } = req.body;

      try {
        // Validate profile belongs to student
        const profile = db
          .select()
          .from(hardwareProfiles)
          .where(
            and(
              eq(hardwareProfiles.id, profileId),
              eq(hardwareProfiles.studentId, userId)
            )
          )
          .get();

        if (!profile) {
          return res.status(404).json({ error: 'Hardware profile not found or not owned by you' });
        }

        // Insert telemetry record
        const record = db
          .insert(telemetryRecords)
          .values({
            studentId: userId,
            profileId,
            impedanceMagnitude,
            impedancePhase,
            powerLoss,
            thermalTemp,
            simulationToolchain,
            designIteration,
            convergenceMetrics: JSON.stringify(convergenceMetrics),
            testDurationMs,
            passedValidation: passedValidation ? 1 : 0,
            errorFlag: errorFlag ? 1 : 0,
            errorDescription,
          })
          .run();

        return res.status(201).json({
          success: true,
          recordId: record.lastID,
          message: 'Telemetry recorded successfully',
        });
      } catch (error) {
        console.error('Error recording telemetry:', error);
        return res.status(500).json({ error: 'Failed to record telemetry' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/telemetry/records
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.includes('/telemetry/records')) {
      const { studentId, limit = 50, offset = 0 } = req.query;

      try {
        let query = db.select().from(telemetryRecords);

        // RBAC: Students can only see their own, others need admin role
        if (userRole === 'student') {
          query = query.where(eq(telemetryRecords.studentId, userId));
        } else if (studentId && parseInt(studentId as string) !== userId) {
          // Admins can view any student's data
          query = query.where(eq(telemetryRecords.studentId, parseInt(studentId as string)));
        } else {
          query = query.where(eq(telemetryRecords.studentId, userId));
        }

        const records = query.limit(parseInt(limit as string)).offset(parseInt(offset as string)).all();

        return res.status(200).json({
          success: true,
          records,
          count: records.length,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        });
      } catch (error) {
        console.error('Error fetching telemetry:', error);
        return res.status(500).json({ error: 'Failed to fetch telemetry records' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/telemetry/portfolio
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.includes('/telemetry/portfolio')) {
      const { studentId } = req.query;
      const targetStudentId = studentId ? parseInt(studentId as string) : userId;

      // RBAC: Can only view own portfolio unless admin
      if (userRole === 'student' && targetStudentId !== userId) {
        return res.status(403).json({ error: 'Cannot view another student\'s portfolio' });
      }

      try {
        const records = db
          .select()
          .from(telemetryRecords)
          .where(eq(telemetryRecords.studentId, targetStudentId))
          .all();

        if (records.length === 0) {
          return res.status(200).json({
            success: true,
            portfolio: {
              studentId: targetStudentId,
              designQualityScore: 0,
              reliabilityIndex: 0,
              innovationScore: 0,
              totalTestRuns: 0,
              averagePowerLoss: 0,
              maxThermalTemp: 0,
            },
          });
        }

        // Aggregate metrics
        const passedTests = records.filter((r) => r.passedValidation).length;
        const reliabilityIndex = records.length > 0 ? (passedTests / records.length) * 100 : 0;
        const averagePowerLoss =
          records.reduce((sum, r) => sum + (r.powerLoss || 0), 0) / records.length;
        const maxThermalTemp = Math.max(...records.map((r) => r.thermalTemp || 0));

        // Design quality based on convergence and validation
        const designQualityScore = (reliabilityIndex * 0.6 + 40 * 0.4); // Weighted

        return res.status(200).json({
          success: true,
          portfolio: {
            studentId: targetStudentId,
            designQualityScore: Math.round(designQualityScore),
            reliabilityIndex: Math.round(reliabilityIndex),
            innovationScore: 0, // TODO: Calculate from peer comparison
            totalTestRuns: records.length,
            averagePowerLoss: parseFloat(averagePowerLoss.toFixed(2)),
            maxThermalTemp: parseFloat(maxThermalTemp.toFixed(2)),
          },
        });
      } catch (error) {
        console.error('Error calculating portfolio:', error);
        return res.status(500).json({ error: 'Failed to calculate portfolio' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/telemetry/leaderboard
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.includes('/telemetry/leaderboard')) {
      // Only admins and employees can view leaderboard
      if (userRole === 'student') {
        return res.status(403).json({ error: 'Leaderboard access restricted to admins' });
      }

      try {
        const records = db.select().from(telemetryRecords).all();

        // Group by student and calculate aggregates
        const portfolios = new Map<number, any>();

        for (const record of records) {
          if (!portfolios.has(record.studentId)) {
            portfolios.set(record.studentId, {
              studentId: record.studentId,
              totalTests: 0,
              passedTests: 0,
              avgPowerLoss: 0,
              maxTemp: 0,
              totalPowerLoss: 0,
            });
          }

          const portfolio = portfolios.get(record.studentId)!;
          portfolio.totalTests++;
          if (record.passedValidation) portfolio.passedTests++;
          portfolio.totalPowerLoss += record.powerLoss || 0;
          portfolio.maxTemp = Math.max(portfolio.maxTemp, record.thermalTemp || 0);
        }

        // Calculate scores and sort
        const leaderboard = Array.from(portfolios.values())
          .map((p) => ({
            ...p,
            avgPowerLoss: parseFloat((p.totalPowerLoss / p.totalTests).toFixed(2)),
            reliabilityIndex: Math.round((p.passedTests / p.totalTests) * 100),
            designQualityScore: Math.round((p.passedTests / p.totalTests) * 60 + 40),
          }))
          .sort((a, b) => b.designQualityScore - a.designQualityScore)
          .slice(0, 20); // Top 20

        return res.status(200).json({
          success: true,
          leaderboard,
        });
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ error: 'Failed to fetch leaderboard' });
      }
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  }
);
