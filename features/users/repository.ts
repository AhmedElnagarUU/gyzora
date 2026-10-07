import { User } from '@/features/users/model'

export async function findUserByEmail(email: string) {
  return User.findOne({ email: email.toLowerCase() }).lean()
}

export async function findUserById(id: string) {
  return User.findById(id).lean()
}
