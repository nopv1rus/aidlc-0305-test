import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface CountdownRedirectProps {
  seconds?: number
}

export function CountdownRedirect({ seconds = 5 }: CountdownRedirectProps) {
  const [count, setCount] = useState(seconds)
  const navigate = useNavigate()
  const { tableToken } = useParams<{ tableToken: string }>()

  useEffect(() => {
    if (count <= 0) {
      navigate(`/order/${tableToken}`, { replace: true })
      return
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, navigate, tableToken])

  return (
    <p className="tabular-nums text-sm text-gray-500" aria-live="polite">
      {count}초 후 메뉴 화면으로 이동합니다
    </p>
  )
}
