import { User } from '@/models/User'

export async function findUserByEmail(email: string) {
  return User.findOne({ email: email.toLowerCase() }).lean()
}

export async function findUserById(id: string) {
  return User.findById(id).lean()
}
