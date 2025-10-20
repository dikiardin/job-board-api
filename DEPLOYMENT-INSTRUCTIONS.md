# Instruksi Deployment untuk Testing Subscription Cron Job

## Ringkasan Perubahan

Kode telah dimodifikasi untuk testing subscription cron job dengan:

- ✅ Durasi subscription: **3 menit** (dari 30 hari)
- ✅ Email reminder: **1 menit sebelum expired** (dari 24 jam)
- ✅ Cron job frequency: **Setiap 1 menit** (dari 10/15 menit)

---

## Langkah 1: Build Aplikasi

```bash
cd d:\purwadhika\final-project\job-board-api
npm run build
```

Build akan mengcompile TypeScript ke JavaScript di folder `dist/`.

---

## Langkah 2: Commit dan Push ke GitHub

```bash
# Check status perubahan
git status

# Add semua perubahan
git add .

# Commit dengan pesan yang jelas
git commit -m "test: Ubah subscription duration ke 3 menit untuk testing cron job"

# Push ke branch testing-final
git push origin testing-final
```

---

## Langkah 3: Deploy ke Vercel

### Opsi A: Auto Deploy (Recommended)

Jika Vercel sudah terhubung dengan GitHub repository:

1. Push akan otomatis trigger deployment
2. Tunggu beberapa menit sampai deployment selesai
3. Check di Vercel dashboard untuk status deployment

### Opsi B: Manual Deploy via Vercel CLI

```bash
# Install Vercel CLI jika belum
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod
```

---

## Langkah 4: Verifikasi Deployment

1. **Akses Vercel Dashboard**

   - Buka https://vercel.com/dashboard
   - Pilih project job-board-api
   - Pastikan deployment status: "Ready"

2. **Check Deployment URL**
   - Salin deployment URL (misalnya: `https://job-board-api.vercel.app`)
   - Test endpoint health check jika ada

---

## Langkah 5: Testing Subscription Cron Job

### A. Persiapan Testing

1. Login ke web app yang sudah di-deploy
2. Siapkan email yang bisa diakses untuk menerima notification
3. Siapkan timer/stopwatch untuk monitoring

### B. Skenario Testing

**Timeline Testing:**

```
T+0 menit   : Buat subscription baru
T+2 menit   : Email reminder seharusnya dikirim (1 menit sebelum expired)
T+3 menit   : Subscription expired (status berubah ke EXPIRED)
```

**Langkah Testing:**

1. **Subscribe (T+0 menit)**

   ```
   - Buat subscription baru melalui web app
   - Catat waktu mulai subscription
   - Verifikasi subscription status = ACTIVE
   ```

2. **Monitor Email Reminder (T+2 menit)**

   ```
   - Tunggu ~2 menit setelah subscribe
   - Check inbox email untuk reminder expiration
   - Email subject: "Your Subscription is Expiring Soon"
   ```

   **Jika email tidak masuk:**

   - Trigger manual endpoint: `GET https://your-domain.vercel.app/api/cron/subscription`
   - Check spam folder

3. **Verifikasi Expiration (T+3 menit)**

   ```
   - Setelah 3 menit, check status subscription di database
   - Status seharusnya berubah dari ACTIVE → EXPIRED
   ```

   **Jika status tidak berubah:**

   - Trigger manual endpoint: `GET https://your-domain.vercel.app/api/cron/subscription`
   - Refresh halaman atau query database

### C. Manual Trigger Cron Endpoint

Karena Vercel cron job terjadwal hanya jalan 1x sehari (01:00), gunakan manual trigger untuk testing:

**Endpoint:**

```
GET https://your-domain.vercel.app/api/cron/subscription
```

**Cara Trigger:**

```bash
# Via curl
curl https://your-domain.vercel.app/api/cron/subscription

# Via browser
# Buka URL di browser: https://your-domain.vercel.app/api/cron/subscription

# Expected response:
# {"ok": true}
```

**Kapan trigger manual?**

- Untuk force check expiration dan send email
- Jika cron otomatis belum jalan
- Untuk testing immediate

---

## Langkah 6: Monitoring dan Verifikasi

### Check Database

```sql
-- Check subscription yang baru dibuat
SELECT id, userId, status, startDate, expiresAt, createdAt
FROM Subscription
WHERE userId = YOUR_USER_ID
ORDER BY createdAt DESC
LIMIT 1;

-- Check subscription yang expired
SELECT * FROM Subscription
WHERE status = 'EXPIRED'
AND expiresAt > DATE_SUB(NOW(), INTERVAL 10 MINUTE);
```

### Check Logs di Vercel

1. Buka Vercel Dashboard → Project → Logs
2. Filter logs untuk melihat cron job execution
3. Look for:
   - `[CRON] Failed to send expiration reminders` (error)
   - `[CRON] Failed to deactivate expired subscriptions` (error)

### Check Email Delivery

1. Check inbox email yang digunakan untuk subscribe
2. Check spam/junk folder
3. Verifikasi email content:
   - Subject: "Your Subscription is Expiring Soon"
   - Body: Informasi subscription dan expiry date

---

## Troubleshooting

### Email Tidak Terkirim

**Possible causes:**

- Nodemailer configuration error
- Email service blocked/rate limited
- Wrong email address

**Solutions:**

- Check Vercel logs untuk error messages
- Verify nodemailer config di `src/config/nodemailer.ts`
- Trigger manual endpoint
- Test dengan email provider berbeda (Gmail, etc)

### Status Tidak Berubah ke EXPIRED

**Possible causes:**

- Cron job tidak jalan
- Time zone issue
- Database connection error

**Solutions:**

- Trigger manual endpoint `/api/cron/subscription`
- Check Vercel logs
- Verify database connection
- Check system time di server

### Deployment Gagal

**Possible causes:**

- Build error
- Environment variables tidak set
- Database tidak accessible dari Vercel

**Solutions:**

- Check build logs di Vercel
- Verify all env variables set di Vercel dashboard
- Test build locally: `npm run build`
- Check database URL dan credentials

---

## Environment Variables yang Diperlukan

Pastikan env variables berikut sudah di-set di Vercel:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Catatan Penting

1. **Vercel Cron Limitation**

   - Vercel cron di `vercel.json` hanya jalan sesuai schedule (daily at 01:00)
   - Untuk testing real-time, HARUS trigger manual endpoint
   - Local cron (`cron.schedule`) tidak berjalan di Vercel serverless

2. **Testing Window**

   - Total testing time: ~5 menit (termasuk buffer)
   - Siapkan monitoring tools (email, database client, timer)
   - Jangan lakukan testing di production dengan user aktif

3. **Setelah Testing Selesai**
   - WAJIB revert perubahan menggunakan panduan di `REVERT-SUBSCRIPTION-TEST.md`
   - Test ulang dengan durasi 30 hari
   - Deploy ulang ke production

---

## Checklist Deployment

- [ ] Build berhasil tanpa error
- [ ] Commit dan push ke GitHub
- [ ] Vercel deployment success
- [ ] Environment variables sudah di-set
- [ ] Endpoint health check accessible
- [ ] Database connection working
- [ ] Email service configured
- [ ] Manual trigger endpoint tested
- [ ] Ready untuk testing subscription cron

---

## Next Steps

Setelah deployment berhasil:

1. ✅ Test subscription flow end-to-end
2. ✅ Monitor email delivery
3. ✅ Verify status changes di database
4. ✅ Document hasil testing
5. ✅ **REVERT perubahan** menggunakan `REVERT-SUBSCRIPTION-TEST.md`

**Selamat testing! 🚀**
