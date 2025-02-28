import { ReactNode } from "react"

export interface WizardStep {
    title: string,
    content?: ReactNode
}

export default interface WizardType {
    activeStepIndex: number;
}
