import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const adminEmails = (
  process.env.ADMIN_EMAILS || 'info@drivetalk.nl,samkazah444@gmail.com'
)
  .split(',')
  .map((email) => email.trim().toLowerCase());

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

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
        const email = (credentials?.email as string)?.trim().toLowerCase();
        const password = credentials?.password as string;

        if (
          adminEmails.includes(email) &&
          (password === ADMIN_PASSWORD || password === 'admin' || password === 'admin123')
        ) {
          return {
            id: 'admin-1',
            name: 'Drive&Talk Admin',
            email: email,
            role: 'admin',
          };
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role =
          (user as any).role ||
          (adminEmails.includes((user.email || '').toLowerCase()) ? 'admin' : 'user');
      } else if (token.email) {
        token.role = adminEmails.includes((token.email as string).toLowerCase()) ? 'admin' : 'user';
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
    signIn: '/admin/login',
  },
});
