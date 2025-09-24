import { prisma } from "../../config/prisma";
import { InterviewStatus, Prisma } from "../../generated/prisma";

export class InterviewRepository {
  static async createMany(interviews: Array<{
    applicationId: number;
    scheduleDate: Date;
    locationOrLink?: string | null;
    notes?: string | null;
  }>) {
    return prisma.$transaction(async (tx) => {
      const created = [] as any[];
      for (const item of interviews) {
        const rec = await tx.interview.create({
          data: {
            applicationId: item.applicationId,
            scheduleDate: item.scheduleDate,
            locationOrLink: item.locationOrLink ?? null,
            notes: item.notes ?? null,
          },
          include: {
            application: {
              include: {
                user: true,
                job: { include: { company: { include: { admin: true } } } },
              },
            },
          },
        });
        created.push(rec);
      }
      return created;
    });
  }

  static async createOne(data: {
    applicationId: number;
    scheduleDate: Date;
    locationOrLink?: string | null;
    notes?: string | null;
  }) {
    return prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        scheduleDate: data.scheduleDate,
        locationOrLink: data.locationOrLink ?? null,
        notes: data.notes ?? null,
      },
      include: {
        application: {
          include: {
            user: true,
            job: { include: { company: { include: { admin: true } } } },
          },
        },
      },
    });
  }

  static async updateOne(id: number, data: Partial<{ scheduleDate: Date; locationOrLink: string | null; notes: string | null; status: InterviewStatus }>) {
    return prisma.interview.update({
      where: { id },
      data,
      include: {
        application: {
          include: {
            user: true,
            job: { include: { company: { include: { admin: true } } } },
          },
        },
      },
    });
  }

  static async deleteOne(id: number) {
    return prisma.interview.delete({ where: { id } });
  }

  static async getById(id: number) {
    return prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            user: true,
            job: { include: { company: { include: { admin: true } } } },
          },
        },
      },
    });
  }

  static async list(params: {
    companyId: number;
    jobId?: number;
    applicantId?: number;
    status?: InterviewStatus;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }) {
    const { companyId, jobId, applicantId, status, dateFrom, dateTo, limit = 10, offset = 0 } = params;

    const where: Prisma.InterviewWhereInput = {
      application: {
        job: {
          companyId,
          ...(jobId ? { id: jobId } : {}),
        },
        ...(applicantId ? { userId: applicantId } : {}),
      },
      ...(status ? { status } : {}),
      ...(dateFrom || dateTo
        ? {
            scheduleDate: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        orderBy: { scheduleDate: "asc" },
        skip: offset,
        take: limit,
        include: {
          application: {
            include: { user: true, job: { include: { company: { include: { admin: true } } } } },
          },
        },
      }),
      prisma.interview.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  static async findConflicts(applicationId: number, start: Date, end: Date) {
    return prisma.interview.findFirst({
      where: {
        applicationId,
        status: { in: [InterviewStatus.SCHEDULED, InterviewStatus.COMPLETED] },
        scheduleDate: { gte: start, lte: end },
      },
    });
  }

  static async getDueReminders(windowStart: Date, windowEnd: Date) {
    return prisma.interview.findMany({
      where: {
        status: InterviewStatus.SCHEDULED,
        reminderSentAt: null,
        scheduleDate: { gte: windowStart, lt: windowEnd },
      },
      include: {
        application: {
          include: { user: true, job: { include: { company: { include: { admin: true } } } } },
        },
      },
    });
  }

  static async markReminderSent(id: number) {
    return prisma.interview.update({ where: { id }, data: { reminderSentAt: new Date() } });
  }
}
