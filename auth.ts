import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";
import { SignInSchema } from "./lib/validations";
import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";

import Credentials from 'next-auth/providers/credentials';

// We'll check if the sign-in account type is credentials; if yes, then we
// skip. We'll handle it the other way around when doing email password-based auth.

// But if the account type is not credentials, we'll call this new 'signin-with-oauth'
// app and create oAuth accounts.

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Github, Google, Credentials({
        async authorize(credentials) {
            const validatedFields = SignInSchema.safeParse(credentials);

            if (validatedFields.success) {
                const { email, password } = validatedFields.data;

                const { data: existingAccount } = await (api.accounts.getByProvider(
                    email
                )) as ActionResponse<IAccountDoc>

                if (!existingAccount) return null;

                const { data: existingUser } = (await api.users.getById(
                    existingAccount.userId.toString()
                )) as ActionResponse<IUserDoc>;
                
                if (!existingUser) return null;

                const isValidPassword = await bcrypt.compare(password, existingAccount.password!)
            
                if (isValidPassword) {
                    return {
                        _id: existingUser._id,
                        name: existingUser.name,
                        email: existingUser.email,
                        image: existingUser.image
                    }
                }
            }
            return null;
        },
    })],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },

        async jwt({ token, account }) {
            if (account) {
                const { data: existingAccount, success } = (await api.accounts.getByProvider(
                    account.type === "credentials"
                        ? token.email!
                        : account.providerAccountId
                )) as ActionResponse<IAccountDoc>;
            
                if(!success || !existingAccount) return token;

                const userId = existingAccount.userId;

                if (userId) token.sub = userId.toString();
            }

            return token;
        },

        async signIn({ user, profile, account }) {
            if (account?.type === "credentials") return true;
            if (!account || !user) return false;
            
            const userInfo = {
                name: user.name!,
                email: user.email!,
                image: user.image!,
                username:
                    account.provider === "github"
                    ? (profile?.login as string)
                    : (user.name?.toLowerCase() as string)
            };

            const { success } = (await api.auth.oAuthSignIn({
                user: userInfo,
                provider: account.provider as "github" | "google",
                providerAccountId: account.providerAccountId,
            })) as ActionResponse;

            if (!success) return false;

            return true;
        }

    }
})