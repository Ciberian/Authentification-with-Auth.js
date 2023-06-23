import type { AuthOptions, User } from 'next-auth';
import GoggleProvider from 'next-auth/providers/google';
import YandexProvider from 'next-auth/providers/yandex';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

const mockUsers = [
  {
    id: '1',
    email: 'example@mail.com',
    name: 'Tomas Andersson',
    password: '123456',
    role: 'admin',
  },
  {
    id: '2',
    email: 'any@gmail.com',
    name: 'Agent Smith',
    password: '654321',
    role: 'guest',
  },
];

export const authConfig: AuthOptions = {
  providers: [
    GoggleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    YandexProvider({
      clientId: process.env.YANDEX_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const currentUser = mockUsers.find((user) => user.email === credentials.email);

        if (currentUser && currentUser.password === credentials.password) {
          const { password, ...userWithoutPass } = currentUser;

          return userWithoutPass as User;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/signin'
  }
};
