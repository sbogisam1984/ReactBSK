"use client"
import { Button } from "@mui/material";
import { DisclosureNextNavigation } from "../../../_utils/disclosureUtils";

export default function DisclosuresNext() {
    return (
        <div className="flex flex-row justify-end my-4">
            <Button variant="contained" onClick={async () => (await DisclosureNextNavigation())}>Next</Button>
        </div>
    )
}
