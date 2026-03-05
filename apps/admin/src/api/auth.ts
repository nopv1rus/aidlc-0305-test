import client from './client'
import type { LoginResponse } from '@/types'

export const loginAdmin = (storeIdentifier: string, password: string) =>
  client.post<LoginResponse>('/auth/login', { storeIdentifier, password })

export const loginSuperAdmin = (username: string, password: string) =>
  client.post<LoginResponse>('/auth/super-login', { username, password })
