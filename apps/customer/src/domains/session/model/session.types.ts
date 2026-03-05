export interface SessionInfo {
  sessionId: string
  storeId: string
  tableId: string
  tableToken: string
  startedAt: string
}

export interface ValidateSessionResponse {
  session: {
    id: string
    storeId: string
    tableId: string
    startedAt: string
  } | null
  store: { id: string; name: string }
  table: { id: string; number: number }
}
