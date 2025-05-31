"use server";

import { ZodError, ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import dbConnect from "../mongoose";
import { auth } from "@/auth";

type ActionOptions<T> = {
    params?: T;
    schema?: ZodType<T>;
    authorize?: boolean;
}

// 1. Check if the schema and params are provided and validated
// 2. Check if the user is authorized
// 3. Connect to the database
// 4. Return the params and session

async function action<T>({
    params,
    schema,
    authorize = false,
}: ActionOptions<T>) {
    if (schema && params) {
        try {
            schema.parse(params);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new ValidationError(error.flatten().fieldErrors as Record<string, string[]>)
            } else {
                return new Error("Schema validation failed")
            }
        } 
    }

    let session: Session | null = null;

    if (authorize) {
        session = await auth();
        
        if (!session) {
            return new UnauthorizedError();
        }
    }

    await dbConnect();

    return { params, session };
}

export default action;