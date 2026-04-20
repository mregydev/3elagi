export type OnboardingGender = '' | 'male' | 'female' | 'other' | 'prefer_not'
export type YesNo = '' | 'yes' | 'no'

export interface OnboardingAnswers {
  name: string
  dob: string
  gender: OnboardingGender
  conditions: string[]
  hasMeds: YesNo
  meds: string
  allergies: string[]
  hasInsurance: YesNo
  insuranceProvider: string
  documents: string[]
}

export interface IntakeAnswers {
  visitReason: string
  symptomDuration: string
  painLevel: string
  symptoms: string[]
  documents: string[]
}

export type UploadState = 'pending' | 'uploaded' | 'review' | 'approved' | 'rejected'

export interface UploadDocument {
  title: string
  subtitle: string
  state: UploadState
}
