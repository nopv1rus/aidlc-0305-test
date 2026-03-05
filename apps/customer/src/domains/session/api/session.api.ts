import { axiosInstance, useMock } from '@/shared/api/axios-instance'
import type { ValidateSessionResponse } from '../model/session.types'
import mockSession from '@/mocks/session.json'

export async function validateSession(tableToken: string): Promise<ValidateSessionResponse> {
  if (useMock) {
    await new Promise((r) => setTimeout(r, 300))
    return mockSession as ValidateSessionResponse
  }
  const { data } = await axiosInstance.get<ValidateSessionResponse>(
    `/api/sessions/validate`,
    { params: { tableToken } },
  )
  return data
}
