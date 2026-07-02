import axios from 'axios'
import type { Message } from '../types/copilot'

const client = axios.create({ baseURL: '/api' })

export async function sendMessage(caseId: string, question: string): Promise<Message> {
  const { data } = await client.post(`/copilot/${caseId}/ask`, { question })
  return data
}

export async function getChatHistory(caseId: string): Promise<Message[]> {
  const { data } = await client.get(`/copilot/${caseId}/history`)
  return data
}
