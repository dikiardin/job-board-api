# Subscription Configuration Guide

Panduan lengkap untuk mengubah konfigurasi subscription antara mode **PRODUCTION** (30 hari) dan **TESTING** (3 menit).

---

## 📊 Perbandingan Mode

| Aspek                       | PRODUCTION               | TESTING                    |
| --------------------------- | ------------------------ | -------------------------- |
| **Masa Aktif Subscription** | 30 hari                  | 3 menit                    |
| **Email Reminder**          | H-1 (24 jam sebelum)     | 1 menit sebelum            |
| **Cron Schedule**           | Setiap jam (`0 * * * *`) | Setiap menit (`* * * * *`) |
| **Window Checking**         | 24 jam                   | 1 menit                    |

---

## 🔧 File yang Perlu Diubah

Ada **3 file backend** dan **1 konfigurasi external** yang perlu diubah:

### 1️⃣ `src/utils/dateHelper.ts`

**PRODUCTION (30 hari):**

```typescript
public static getSubscriptionEndDate(startDate: Date): Date {
  // PRODUCTION: Set to 30 days duration
  return new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
}
```

**TESTING (3 menit):**

```typescript
public static getSubscriptionEndDate(startDate: Date): Date {
  // TESTING: Set to 3 minutes duration (change back to 30 days after testing)
  return new Date(startDate.getTime() + 3 * 60 * 1000);
}
```

---

### 2️⃣ `src/jobs/subscriptionJobs.ts`

Ada **4 tempat** yang perlu diubah di file ini:

#### A. Cron Schedule - Reminder (Line 11-12)

**PRODUCTION:**

```typescript
export function startSubscriptionJobs() {
  // PRODUCTION: Reminder 24 hours before expiry (runs every hour)
  cron.schedule("0 * * * *", async () => {
```

**TESTING:**

```typescript
export function startSubscriptionJobs() {
  // TESTING: Reminder 1 minute before expiry (runs every 1 minute)
  cron.schedule("* * * * *", async () => {
```

#### B. Window Checking - Reminder (Line 14-15)

**PRODUCTION:**

```typescript
    try {
      const expiring =
        await SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 60);
```

**TESTING:**

```typescript
    try {
      const expiring =
        await SubscriptionRepo.getSubscriptionsExpiringInMinutesWindow(1, 60);
```

#### C. Cron Schedule - Deactivation (Line 37-38)

**PRODUCTION:**

```typescript
  // PRODUCTION: Deactivate expired subscriptions (runs every hour)
  cron.schedule("0 * * * *", async () => {
```

**TESTING:**

```typescript
  // TESTING: Deactivate expired subscriptions (runs every 1 minute)
  cron.schedule("* * * * *", async () => {
```

#### D. Manual Trigger Function (Line 58-61)

**PRODUCTION:**

```typescript
export async function runSubscriptionCycle(): Promise<void> {
  try {
    // PRODUCTION: Check for subscriptions expiring in 24 hours
    const expiring =
      await SubscriptionRepo.getSubscriptionsExpiringInHoursWindow(24, 60);
```

**TESTING:**

```typescript
export async function runSubscriptionCycle(): Promise<void> {
  try {
    // TESTING: Check for subscriptions expiring in 1 minute
    const expiring =
      await SubscriptionRepo.getSubscriptionsExpiringInMinutesWindow(1, 60);
```

---

### 3️⃣ `vercel.json`

**PRODUCTION (setiap jam):**

```json
{
  "crons": [
    { "path": "/api/cron/subscription", "schedule": "0 * * * *" },
    { "path": "/api/cron/interview", "schedule": "0 7 * * *" }
  ]
}
```

**TESTING (setiap menit):**

```json
{
  "crons": [
    { "path": "/api/cron/subscription", "schedule": "* * * * *" },
    { "path": "/api/cron/interview", "schedule": "0 7 * * *" }
  ]
}
```

---

### 4️⃣ cronjob.org (Manual Configuration)

Login ke dashboard [cronjob.org](https://cronjob.org) dan update schedule:

**PRODUCTION:**

- URL: `https://your-domain.vercel.app/api/cron/subscription`
- Schedule: `0 * * * *` (setiap jam)

**TESTING:**

- URL: `https://your-domain.vercel.app/api/cron/subscription`
- Schedule: `* * * * *` (setiap menit)

---

## ✅ Checklist Switching Mode

### Switch ke TESTING Mode (3 menit):

- [ ] Update `src/utils/dateHelper.ts` → 3 menit
- [ ] Update `src/jobs/subscriptionJobs.ts` (4 tempat):
  - [ ] Cron schedule reminder → `* * * * *`
  - [ ] Window checking reminder → `getSubscriptionsExpiringInMinutesWindow(1, 60)`
  - [ ] Cron schedule deactivation → `* * * * *`
  - [ ] Manual trigger function → `getSubscriptionsExpiringInMinutesWindow(1, 60)`
- [ ] Update `vercel.json` → `* * * * *`
- [ ] Update cronjob.org → `* * * * *`
- [ ] Build & deploy: `npm run build`
- [ ] Test subscription flow

### Switch ke PRODUCTION Mode (30 hari):

- [ ] Update `src/utils/dateHelper.ts` → 30 hari
- [ ] Update `src/jobs/subscriptionJobs.ts` (4 tempat):
  - [ ] Cron schedule reminder → `0 * * * *`
  - [ ] Window checking reminder → `getSubscriptionsExpiringInHoursWindow(24, 60)`
  - [ ] Cron schedule deactivation → `0 * * * *`
  - [ ] Manual trigger function → `getSubscriptionsExpiringInHoursWindow(24, 60)`
- [ ] Update `vercel.json` → `0 * * * *`
- [ ] Update cronjob.org → `0 * * * *`
- [ ] Build & deploy: `npm run build`
- [ ] Verify production settings

---

## 📝 Catatan Penting

### Cron Schedule Format

Cron format: `minute hour day month weekday`

- `* * * * *` = Setiap menit
- `0 * * * *` = Setiap jam (menit ke-0)
- `0 1 * * *` = Setiap hari jam 01:00
- `0 */6 * * *` = Setiap 6 jam

### Repository Methods

- `getSubscriptionsExpiringInMinutesWindow(minutes, windowSeconds)` - Untuk testing (menit)
- `getSubscriptionsExpiringInHoursWindow(hours, windowMinutes)` - Untuk production (jam)

### Email Deduplication

Cache duration: `2 * 60 * 60 * 1000` (2 jam)

- Mencegah duplikasi email reminder
- Tetap aman baik untuk mode testing maupun production

### Testing Tips

1. Untuk testing mode 3 menit:

   - Subscribe user baru
   - Tunggu 2 menit → email reminder seharusnya terkirim
   - Tunggu 1 menit lagi → subscription expired

2. Monitor logs:

   ```bash
   # Check cron execution
   vercel logs --follow

   # Check cronjob.org dashboard
   https://cronjob.org/logs
   ```

---

## 🚀 Quick Command Reference

```bash
# Build backend
npm run build

# Deploy to Vercel
vercel --prod

# Check database
npm run db:studio

# Manual test cron endpoint
curl https://your-domain.vercel.app/api/cron/subscription
```

---

## 🔍 Troubleshooting

### Email tidak terkirim?

- Cek cronjob.org logs
- Cek Vercel function logs
- Pastikan SMTP credentials benar di environment variables
- Cek deduplication cache (mungkin sudah terkirim dalam 2 jam terakhir)

### Subscription tidak expired?

- Cek cron job berjalan (Vercel logs / cronjob.org)
- Manual trigger: hit `/api/cron/subscription` endpoint
- Cek database: `expiresAt` vs current time

### Triple trigger (3x email)?

- Disable salah satu: Vercel cron, cronjob.org, atau internal cron
- Rekomendasi: pakai cronjob.org saja untuk serverless deployment

---

**Last Updated:** 2025-01-21
**Current Mode:** PRODUCTION (30 hari, H-1 reminder, setiap jam)
