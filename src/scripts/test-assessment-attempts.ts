import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function addTestAttempts() {
  try {
    // Get the current user (Bob Pratama based on screenshot)
    const user = await prisma.user.findFirst({
      where: {
        name: {
          contains: 'Bob'
        }
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    // Get React Basics assessment (ID 28 from console log)
    const assessment = await prisma.skillAssessment.findFirst({
      where: {
        id: 28
      }
    });

    if (!assessment) {
      console.log('❌ Assessment not found');
      return;
    }

    console.log('📋 Found:', {
      user: { id: user.id, name: user.name },
      assessment: { id: assessment.id, title: assessment.title }
    });

    // Check existing attempts
    const existingAttempts = await prisma.skillResult.findMany({
      where: {
        userId: user.id,
        assessmentId: assessment.id
      }
    });

    console.log(`📊 Existing attempts: ${existingAttempts.length}`);

    // Add 2 test attempts
    const now = new Date();
    const attempt1Date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const attempt2Date = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago

    // First attempt (failed)
    if (existingAttempts.length === 0) {
      await prisma.skillResult.create({
        data: {
          userId: user.id,
          assessmentId: assessment.id,
          score: 50, // Failed (< 75%)
          isPassed: false,
          answers: {
            summary: "First attempt - needs improvement in React hooks"
          },
          startedAt: attempt1Date,
          finishedAt: new Date(attempt1Date.getTime() + 5 * 60 * 1000), // 5 minutes later
          durationSeconds: 300,
          createdAt: attempt1Date,
          updatedAt: attempt1Date
        }
      });
      console.log('✅ Added first attempt (failed)');
    }

    // Second attempt (failed)
    if (existingAttempts.length <= 1) {
      await prisma.skillResult.create({
        data: {
          userId: user.id,
          assessmentId: assessment.id,
          score: 50, // Failed again
          isPassed: false,
          answers: {
            summary: "Second attempt - still struggling with JSX concepts"
          },
          startedAt: attempt2Date,
          finishedAt: new Date(attempt2Date.getTime() + 4 * 60 * 1000), // 4 minutes later
          durationSeconds: 240,
          createdAt: attempt2Date,
          updatedAt: attempt2Date
        }
      });
      console.log('✅ Added second attempt (failed)');
    }

    // Verify final count
    const finalAttempts = await prisma.skillResult.findMany({
      where: {
        userId: user.id,
        assessmentId: assessment.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('🎯 Final attempts count:', finalAttempts.length);
    console.log('📋 Attempts details:', finalAttempts.map(a => ({
      id: a.id,
      score: a.score,
      isPassed: a.isPassed,
      createdAt: a.createdAt
    })));

    console.log('✅ Test data ready! Now refresh the assessment page to test the limit.');

  } catch (error) {
    console.error('❌ Error adding test attempts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestAttempts();
