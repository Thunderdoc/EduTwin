export interface AISource { title: string; url?: string; curriculumId?: string }
export interface AIRequest {
  tool: string;
  prompt: string;
  grade?: number;
  board?: string;
  subject?: string;
  language?: string;
  context?: Array<{ title: string; content: string; source: AISource }>;
}
export interface AIResponse { answer: string; sources: AISource[]; requestId: string; safety: { grounded: boolean; reviewed: boolean } }

const endpoint = import.meta.env.VITE_AI_GATEWAY_URL || '';

export function isAIGatewayConfigured() { return Boolean(endpoint); }

export async function requestAI(input: AIRequest, signal?: AbortSignal): Promise<AIResponse> {
  if (!endpoint) throw new Error('AI is not configured for this deployment. Ask an administrator to connect the secure AI gateway.');
  if (!input.prompt.trim() || input.prompt.length > 8_000) throw new Error('Enter a question between 1 and 8,000 characters.');
  const response = await fetch(endpoint, {
    method: 'POST', credentials: 'include', signal,
    headers: { 'content-type': 'application/json', 'x-eduflow-client': 'web-v2' },
    body: JSON.stringify({ ...input, prompt: input.prompt.trim() }),
  });
  if (response.status === 429) throw new Error('The AI study limit has been reached. Please try again later.');
  if (!response.ok) throw new Error('The secure AI service could not complete this request.');
  const data = await response.json() as Partial<AIResponse>;
  if (!data.answer || !data.requestId || !Array.isArray(data.sources)) throw new Error('The AI service returned an invalid response.');
  return { answer: data.answer, requestId: data.requestId, sources: data.sources, safety: data.safety || { grounded: false, reviewed: false } };
}
