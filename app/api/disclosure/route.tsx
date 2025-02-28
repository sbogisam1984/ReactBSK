import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams
    const loanId: string | null = params.get('loanId');
    const pdfCode: string | null = params.get('pdfCode');

    const response = await fetch(process.env.API_BASE_URL + `/api/Meridian/${loanId}/Disclosure/${pdfCode}/PDF`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
    });

    if (!response.ok) {
        // throw error and/or redirect
        // log
        console.error("Error loading disclosure PDF");
    }
    else {
        const data = await response.blob();

        if (data) {
            return new Response(data, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename=PDF'
                }
            })
        }
        else {
            // throw error and/or redirect
            // log
        }
    }
}
