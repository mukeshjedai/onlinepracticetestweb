import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createRemoteJWKSet, jwtVerify } from "jose";

const googleClientId =
  process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "";

const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "google-one-tap",
      name: "Google One Tap",
      credentials: {
        credential: { type: "text" },
      },
      async authorize(credentials) {
        const idToken = credentials?.credential;
        if (!idToken || typeof idToken !== "string" || !googleClientId) {
          return null;
        }

        try {
          const { payload } = await jwtVerify(idToken, googleJwks, {
            issuer: ["https://accounts.google.com", "accounts.google.com"],
            audience: googleClientId,
          });

          if (!payload.email || payload.email_verified !== true) {
            return null;
          }

          return {
            id: String(payload.sub),
            email: String(payload.email),
            name: payload.name ? String(payload.name) : String(payload.email),
            image: payload.picture ? String(payload.picture) : undefined,
          };
        } catch (error) {
          console.error("Google One Tap token verify failed", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      if (account && profile) {
        token.email = profile.email ?? token.email;
        token.name = profile.name ?? token.name;
        token.picture = profile.picture ?? token.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name = (token.name as string) ?? session.user.name;
        session.user.image = (token.picture as string) ?? session.user.image;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
