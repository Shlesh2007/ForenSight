import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import MessageBubble from './MessageBubble'
import { mockMessages } from '../../services/mockData'
import type { Message } from '../../types/copilot'

// Demo responses — replace with real API calls in production
const DEMO_RESPONSES: Record<string, Partial<Message>> = {
  default: {
    content: 'Based on the evidence in this case, powershell.exe (PID 4821) established an outbound connection to 192.168.1.50:443 at 14:32:11 UTC [E:e4a3f9b2] and subsequently a file named "update.exe" was accessed by curl.exe (PID 5210) [E:e5b812c3]. The process was spawned by cmd.exe (PID 3120) which was itself a child of WINWORD.EXE (PID 2340) [E:e1cc41d4].',
    segments: [
      { text: 'Based on the evidence in this case, powershell.exe (PID 4821) established an outbound connection to 192.168.1.50:443 at 14:32:11 UTC ', supported: true },
      { text: '[E:e4a3f9b2]', supported: true, citation: { event_id: 'e4a3f9b2', summary: 'CONNECTED_TO: powershell.exe → 192.168.1.50:443', artefact_name: 'memory.dmp', timestamp: '2024-03-10T14:32:11Z' } },
      { text: ' and subsequently a file named "update.exe" was accessed by curl.exe (PID 5210) ', supported: true },
      { text: '[E:e5b812c3]', supported: true, citation: { event_id: 'e5b812c3', summary: 'ACCESSED: curl.exe → update.exe', artefact_name: 'memory.dmp', timestamp: '2024-03-10T14:32:15Z' } },
      { text: '. The process was spawned by cmd.exe (PID 3120) which was itself a child of WINWORD.EXE (PID 2340) ', supported: true },
      { text: '[E:e1cc41d4]', supported: true, citation: { event_id: 'e1cc41d4', summary: 'PARENT_OF: WINWORD.EXE → cmd.exe', artefact_name: 'memory.dmp', timestamp: '2024-03-10T14:01:00Z' } },
      { text: '.', supported: true },
    ],
  },
}

interface Props {
  caseId: string
}

export default function ChatPanel({ caseId }: Props) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const q = input.trim()
    if (!q || loading) return

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simulate API latency
    await new Promise((r) => setTimeout(r, 1200))

    const demo = DEMO_RESPONSES.default
    const assistantMsg: Message = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: demo.content!,
      segments: demo.segments as Message['segments'],
      intent: 'factual',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const SUGGESTIONS = [
    'What did powershell.exe connect to?',
    'Summarise the timeline for Administrator',
    'Are there any persistence mechanisms?',
    'What files were modified after 14:00?',
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-navy-300" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-xs bg-gray-900 border border-gray-700 hover:border-navy-500 text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="flex items-end gap-3 bg-gray-900 border border-gray-700 focus-within:border-navy-500 rounded-2xl px-4 py-3 transition-colors">
          <textarea
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none focus:outline-none max-h-32 min-h-[24px]"
            placeholder="Ask anything about this investigation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-navy-700 hover:bg-navy-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Every answer cites evidence IDs. Click <span className="font-mono">[E:uuid]</span> to jump to the source artefact.
        </p>
      </div>
    </div>
  )
}
