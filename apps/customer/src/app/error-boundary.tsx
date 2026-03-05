import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/shared/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('AppErrorBoundary caught:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
          <p className="text-lg font-semibold text-gray-900">예기치 않은 오류가 발생했습니다</p>
          <p className="mt-2 text-sm text-gray-500">새로고침해주세요.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            새로고침
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
