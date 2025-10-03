import {
  PrismaClient,
  ProviderType,
  User,
  UserRole,
} from "../../generated/prisma";
import { adminSeeds, seekerSeeds } from "./userSeedData";

interface SeedUsersOptions {
  prisma: PrismaClient;
  now: Date;
  passwords: {
    admin: string;
    user: string;
    developer: string;
    mentor: string;
  };
}

type AdminKey = typeof adminSeeds[number]["key"];
type SeekerKey = typeof seekerSeeds[number]["key"];

type AdminRecord = Record<AdminKey, User>;
type SeekerRecord = Record<SeekerKey, User>;

export interface SeedUsersResult {
  developer: User;
  mentor: User;
  admins: AdminRecord;
  seekers: SeekerRecord;
}

export async function seedUsers({
  prisma,
  now,
  passwords,
}: SeedUsersOptions): Promise<SeedUsersResult> {
  const developer = await prisma.user.create({
    data: {
      role: UserRole.DEVELOPER,
      email: "dev@jobboard.id",
      passwordHash: passwords.developer,
      name: "Workoo Developer",
      phone: "+628566677788",
      gender: "Female",
      dob: new Date("1994-04-14"),
      education: "Bachelor of Computer Engineering",
      address: "Jl. Asia Afrika No. 7, Bandung",
      city: "Bandung",
      emailVerifiedAt: now,
      profilePicture: "https://placehold.co/128x128?text=DEV",
      profile: {
        create: {
          fullName: "Workoo Developer",
          phone: "+628566677788",
          gender: "Female",
          city: "Bandung",
          province: "Jawa Barat",
          summary: "Developer maintaining assessments and subscription offerings.",
          linkedinUrl: "https://linkedin.com/in/workoo-developer",
        },
      },
    },
  });

  const mentor = await prisma.user.create({
    data: {
      role: UserRole.MENTOR,
      email: "mentor@jobboard.id",
      passwordHash: passwords.mentor,
      name: "Mentor Insight",
      gender: "Female",
      city: "Jakarta",
      emailVerifiedAt: now,
      profilePicture: "https://placehold.co/128x128?text=MENTOR",
      profile: {
        create: {
          fullName: "Mentor Insight",
          city: "Jakarta",
          summary: "Provides guidance on interview readiness and assessments.",
        },
      },
    },
  });

  const adminEntries = await Promise.all(
    adminSeeds.map(async (admin) => {
      const user = await prisma.user.create({
        data: {
          role: UserRole.ADMIN,
          email: admin.email,
          passwordHash: passwords.admin,
          name: admin.name,
          phone: admin.phone,
          gender: admin.gender,
          dob: new Date(admin.dob),
          education: admin.education,
          address: admin.address,
          city: admin.city,
          emailVerifiedAt: now,
          profile: {
            create: {
              fullName: admin.name,
              phone: admin.phone,
              gender: admin.gender,
              dob: new Date(admin.dob),
              education: admin.education,
              address: admin.address,
              city: admin.city,
              province: admin.province,
              summary: admin.summary,
              linkedinUrl: admin.linkedin,
            },
          },
        },
      });

      return [admin.key, user] as const;
    })
  );

  const admins = Object.fromEntries(adminEntries) as AdminRecord;

  const seekerEntries = await Promise.all(
    seekerSeeds.map(async (seeker) => {
      const portfolioUrl =
        "portfolio" in seeker ? (seeker as { portfolio: string }).portfolio : null;

      const user = await prisma.user.create({
        data: {
          role: UserRole.USER,
          email: seeker.email,
          passwordHash: passwords.user,
          name: seeker.name,
          phone: seeker.phone,
          gender: seeker.gender,
          dob: new Date(seeker.dob),
          education: seeker.education,
          address: seeker.address,
          city: seeker.city,
          emailVerifiedAt: now,
          profile: {
            create: {
              fullName: seeker.name,
              phone: seeker.phone,
              gender: seeker.gender,
              dob: new Date(seeker.dob),
              education: seeker.education,
              address: seeker.address,
              city: seeker.city,
              province: seeker.province,
              summary: seeker.summary,
              linkedinUrl: seeker.linkedin,
              portfolioUrl,
            },
          },
        },
      });

      return [seeker.key, user] as const;
    })
  );

  const seekers = Object.fromEntries(seekerEntries) as SeekerRecord;

  const [verificationExpiry, resetExpiry, staleLoginAt] = [
    new Date(now.getTime() + 60 * 60 * 1000),
    new Date(now.getTime() + 30 * 60 * 1000),
    new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  ];

  await prisma.$transaction([
    prisma.user.update({
      where: { id: seekers.charlie.id },
      data: {
        emailVerifiedAt: null,
        verificationToken: "verify-charlie-001",
        verificationTokenExpiresAt: verificationExpiry,
      },
    }),
    prisma.user.update({
      where: { id: seekers.diana.id },
      data: {
        passwordResetToken: "reset-diana-001",
        passwordResetExpiresAt: resetExpiry,
      },
    }),
    prisma.user.update({
      where: { id: seekers.eko.id },
      data: { lastLoginAt: staleLoginAt },
    }),
  ]);

  await prisma.userProvider.createMany({
    data: [
      {
        userId: seekers.alice.id,
        provider: ProviderType.GOOGLE,
        providerId: "alice-google",
        accessToken: "token-alice",
      },
      {
        userId: seekers.bob.id,
        provider: ProviderType.FACEBOOK,
        providerId: "bob-facebook",
      },
      {
        userId: seekers.gina.id,
        provider: ProviderType.GOOGLE,
        providerId: "gina-google",
      },
    ],
  });

  return { developer, mentor, admins, seekers };
}



