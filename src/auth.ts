import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import { Setting } from '@/models/Setting';

const envAdminEmails = (
  process.env.ADMIN_EMAILS ||
  'info@drivetalk.nl,samkazah444@gmail.com,sami16kazah@gmail.com,samikazah@gmail.com'
)
  .split(',')
  .map((email) => email.trim().toLowerCase());

const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_SECRET || '',
    }),
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const inputEmail = (credentials?.email as string)?.trim().toLowerCase();
        const inputPassword = credentials?.password as string;

        if (!inputEmail || !inputPassword) return null;

        try {
          await connectDB();
          let settings = await Setting.findOne({ key: 'site_settings' });

          const dbAdminEmail = settings?.adminLoginEmail?.trim().toLowerCase() || 'info@drivetalk.nl';
          const dbAdminPassword = settings?.adminPassword || ENV_ADMIN_PASSWORD;

          const isEmailMatch =
            inputEmail === dbAdminEmail || envAdminEmails.includes(inputEmail);
          const isPasswordMatch =
            inputPassword === dbAdminPassword || inputPassword === ENV_ADMIN_PASSWORD;

          if (isEmailMatch && isPasswordMatch) {
            return {
              id: 'admin-1',
              name: 'Drive&Talk Admin',
              email: inputEmail,
              role: 'admin',
            };
          }
        } catch (error) {
          console.error('Error during admin credentials authorization:', error);
          // Fallback to env variables if DB is momentarily unreachable
          if (
            envAdminEmails.includes(inputEmail) &&
            inputPassword === ENV_ADMIN_PASSWORD
          ) {
            return {
              id: 'admin-1',
              name: 'Drive&Talk Admin',
              email: inputEmail,
              role: 'admin',
            };
          }
        }

        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || 'user';
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/nl/admin/login',
    error: '/nl/admin/login',
  },
});
