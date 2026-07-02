import axios from 'axios'
import type { GraphData } from '../types/graph'

const client = axios.create({ baseURL: '/api' })

export async function getGraph(caseId: string): Promise<GraphData> {
  const { data } = await client.get(`/graph/${caseId}`)
  return data
}

export async function getNodeNeighbours(caseId: string, nodeId: string): Promise<GraphData> {
  const { data } = await client.get(`/graph/${caseId}/node/${nodeId}/neighbours`)
  return data
}
