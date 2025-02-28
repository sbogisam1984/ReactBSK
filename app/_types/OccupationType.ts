export interface Occupation {
  id: number
  occupationName: string
  occupationDescription: string | null
  isActive: boolean
  requiresDetails: boolean | null
}
