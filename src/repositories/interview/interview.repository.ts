import { prisma } from "../../config/prisma";
import { InterviewStatus, Prisma } from "../../generated/prisma";

export class InterviewRepository {
  static async createMany(interviews: Array<{
    applicationId: number;
    startsAt: Date;
    locationOrLink?: string | null;
    notes?: string | null;
  }>) {
    return prisma.$transaction(async (tx) => {
      const created = [] as any[];
      for (const item of interviews) {
        const rec = await tx.interview.create({
          data: {
            applicationId: item.applicationId,
            startsAt: item.startsAt,
            locationOrLink: item.locationOrLink ?? null,
            notes: item.notes ?? null,
          },
          include: {
            application: {
              include: {
                user: true,
                job: { include: { company: { include: { owner: true } } } },
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
        startsAt: data.scheduleDate,
        locationOrLink: data.locationOrLink ?? null,
        notes: data.notes ?? null,
      },
      include: {
        application: {
          include: {
            user: true,
            job: { include: { company: { include: { owner: true } } } },
          },
        },
      },
    });
  }

  static async updateOne(id: number, data: Partial<{ startsAt: Date; locationOrLink: string | null; notes: string | null; status: InterviewStatus; reminderSentAt: Date | null }>) {
    return prisma.interview.update({
      where: { id },
      data,
      include: {
        application: {
          include: {
            user: true,
            job: { include: { company: { include: { owner: true } } } },
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
            job: { include: { company: { include: { owner: true } } } },
          },
        },
      },
    });
  }

  static async list(params: {
    companyId: string | number;
    jobId?: string | number;
    applicantId?: number;
    status?: InterviewStatus;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }) {
    const { companyId, jobId, applicantId, status, dateFrom, dateTo, limit = 10, offset = 0 } = params;
    const cid = typeof companyId === 'string' ? Number(companyId) : companyId;
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;

    const where: Prisma.InterviewWhereInput = {
      application: {
        job: {
          companyId: cid,
          ...(jid ? { id: jid } : {}),
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
        orderBy: { startsAt: "asc" },
        skip: offset,
        take: limit,
        include: {
          application: {
            include: { user: true, job: { include: { company: { include: { owner: true } } } } },
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
        startsAt: { gte: start, lte: end },
      },
    });
  }

  static async getDueReminders(windowStart: Date, windowEnd: Date) {
    return prisma.interview.findMany({
      where: {
        status: InterviewStatus.SCHEDULED,
        reminderSentAt: null,
        startsAt: { gte: windowStart, lt: windowEnd },
      },
      include: {
        application: {
          include: { user: true, job: { include: { company: { include: { owner: true } } } } },
        },
      },
    });
  }

  static async markReminderSent(id: number) {
    return prisma.interview.update({ where: { id }, data: { reminderSentAt: new Date() } });
  }
}
