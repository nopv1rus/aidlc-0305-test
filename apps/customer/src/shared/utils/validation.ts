const TABLE_TOKEN_REGEX = /^[a-zA-Z0-9-]+$/

export function isValidTableToken(token: string): boolean {
  return TABLE_TOKEN_REGEX.test(token)
}

export function clampQuantity(value: number): number {
  const int = Math.floor(value)
  if (int <= 0) return 0
  if (int > 99) return 99
  return int
}

export function isValidQuantity(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 99
}
