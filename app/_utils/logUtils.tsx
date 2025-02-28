"use server";

import { GetCookie } from "./cookieUtils";

export async function LogDetails(enrollmentId: number, transactionType: number, details: string) {
    await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + `/api/Log`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "enrollmentId": enrollmentId, "transactionType": transactionType, "details": details }),
            credentials: 'include'
        }
    )
    .catch(e => {
        // TODO: Log error
    })
}

export async function Log(transactionType: number, details: string) {

    const enrollmentCookie = await GetCookie("enrollment")
    if (enrollmentCookie) {
        const enrollmentId: number = +enrollmentCookie.value
        await LogDetails(enrollmentId, transactionType, details)
    }    
}
