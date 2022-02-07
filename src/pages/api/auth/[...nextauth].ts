import { query as q } from 'faunadb'

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from '../../../services/fauna';

interface UserFaunaDB {
  ts: number;
  data: { email: string };
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    })
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user }) {
      const { email } = user;
      let updatedUser: UserFaunaDB;
      try {
        updatedUser = await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          )
        );
        console.log(updatedUser);
        return true;
      } catch (error) {
        return false;
      }
    },
  }
})