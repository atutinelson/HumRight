import {
  PrismaClient,
  MatchStatus,
  PaymentStatus,
  TipOutcome,
} from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /*
  =====================================================
  OPTIONAL: Clear existing data (safe reseeding)
  =====================================================
  */

  await prisma.tipResult.deleteMany();
  await prisma.tipAccessLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.jackpot.deleteMany();
  await prisma.fixture.deleteMany();
  await prisma.tipPlan.deleteMany();

  /*
  =====================================================
  1️⃣ TIP PLANS
  =====================================================
  */

  const freePlan = await prisma.tipPlan.create({
    data: {
      name: "Free Plan",
      price: 0,
      description: "Daily free betting tips",
      oddRange: "1.5 - 2.0",
    },
  });

  const vipBasic = await prisma.tipPlan.create({
    data: {
      name: "VIP Basic",
      price: 500,
      description: "Low risk VIP tips",
      oddRange: "1.8 - 2.5",
    },
  });

  const vipPro = await prisma.tipPlan.create({
    data: {
      name: "VIP Pro",
      price: 1000,
      description: "Medium risk premium tips",
      oddRange: "2.0 - 4.0",
    },
  });

  const megaJackpot = await prisma.tipPlan.create({
    data: {
      name: "Mega Jackpot",
      price: 2000,
      description: "High odds accumulator tips",
      oddRange: "5.0 - 20.0",
    },
  });

  const weekendSpecial = await prisma.tipPlan.create({
    data: {
      name: "Weekend Special",
      price: 750,
      description: "Weekend only predictions",
      oddRange: "2.0 - 3.5",
    },
  });

  /*
  =====================================================
  2️⃣ FIXTURES
  =====================================================
  */

  const fixtures = await Promise.all([
    prisma.fixture.create({
      data: {
        matchDate: new Date(),
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        competition: "Premier League",
        fixtureTip: "1",
        status: MatchStatus.SCHEDULED,
      },
    }),
    prisma.fixture.create({
      data: {
        matchDate: new Date(),
        homeTeam: "Barcelona",
        awayTeam: "Real Madrid",
        fixtureTip: "X",
        competition: "La Liga",
        status: MatchStatus.SCHEDULED,
      },
    }),
    prisma.fixture.create({
      data: {
        matchDate: new Date(),
        homeTeam: "Bayern",
        awayTeam: "Dortmund",
        fixtureTip: "2",
        competition: "Bundesliga",
        status: MatchStatus.SCHEDULED,
      },
    }),
    prisma.fixture.create({
      data: {
        matchDate: new Date(),
        homeTeam: "PSG",
        awayTeam: "Marseille",
        fixtureTip: "over 1.5",
        competition: "Ligue 1",
        status: MatchStatus.SCHEDULED,
      },
    }),
    prisma.fixture.create({
      data: {
        matchDate: new Date(),
        homeTeam: "Inter",
        awayTeam: "Juventus",
        fixtureTip: "X",
        competition: "Serie A",
        status: MatchStatus.SCHEDULED,
      },
    }),
  ]);

  /*
  =====================================================
  3️⃣ PREDICTIONS
  =====================================================
  */

  const predictions = await Promise.all([
    prisma.prediction.create({
      data: {
        tipText: "Arsenal to Win",
        odd: 1.85,
        tipDate: new Date(),
        isPublished: true,
        fixtureId: fixtures[0].id,
        planId: null, // FREE
      },
    }),
    prisma.prediction.create({
      data: {
        tipText: "Over 2.5 Goals",
        odd: 2.1,
        tipDate: new Date(),
        isPublished: true,
        fixtureId: fixtures[1].id,
        planId: vipBasic.id,
      },
    }),
    prisma.prediction.create({
      data: {
        tipText: "Both Teams To Score",
        odd: 1.95,
        tipDate: new Date(),
        isPublished: true,
        fixtureId: fixtures[2].id,
        planId: vipPro.id,
      },
    }),
    prisma.prediction.create({
      data: {
        tipText: "PSG to Win & Over 1.5",
        odd: 2.4,
        tipDate: new Date(),
        isPublished: true,
        fixtureId: fixtures[3].id,
        planId: megaJackpot.id,
      },
    }),
    prisma.prediction.create({
      data: {
        tipText: "Inter Double Chance",
        odd: 1.7,
        tipDate: new Date(),
        isPublished: true,
        fixtureId: fixtures[4].id,
        planId: null, // FREE
      },
    }),
    prisma.prediction.create({
      data: {
        tipText: "Weekend Special Tip",
        odd: 2.5,
        tipDate: new Date(),
        isPublished: true,
        fixtureId: fixtures[0].id,
        planId: weekendSpecial.id,
      },
    }),
  ]);

  /*
  =====================================================
  4️⃣ PAYMENTS
  =====================================================
  */

  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        mobileNumber: "254700000001",
        mpesaRequestId: "MPESA001",
        amount: 500,
        status: PaymentStatus.SUCCESS,
        predictionId: predictions[1].id,
        planId: vipBasic.id,
      },
    }),
    prisma.payment.create({
      data: {
        mobileNumber: "254700000002",
        mpesaRequestId: "MPESA002",
        amount: 1000,
        status: PaymentStatus.SUCCESS,
        predictionId: predictions[2].id,
        planId: vipPro.id,
      },
    }),
    prisma.payment.create({
      data: {
        mobileNumber: "254700000003",
        mpesaRequestId: "MPESA003",
        amount: 2000,
        status: PaymentStatus.PENDING,
        predictionId: predictions[3].id,
        planId: megaJackpot.id,
      },
    }),
    prisma.payment.create({
      data: {
        mobileNumber: "254700000004",
        mpesaRequestId: "MPESA004",
        amount: 750,
        status: PaymentStatus.FAILED,
        predictionId: predictions[5].id,
        planId: weekendSpecial.id,
      },
    }),
    prisma.payment.create({
      data: {
        mobileNumber: "254700000005",
        mpesaRequestId: "MPESA005",
        amount: 500,
        status: PaymentStatus.SUCCESS,
        predictionId: predictions[1].id,
        planId: vipBasic.id,
      },
    }),
  ]);

  /*
  =====================================================
  5️⃣ TIP ACCESS LOGS
  =====================================================
  */

  await Promise.all(
    payments.map((payment, index) =>
      prisma.tipAccessLog.create({
        data: {
          paymentId: payment.id,
          ipAddress: `192.168.0.${index + 1}`,
        },
      })
    )
  );

  /*
  =====================================================
  6️⃣ TIP RESULTS
  =====================================================
  */

  await Promise.all(
    predictions.map((prediction, index) =>
      prisma.tipResult.create({
        data: {
          predictionId: prediction.id,
          outcome:
            index % 3 === 0
              ? TipOutcome.WIN
              : index % 3 === 1
              ? TipOutcome.LOSS
              : TipOutcome.VOID,
        },
      })
    )
  );

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });