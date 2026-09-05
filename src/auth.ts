import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = (
  process.env.ADMIN_EMAILS || 'info@drivetalk.nl,samkazah444@gmail.com'
)
  .split(',')
  .map((email) => email.trim().toLowerCase());

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_SECRET || '',
    }),
  ],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const isUserAdmin = adminEmails.includes(user.email.toLowerCase());
        token.role = isUserAdmin ? 'admin' : 'user';
      } else if (token.email) {
        const isUserAdmin = adminEmails.includes((token.email as string).toLowerCase());
        token.role = isUserAdmin ? 'admin' : 'user';
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
    signIn: '/api/auth/signin',
  },
});
