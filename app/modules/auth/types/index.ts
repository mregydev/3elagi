export type UserRole = 'patient' | 'doctor'

export interface LoginInput {
  email: string
  password: string
}

export interface SignupInput {
  role: UserRole
  fullName: string
  email: string
  password: string
  phone: string
  licenseNumber?: string
  specialization?: string
}
