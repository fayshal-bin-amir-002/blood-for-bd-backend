# 🛠️ Blood For BD — Backend

This is the backend server for **Blood For BD**, built with **Node.js**, **Express**, **Prisma**, and **TypeScript**. It handles authentication, donor data, blog posts, image uploads, and more — powering the Blood For BD platform.

---

## 🚀 API Features

- 🔐 **Authentication & Authorization**
  - Register & login with JWT tokens
  - Secure route protection
- 🩸 **Donor Management**
  - Register as a donor
  - Update donor profile, address & blood group
  - Fetch donors by division, district, upazila, and blood group
- 📊 **Impact Data**
  - Count total donations & active donors
  - Return stats for frontend visualization
- 🖼️ **Image Uploads**
  - Upload donation proof with secure storage
- ✍️ **Blog System**
  - Create, update, and delete blogs
  - Public community posts & admin moderation
- 📂 **Admin APIs**
  - Manage donors, blogs, users (optional)

---

## ⚙️ Tech Stack

- **Node.js** + **Express 5**
- **TypeScript** + **Zod**
- **PostgreSQL**
- **Prisma ORM**
- **JWT** for auth
- **Bcrypt** for password hashing
- **CORS**, **Cookie Parser**
- **Dotenv** for env config

---

## 📁 Common Scripts

```bash
npm run dev          # Start dev server with ts-node-dev
npm run build        # Compile TS and generate Prisma client
npm start            # Run compiled code (dist/server.js)
npm run prod         # Run in production mode
```
