import NextAuth, { CredentialsSignin } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials';
import { supabase } from './app/_lib/supabase';
import { compare } from 'bcryptjs';
import { getUserProfile } from './lib/data-service';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .limit(1);

        if (error) {
          throw new CredentialsSignin('Internal error , please try again');
        }

        if (!data) {
          // No user found with the provided email
          throw new CredentialsSignin('Account does not exist');
        }

        const isValidPassword = await compare(password, data[0].password);

        if (!isValidPassword) {
          throw new CredentialsSignin('Invalid password or email');
        }

        console.log(data[0]);

        return {
          ...data[0]
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        const email = user.email;

        // Check if user already exists in the database
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .limit(1);

        if (!data.length) {
          // Create a new user if they don't exist
          const { error: insertError } = await createUserProfile({
            email,
            username: profile.name // You can use the profile name as the username
            // Add any additional fields needed here
          });

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }
        }
      }
      return true;
    },
    session: async ({ session }) => {
      const user = await getUserProfile(session.user?.email);
      session.user.id = user.id;
      session.user.username = user.username;
      return session;
    }
  }
});
