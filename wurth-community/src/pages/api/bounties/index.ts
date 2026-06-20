import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db';
import { requireRole, extractUserId } from '../../../middleware/rbac';
import { bounties, bountyExecutions, rewardsLedger, xpLedger } from '../../../db/schema-extended';
import { eq, and } from 'drizzle-orm';

/**
 * MODULE 2: ZERO-TRUST MICRO-INTERNSHIPS & SANDBOX BOUNTIES
 * 
 * Layer: API Gateway + Sandboxed Execution Layer
 * Endpoints:
 *   POST /api/bounties/create - Create new bounty (admin only)
 *   GET /api/bounties - List active bounties
 *   POST /api/bounties/execute - Submit solution for a bounty
 *   GET /api/bounties/:bountyId/results - View execution results
 *   POST /api/bounties/:bountyId/verify - Verify submission (admin only)
 * 
 * RBAC:
 *   - Only sys_admin/wurth_employee can create bounties
 *   - Students can submit solutions
 *   - Only sys_admin can verify and award rewards
 */

export default requireRole('student', 'wurth_employee', 'sys_admin')(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/bounties/create
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.endsWith('/bounties/create')) {
      if (userRole !== 'sys_admin' && userRole !== 'wurth_employee') {
        return res.status(403).json({ error: 'Only admins can create bounties' });
      }

      const {
        title,
        description,
        skillsRequired,
        difficultyLevel,
        category,
        sandboxType,
        starterCode,
        testCases,
        maxExecutionTimeMs,
        xpReward,
        componentBudgetSubsidy,
      } = req.body;

      try {
        const bounty = db
          .insert(bounties)
          .values({
            creatorId: userId,
            title,
            description,
            skillsRequired: JSON.stringify(skillsRequired),
            difficultyLevel,
            category,
            sandboxType,
            starterCode,
            testCases: JSON.stringify(testCases),
            maxExecutionTimeMs,
            xpReward,
            componentBudgetSubsidy,
            status: 'draft',
          })
          .run();

        return res.status(201).json({
          success: true,
          bountyId: bounty.lastID,
          message: 'Bounty created successfully',
        });
      } catch (error) {
        console.error('Error creating bounty:', error);
        return res.status(500).json({ error: 'Failed to create bounty' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/bounties
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET' && req.url?.match(/^\/api\/bounties\/?$/)) {
      try {
        const activeOnly = req.query.active === 'true';
        const query = db.select().from(bounties);
        const allBounties = activeOnly
          ? db
              .select()
              .from(bounties)
              .where(eq(bounties.status, 'active'))
              .all()
          : db.select().from(bounties).all();

        return res.status(200).json({
          success: true,
          bounties: allBounties,
          count: allBounties.length,
        });
      } catch (error) {
        console.error('Error fetching bounties:', error);
        return res.status(500).json({ error: 'Failed to fetch bounties' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/bounties/execute
    // Student submits solution to a bounty
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.endsWith('/bounties/execute')) {
      if (userRole !== 'student') {
        return res.status(403).json({ error: 'Only students can execute bounties' });
      }

      const { bountyId, submittedCode } = req.body;

      try {
        // Get bounty
        const bounty = db.select().from(bounties).where(eq(bounties.id, bountyId)).get();

        if (!bounty) {
          return res.status(404).json({ error: 'Bounty not found' });
        }

        // Create execution record
        const execution = db
          .insert(bountyExecutions)
          .values({
            bountyId,
            studentId: userId,
            status: 'pending',
            submittedCode,
            submittedAt: new Date(),
            testPassCount: 0,
            testTotalCount: 0,
          })
          .run();

        // TODO: Trigger sandbox execution in separate worker process
        // For now, simulate execution
        const testCases = JSON.parse(bounty.testCases || '[]');
        const passCount = Math.floor(testCases.length * 0.8); // Simulate 80% pass rate

        // Update execution with results
        db.update(bountyExecutions)
          .set({
            status: 'completed',
            testPassCount: passCount,
            testTotalCount: testCases.length,
            executionTimeMs: 2500,
          })
          .where(eq(bountyExecutions.id, execution.lastID as number))
          .run();

        return res.status(201).json({
          success: true,
          executionId: execution.lastID,
          status: 'completed',
          testsPassed: passCount,
          testsTotal: testCases.length,
          message: 'Bounty submission executed successfully',
        });
      } catch (error) {
        console.error('Error executing bounty:', error);
        return res.status(500).json({ error: 'Failed to execute bounty' });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/bounties/:bountyId/verify
    // Admin verifies and awards rewards
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST' && req.url?.match(/\/bounties\/\d+\/verify/)) {
      if (userRole !== 'sys_admin') {
        return res.status(403).json({ error: 'Only admins can verify bounties' });
      }

      const { executionId, verified, notes } = req.body;

      try {
        const execution = db
          .select()
          .from(bountyExecutions)
          .where(eq(bountyExecutions.id, executionId))
          .get();

        if (!execution) {
          return res.status(404).json({ error: 'Execution not found' });
        }

        // Update verification
        db.update(bountyExecutions)
          .set({
            verifiedBy: userId,
            verifiedAt: new Date(),
            verificationNotes: notes,
          })
          .where(eq(bountyExecutions.id, executionId))
          .run();

        // If verified, award rewards
        if (verified) {
          const bounty = db.select().from(bounties).where(eq(bounties.id, execution.bountyId)).get();

          if (!bounty) {
            return res.status(404).json({ error: 'Bounty not found' });
          }

          // Award XP
          db.insert(xpLedger)
            .values({
              studentId: execution.studentId,
              activityType: 'bounty',
              activityId: `bounty_${execution.bountyId}`,
              xpDelta: bounty.xpReward,
              totalXpAfter: 0, // TODO: Calculate from previous XP
              description: `Completed bounty: ${bounty.title}`,
              transactionId: `exec_${executionId}`,
            })
            .run();

          // Award component budget
          if (bounty.componentBudgetSubsidy) {
            db.insert(rewardsLedger)
              .values({
                studentId: execution.studentId,
                sourceType: 'bounty_completion',
                sourceId: `bounty_${execution.bountyId}`,
                xpDelta: 0,
                componentBudgetDelta: bounty.componentBudgetSubsidy,
                description: `Component budget for: ${bounty.title}`,
                issuedBy: userId,
                approvedAt: new Date(),
              })
              .run();
          }

          // Update execution rewards
          db.update(bountyExecutions)
            .set({
              xpAwarded: bounty.xpReward,
              componentBudgetAwarded: bounty.componentBudgetSubsidy,
            })
            .where(eq(bountyExecutions.id, executionId))
            .run();

          return res.status(200).json({
            success: true,
            message: 'Bounty verified and rewards awarded',
            xpAwarded: bounty.xpReward,
            budgetAwarded: bounty.componentBudgetSubsidy,
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Bounty marked for rejection',
        });
      } catch (error) {
        console.error('Error verifying bounty:', error);
        return res.status(500).json({ error: 'Failed to verify bounty' });
      }
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  }
);
