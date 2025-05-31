import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

//READ all users
export async function GET() {
    try {
        await dbConnect();

        const users = await User.find();

        return NextResponse.json({ success: true, data: users }, { status: 200});
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

//CREATE a user 
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const validatedData = UserSchema.safeParse(body); // safely validates body against UserSchema, return obj with result { result: t|f, data: T}

        if(!validatedData.success) {
            throw new ValidationError(validatedData.error.flatten().fieldErrors);
        }
        
        const { email, username } = validatedData.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists');

        const existingUsername = await User.findOne({ username });
        if (existingUsername) throw new Error('Username already exists');

        const newUser = await User.create(validatedData.data);

        return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}