import { redirect } from "next/navigation";
import { DisclosureDocuSignInfo } from "@/app/_types/EnrollmentInfo"
import { GetDocuSign } from "@/app/_utils/disclosureUtils"

interface Params {
    loanId: string,
    documentTitle: string   
}

export default async function DisclosureDocuSignPage({ params }: {params:Params}) {
    const loanId: string = params.loanId
    const documentTitle: string = params.documentTitle
    
    const docuSignInfo: DisclosureDocuSignInfo | undefined = await GetDocuSign(loanId, documentTitle);

    if (docuSignInfo !== undefined) {
        redirect(docuSignInfo?.url ?? '')
    }
    else {
        return <p>Error loading DocuSign</p>
    }
}
