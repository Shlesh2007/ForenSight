import { Bot, User } from 'lucide-react'
import CitationLink from './CitationLink'
import type { Message } from '../../types/copilot'

interface Props {
  message: Message
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-navy-600' : 'bg-navy-800 border border-navy-600'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-white" />
          : <Bot className="w-4 h-4 text-navy-300" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-navy-700 text-white rounded-tr-sm'
            : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm'
        }`}>
          {/* Render segments (with citations) or plain text */}
          {message.segments && message.segments.length > 0
            ? message.segments.map((seg, i) =>
                seg.citation
                  ? <CitationLink key={i} citation={seg.citation} />
                  : <span key={i} className={seg.supported ? '' : 'text-gray-500'}>
                      {seg.text}
                    </span>
              )
            : message.content
          }
        </div>
        <span className="text-xs text-gray-600 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
