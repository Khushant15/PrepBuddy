const rateLimitMap = new Map<string, { count: number, lastReset: number }>()

export const checkRateLimit = (key: string, limit: number = 10, windowMs: number = 60000) => {
  const now = Date.now()
  const record = rateLimitMap.get(key) || { count: 0, lastReset: now }

  if (now - record.lastReset > windowMs) {
    record.count = 1
    record.lastReset = now
  } else {
    record.count += 1
  }

  rateLimitMap.set(key, record)

  if (record.count > limit) {
    return { success: false, retryAfter: Math.ceil((windowMs - (now - record.lastReset)) / 1000) }
  }

  return { success: true }
}
