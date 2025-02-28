"use server"

import { cookies } from "next/headers"
import { env } from "process"

export async function GetCookie(cookieName: string) {
    const cookie = cookies().get(cookieName)
    if (cookie) {
        return cookie
    }
    else {
        return undefined
    }
}

export async function SetCookie(cookieName: string, value: string) {
    const cookie = cookies().get(cookieName)

    if (!cookie) {
        cookies().set({
            name: cookieName,
            value: value,
            secure: true,
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 365 * 1000,
            expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
        });
    }
    else {
        cookies().set(cookieName, value)
    }
}
