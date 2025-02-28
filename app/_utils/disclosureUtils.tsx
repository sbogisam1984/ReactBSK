"use server";

import { redirect } from "next/navigation";
import { DisclosureAcceptRequest, DisclosureDocuSignInfo, DisclosureInfo } from "../_types/EnrollmentInfo";
import { revalidatePath } from "next/cache";

export async function AcceptDisclosure(enrollmentId: number, request: DisclosureAcceptRequest) {

    if (enrollmentId) {
        const disclosureResponse = await fetch(
            process.env.API_BASE_URL + `/api/Enrollment/${enrollmentId}/Disclosure`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request),
                credentials: 'include'
            }
        )

        if (!disclosureResponse.ok) {
            // TODO: log
        }
    }
}

export async function GetDocuSign(loanId: string, documentTitle: string): Promise<DisclosureDocuSignInfo | undefined> {

    let ret: DisclosureDocuSignInfo | undefined = undefined;
    const response = await fetch(process.env.API_BASE_URL + `/api/Enrollment/${loanId}/Disclosure/${documentTitle}/DocuSign`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error("Error loading disclosure DocuSign");
    }
    else {
        const data = await response.json();
        if (data.isSuccess) {
            ret = data.data;
        }
    }   

    return ret;
}

// This is not used directly but could be helpful for debugging/troubleshooting
export async function GetDisclosurePDF(loanId: string, pdfCode: string) {

    const response = await fetch(process.env.API_BASE_URL + `/api/Meridian/${loanId}/Disclosure/${pdfCode}/PDF`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error("Error loading disclosure PDF");
    }
    else {
        const data = await response.text(); //.blob();
        return data;
    }
}

export async function GetFooterDisclosures() : Promise<DisclosureInfo | undefined> {

    let ret: DisclosureInfo | undefined = undefined
    const response = await fetch(process.env.API_BASE_URL + `/api/Enrollment/Disclosure/Footer`, {
        method: 'GET',
        credentials: 'include',
    })
    .catch(e => {
        console.error("Error loading footer disclosures");
    });

    if (response && !response.ok) {
        console.error("Error loading footer disclosures");
    }
    else {
        if (response) {
          const data = await response.json()
          if (data.isSuccess) {
              ret = data.data
          }
        }
    }

    return ret;
}

export async function DisclosureNextNavigation() {
    redirect('/Decision');
}
