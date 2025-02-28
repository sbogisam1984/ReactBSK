export enum ManualIdVerificationStatusEnum {
    INVALIDAPPLICANT,
    VERIFIED,
    REQUIRESKBA,
    REQUIRESSTEPUP
}

export interface IdIQResult {
    manualIdVerificationStatus: ManualIdVerificationStatusEnum;
}
