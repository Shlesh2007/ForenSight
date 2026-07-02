export type MessageRole = 'user' | 'assistant'

export type Intent = 'factual' | 'timeline' | 'similarity' | 'summarisation' | 'unknown'

export interface Citation {
  event_id: string
  summary: string
  artefact_name: string
  timestamp?: string
}

export interface MessageSegment {
  text: string
  citation?: Citation   // if present, this segment is a citation link
  supported: boolean    // false → greyed out (no evidence backing)
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  segments?: MessageSegment[]  // populated for assistant messages
  intent?: Intent
  timestamp: string
}
