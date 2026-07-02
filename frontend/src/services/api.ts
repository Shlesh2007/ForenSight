import axios from 'axios'
import type { CaseSummary, CaseDetail, KeyIndicators } from '../types/case'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Cases ──────────────────────────────────────────────────────────────────

export async function getCases(): Promise<CaseSummary[]> {
  const { data } = await client.get('/cases')
  return data
}

export async function getCase(caseId: string): Promise<CaseDetail> {
  const { data } = await client.get(`/cases/${caseId}`)
  return data
}

export async function createCase(payload: { name: string; description: string }): Promise<CaseSummary> {
  const { data } = await client.post('/cases', payload)
  return data
}

export async function getKeyIndicators(caseId: string): Promise<KeyIndicators> {
  const { data } = await client.get(`/cases/${caseId}/indicators`)
  return data
}

// ── Artefacts ──────────────────────────────────────────────────────────────

export async function uploadArtefact(caseId: string, file: File): Promise<void> {
  const form = new FormData()
  form.append('file', file)
  await client.post(`/artefacts/${caseId}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
