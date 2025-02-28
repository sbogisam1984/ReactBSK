import { NextRequest, NextResponse } from "next/server"
import { CreateEnrollment } from "./app/_utils/enrollmentUtils"

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const enrollmentCookie = request.cookies.get('enrollment')
    if (!enrollmentCookie) {

        const enrollmentResponse = await CreateEnrollment("enrollment");
        const enrollmentId: number = Number(enrollmentResponse.enrollmentId)
        response.cookies.set("enrollment", enrollmentId.toString())
    }

    return response
}

export const config = {
    matcher: '/',
}
