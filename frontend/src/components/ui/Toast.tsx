import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const toastConfig: Record<ToastType, { icon: ReactNode; classes: string }> = {
  success: {
    icon: <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />,
    classes: 'border-green-800/60 bg-green-950/80',
  },
  error: {
    icon: <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
    classes: 'border-red-800/60 bg-red-950/80',
  },
  info: {
    icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
    classes: 'border-blue-800/60 bg-blue-950/80',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    classes: 'border-amber-800/60 bg-amber-950/80',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl text-sm text-white animate-in slide-in-from-right-2 fade-in duration-200 ${config.classes}`}
          >
            {config.icon}
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
