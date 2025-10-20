# Panduan Revert Perubahan Testing Subscription Cron Job

## ⚠️ PENTING: Dokumentasi ini untuk mengembalikan perubahan testing ke production

Setelah selesai testing subscription cron job dengan durasi 3 menit, gunakan panduan ini untuk mengembalikan ke setting production (30 hari).

---

## File yang Diubah untuk Testing

### 1. `src/utils/dateHelper.ts`

**Perubahan yang dilakukan:**

- Durasi subscription dari 30 hari → 3 menit

**Cara Revert:**

```typescript
// Ubah dari:
public static getSubscriptionEndDate(startDate: Date): Date {
  // TESTING: Set to 3 minutes duration (change back to 30 days after testing)
  return new Date(startDate.getTime() + 3 * 60 * 1000);
}

// Kembali ke:
public static getSubscriptionEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  // Production: Set to 30 days duration
  endDate.setDate(endDate.getDate() + 30);
  return endDate;
}
```

---

### 2. `src/repositories/subscription/subscription.repository.ts`

**Perubahan yang dilakukan:**

- Ditambahkan method `getSubscriptionsExpiringInMinutesWindow()`

**Cara Revert:**
Hapus seluruh method berikut (baris 148-167):

```typescript
// TESTING: Method for minute-based expiration checking
public static async getSubscriptionsExpiringInMinutesWindow(
  minutes: number,
  windowSeconds: number
) {
  const now = new Date();
  const windowStart = new Date(now.getTime() + minutes * 60 * 1000);
  const windowEnd = new Date(windowStart.getTime() + windowSeconds * 1000);

  return prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      expiresAt: { gte: windowStart, lt: windowEnd },
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      plan: true,
    },
  });
}
```

---

### 3. `src/jobs/subscriptionJobs.ts`

**Perubahan yang dilakukan:**

- Cron schedule dari `*/10 * * * *` dan `*/15 * * * *` → `* * * * *`
- Method call dari `getSubscriptionsExpiringInHoursWindow(24, 10)` → `getSubscriptionsExpiringInMinutesWindow(1, 60)`

**Cara Revert:**

a) **Pada function `startSubscriptionJobs()`:**

```typescript
// Ubah dari:
export function startSubscriptionJobs() {
  // TESTING: Reminder 1 minute before expiry (runs every 1 minute)
  cron.schedule("* * * * *", async () => {
    try {
      const expiring =
        await SubscriptionRepo.getSubscriptionsExpiringInMinutesWindow(1, 60);
      // ... rest of code
    }
  });

  // TESTING: Deactivate expired subscriptions (runs every 1 minute)
  cron.schedule("* * * * *", async () => {
    // ... rest of code
  });
}

// Kembali ke:
export function startSubscriptionJobs() {
  // Reminder H-1 (every 10 minutes)
  cron.schedule("*/10 * * * *", async () => {
    try {
      const expiring =
        await SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 10);
      // ... rest of code
    }
  });

  // Deactivate expired subscriptions (every 15 minutes)
  cron.schedule("*/15 * * * *", async () => {
    // ... rest of code
  });
}
```

b) **Pada function `runSubscriptionCycle()`:**

```typescript
// Ubah dari:
export async function runSubscriptionCycle(): Promise<void> {
  try {
    // TESTING: Check for subscriptions expiring in 1 minute
    const expiring =
      await SubscriptionRepo.getSubscriptionsExpiringInMinutesWindow(1, 60);
    // ... rest of code
  }
}

// Kembali ke:
export async function runSubscriptionCycle(): Promise<void> {
  try {
    const expiring =
      await SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 10);
    // ... rest of code
  }
}
```

---

## Langkah-langkah Revert Lengkap

1. **Restore File-file yang Diubah**

   - Edit `src/utils/dateHelper.ts` (kembalikan ke 30 hari)
   - Edit `src/jobs/subscriptionJobs.ts` (kembalikan ke cron 10/15 menit dan method hours)
   - Edit `src/repositories/subscription/subscription.repository.ts` (hapus method minutes)

2. **Build Ulang Aplikasi**

   ```bash
   npm run build
   ```

3. **Commit Perubahan**

   ```bash
   git add .
   git commit -m "revert: Kembalikan subscription duration ke 30 hari production"
   ```

4. **Push dan Deploy**
   ```bash
   git push origin testing-final
   ```
5. **Verifikasi di Vercel**
   - Pastikan deployment berhasil
   - Test dengan membuat subscription baru
   - Verifikasi bahwa durasi kembali ke 30 hari

---

## Checklist Revert

- [ ] Restore `dateHelper.ts` ke 30 hari
- [ ] Restore `subscriptionJobs.ts` cron ke `*/10 * * * *` dan `*/15 * * * *`
- [ ] Restore `subscriptionJobs.ts` method ke `getSubscriptionsExpiringInHoursWindow(24, 10)`
- [ ] Hapus method `getSubscriptionsExpiringInMinutesWindow()` dari repository
- [ ] Build ulang dengan `npm run build`
- [ ] Check tidak ada linter errors
- [ ] Commit dan push perubahan
- [ ] Deploy ke Vercel
- [ ] Test subscription baru untuk verifikasi durasi 30 hari
- [ ] Hapus file dokumentasi ini setelah selesai

---

## Catatan Tambahan

- Pastikan tidak ada subscription aktif yang sedang dalam periode testing 3 menit saat melakukan revert
- Setelah revert, subscription baru akan langsung menggunakan durasi 30 hari
- Email reminder akan kembali dikirim 24 jam sebelum expiry
- Cron job akan berjalan sesuai jadwal production (10 dan 15 menit)
