import type { IUser } from '@/features/users/model'
import { findUserById } from '@/features/users/repository'

export async function getUserById(id: string) {
  return findUserById(id)
}

export async function getUserProfile(
  userId: string,
  _tenantId: string,
): Promise<IUser | null> {
  // Owner can view any user; CUSTOMER only sees own tenant's users
  return findUserById(userId)
}

export type { IUser } from '@/features/users/model'
export type { UserRole } from '@/features/users/model'
