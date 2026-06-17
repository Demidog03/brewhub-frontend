import { apiPublic } from '@/core/api/api-public'
import type { LoginPayload, RegisterPayload } from './auth.api.types'

async function register(payload: RegisterPayload) {
  const response = await apiPublic.post('/auth/register', payload)
  return response.data
}

async function login(payload: LoginPayload) {
  const response = await apiPublic.post('/auth/login', payload)
  return response.data
}

const authApi = {
  register,
  login,
}

export default authApi
