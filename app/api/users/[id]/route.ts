import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse, APIResponse } from "@/types/global";
import { NextResponse } from "next/server";

//READ a user by id
export async function GET(_:Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw  new NotFoundError("User");

    try {
        await dbConnect();

        const user = await User.findById(id);
        if (!user) throw new NotFoundError("User");

        return NextResponse.json({ success: true, data: user}, { status: 200 })
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

//DELETE a user
export async function DELETE(_:Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) throw  new NotFoundError("User");

    try {
        await dbConnect();

        const user = await User.findByIdAndDelete(id);
        if (!user) throw new NotFoundError("User");

        return NextResponse.json({ success: true, data: user}, { status: 204 })
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

//UPDATE a user by id
export async function POST(request:Request, { params }: { params: Promise<{ id: string }> })
:Promise<APIResponse> {
    const { id } = await params;
    if (!id) throw  new NotFoundError("User");

    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = UserSchema.partial().parse(body);

        const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true });
        if (!updatedUser) throw new NotFoundError("User");

        return NextResponse.json({ success: true, data: updatedUser}, { status: 200 })
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
