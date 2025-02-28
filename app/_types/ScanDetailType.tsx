export interface ScanDetails {
  queryId: number
  idScanUrl: string
  isPrimary: boolean
  applicantId: number
}

export interface ScanResponse {
  queryid: number
  captureresult?: CaptureResult
  capturedecision?: CaptureDecision
  qualifiers?: CaptureResult
  capturedata?: CaptureData
}

export interface CaptureResult {
  key: string
  message: string
}

export interface CaptureDecision {
  key: string
  message: string
}

export interface CaptureData {
  firstname?: string
  middlename?: string
  lastname?: string
  lastname2?: string
  lastname3?: string
  streetaddress?: string
  streetaddress2?: string
  streetaddress3?: string
  streetaddress4?: string
  streetaddress5?: string
  streetaddress6?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  monthofbirth?: string
  dayofbirth?: string
  yearofbirth?: number
  expirationdate?: string
  issuancedate?: string
  documentnumber?: string
  documenttype?: string
  templatetype?: string
  captureconfidencescore?: number
  capturefacialmatchscore?: string
}
