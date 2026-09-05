# Drive-And-Talk

# Drive&Talk Academy - Production Bilingual Web Application

Drive&Talk is an integrated educational academy web application for language and vocational learning in the Netherlands. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, Material UI Icons, Framer Motion, Auth.js v5 (NextAuth), MongoDB Atlas (Mongoose), Cloudinary, and Mailjet.

## 🚀 Key Features

- **Bilingual Support (i18n)**: Fully internationalized in Dutch (`nl`) and English (`en`) using `next-intl`. Includes a sticky language switcher toggle.
- **Dynamic Course Directory**: Filter courses by category (`Dutch`, `English`, `Driving`, `Chemistry`, `Other`) with detailed syllabus views and interactive enrollment modal.
- **Google OAuth Authentication**: Powered by Auth.js v5 (NextAuth) with automatic role resolution for administrators based on `ADMIN_EMAILS`.
- **Authenticated Reviews System**: Visitors can browse reviews, while authenticated Google users can submit 1-5 star ratings and feedback.
- **Mailjet Email Workflows**: Automated lead notifications sent to the academy admin and branded HTML responses sent directly to students.
- **Protected Admin Dashboard**: Overview metrics, Course CRUD with Cloudinary thumbnail upload, Success Story CRUD, Inquiries Inbox, and dynamic site settings.
- **PWA Ready**: Web application manifest configured with `#00B050` brand theme.

---

## 🛠️ Environment Variables Setup

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:
- `MONGODB_URI`: MongoDB Atlas connection URI.
- `AUTH_SECRET` / `NEXTAUTH_SECRET`: Secret key for session encryption.
- `GOOGLE_ID` / `GOOGLE_SECRET`: Google OAuth app credentials.
- `ADMIN_EMAILS`: Comma-separated list of admin email addresses.
- `MAILJET_API_KEY` / `MAILJET_SECRET_KEY`: Node Mailjet API credentials.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Cloudinary media upload credentials.

---

## 🏃 Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

Build for production:
```bash
npm run build
npm start
```
