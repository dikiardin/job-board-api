# 📋 Subscription System Documentation

## Overview

Sistem subscription ini memungkinkan pengguna untuk berlangganan berbagai paket premium dengan sistem pembayaran yang terintegrasi. Sistem ini mendukung multiple subscription plans, payment tracking, dan approval workflow.

## 🗄️ Database Schema

### SubscriptionPlan Model

```prisma
model SubscriptionPlan {
  id              Int     @id @default(autoincrement())
  planName        String
  planPrice       Decimal @db.Decimal(12, 2)
  planDescription String?

  subscriptions Subscription[]
}
```

### Subscription Model

```prisma
model Subscription {
  id                 Int      @id @default(autoincrement())
  userId             Int
  subscriptionPlanId Int
  startDate          DateTime
  endDate            DateTime
  isActive           Boolean  @default(false)
  createdAt          DateTime @default(now())

  user     User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan     SubscriptionPlan @relation(fields: [subscriptionPlanId], references: [id], onDelete: Restrict)
  payments Payment[]

  @@index([userId])
  @@index([subscriptionPlanId])
}
```

### Payment Model

```prisma
model Payment {
  id                   Int           @id @default(autoincrement())
  subscriptionId       Int
  paymentMethod        PaymentMethod
  paymentProof         String?
  status               PaymentStatus @default(PENDING)
  amount               Decimal       @db.Decimal(12, 2)
  approvedAt           DateTime?
  gatewayTransactionId String?
  createdAt            DateTime      @default(now())
  expiredAt            DateTime?

  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([subscriptionId])
}
```

### Enums

```prisma
enum PaymentStatus {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}

enum PaymentMethod {
  TRANSFER
  GATEWAY
}
```

## 🛠️ API Endpoints

### Subscription Plan Management

#### 1. Get All Plans

- **Endpoint**: `GET /subscription/plans`
- **Access**: Public (Developer + User)
- **Description**: Mengambil semua subscription plans yang tersedia
- **Response**: Array of subscription plans

#### 2. Get Plan by ID

- **Endpoint**: `GET /subscription/plans/:id`
- **Access**: Public (Developer + User)
- **Description**: Mengambil detail subscription plan berdasarkan ID
- **Response**: Subscription plan object

#### 3. Create Plan

- **Endpoint**: `POST /subscription/plans`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "planName": "Premium Plan",
    "planPrice": 100000,
    "planDescription": "Premium features for job seekers"
  }
  ```
- **Response**: Created subscription plan

#### 4. Update Plan

- **Endpoint**: `PATCH /subscription/plans/:id`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "planName": "Updated Plan Name",
    "planPrice": 150000,
    "planDescription": "Updated description"
  }
  ```
- **Response**: Updated subscription plan

#### 5. Delete Plan

- **Endpoint**: `DELETE /subscription/plans/:id`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Subscription Management

#### 1. Get All Subscriptions

- **Endpoint**: `GET /subscription/subscriptions`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Mengambil semua subscriptions dengan detail user dan plan
- **Response**: Array of subscriptions with user and plan details

#### 2. Get Subscription by ID

- **Endpoint**: `GET /subscription/subscriptions/:id`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Subscription with user and plan details

#### 3. Get User Subscriptions

- **Endpoint**: `GET /subscription/my-subscriptions`
- **Access**: Authenticated users
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Mengambil semua subscriptions milik user yang sedang login
- **Response**: Array of user's subscriptions

#### 4. Get User Active Subscription

- **Endpoint**: `GET /subscription/my-active-subscription`
- **Access**: Authenticated users
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Mengambil subscription aktif user
- **Response**: Active subscription object or null

#### 5. Subscribe to Plan

- **Endpoint**: `POST /subscription/subscribe`
- **Access**: Authenticated users
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "planId": 1
  }
  ```
- **Response**: Created subscription and payment object

#### 6. Update Subscription

- **Endpoint**: `PATCH /subscription/subscriptions/:id`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "isActive": true,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-02-01T00:00:00.000Z"
  }
  ```
- **Response**: Updated subscription

### Payment Management

#### 1. Get Pending Payments

- **Endpoint**: `GET /subscription/pending-payments`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Mengambil semua payment yang masih pending
- **Response**: Array of pending payments

#### 2. Get Payment by ID

- **Endpoint**: `GET /subscription/payments/:id`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Payment details with subscription info

#### 3. Upload Payment Proof

- **Endpoint**: `POST /subscription/payments/:paymentId/upload-proof`
- **Access**: Authenticated users
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Body**: Image file
- **Description**: Upload bukti pembayaran untuk payment yang pending
- **Response**: Updated payment with Cloudinary details

#### 4. Approve Payment

- **Endpoint**: `PATCH /subscription/payments/:id/approve`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Menyetujui payment dan mengaktifkan subscription
- **Response**: Updated payment

#### 5. Reject Payment

- **Endpoint**: `PATCH /subscription/payments/:id/reject`
- **Access**: Developer only
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Menolak payment
- **Response**: Updated payment

#### 6. Get Payments by Subscription ID

- **Endpoint**: `GET /subscription/subscriptions/:subscriptionId/payments`
- **Access**: Authenticated users
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Mengambil semua payment untuk subscription tertentu
- **Response**: Array of payments

## 🔄 Business Logic Flow

### Subscription Process

1. **User memilih plan** → Call `POST /subscription/subscribe`
2. **System membuat subscription** → Status `isActive: false`
3. **System membuat payment record** → Status `PENDING`, expired dalam 24 jam
4. **User upload payment proof** → Call `POST /subscription/payments/:id/upload-proof`
5. **Developer approve payment** → Call `PATCH /subscription/payments/:id/approve`
6. **System mengaktifkan subscription** → `isActive: true`

### Payment Status Flow

```
PENDING → APPROVED (subscription activated)
PENDING → REJECTED
PENDING → EXPIRED (after 24 hours)
```

## 🛡️ Security & Validation

### Authentication

- Semua endpoint memerlukan JWT token (kecuali get plans)
- Token di-verify melalui `verifyToken` middleware

### Authorization

- **Developer**: Full access ke semua endpoints
- **User**: Hanya bisa akses endpoint yang relevan dengan data mereka

### Validation Rules

- Plan name harus unique
- User tidak bisa subscribe jika sudah ada active subscription
- Payment hanya bisa di-approve/reject jika status PENDING
- Plan tidak bisa dihapus jika masih digunakan oleh subscription

## 📊 Error Handling

### Common Error Responses

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

### Error Scenarios

- **404**: Plan/Subscription/Payment not found
- **400**: Validation errors, business logic violations
- **409**: Plan name already exists
- **401**: Unauthorized access
- **403**: Forbidden access (wrong role)

## 🔧 Technical Implementation

### Architecture

- **Controller**: Handle HTTP requests/responses
- **Service**: Business logic and validation
- **Repository**: Database operations
- **Middleware**: Authentication, authorization, file upload

### File Structure

```
src/
├── controllers/subscription/
│   ├── plan.controller.ts          # Subscription plan management
│   ├── subscription.controller.ts  # Subscription management
│   └── payment.controller.ts       # Payment management
├── services/subscription/
│   ├── plan.service.ts             # Plan business logic
│   ├── subscription.service.ts     # Subscription business logic
│   └── payment.service.ts          # Payment business logic
├── repositories/subscription/
│   ├── plan.repository.ts          # Plan database operations
│   ├── subscription.repository.ts  # Subscription database operations
│   └── payment.repository.ts       # Payment database operations
└── routers/
    └── subscription.router.ts       # Route definitions
```

### Dependencies

- **Prisma**: Database ORM
- **Cloudinary**: Image upload service
- **Express**: Web framework
- **Multer**: File upload handling

### File Upload

- Payment proof di-upload ke Cloudinary
- Supported formats: Images (JPG, PNG, etc.)
- File size limit: Configured in multer middleware

## 📝 Usage Examples

### 1. User Subscribe to Premium Plan

```bash
# 1. Get available plans
GET /subscription/plans

# 2. Subscribe to plan
POST /subscription/subscribe
{
  "planId": 1
}

# 3. Upload payment proof
POST /subscription/payments/1/upload-proof
# Upload image file

# 4. Check subscription status
GET /subscription/my-active-subscription
```

### 2. Developer Manage Payments

```bash
# 1. Get all pending payments
GET /subscription/pending-payments

# 2. Approve payment
PATCH /subscription/payments/1/approve

# 3. Check all subscriptions
GET /subscription/subscriptions
```

## 🚀 Future Enhancements

### Potential Improvements

1. **Auto-renewal**: Automatic subscription renewal
2. **Payment Gateway Integration**: Direct payment processing
3. **Email Notifications**: Payment status updates
4. **Subscription Analytics**: Usage tracking and reporting
5. **Trial Periods**: Free trial before subscription
6. **Proration**: Partial refunds for plan changes
7. **Webhook Support**: Real-time payment status updates

### Database Optimizations

1. **Indexing**: Additional indexes for better query performance
2. **Soft Delete**: Soft delete for audit trails
3. **Audit Logs**: Track all subscription changes
4. **Data Archiving**: Archive old payment records

---

_Dokumentasi ini dibuat untuk sistem subscription Job Board API. Terakhir diperbarui: $(date)_
