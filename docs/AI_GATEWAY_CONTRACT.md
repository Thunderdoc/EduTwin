# Secure AI gateway contract

Browser tools call only `VITE_AI_GATEWAY_URL`; model-provider credentials must never be placed in `VITE_*` variables.

## Request

`POST` JSON: `tool`, `prompt`, optional `grade`, `board`, `subject`, `language`, and approved curriculum `context`. Authentication uses the secure application session cookie. Maximum prompt length is 8,000 characters.

## Required server controls

1. Verify session and role; reject anonymous traffic.
2. Enforce per-user and per-IP rate/cost limits.
3. Validate input and supported tool names.
4. Retrieve only approved, age-appropriate curriculum records.
5. Treat user content and retrieved text as untrusted data, never system instructions.
6. Moderate requests and responses for child safety, self-harm, sexual content, violence, abuse, and personally identifying information.
7. Require citations for factual curriculum answers; return uncertainty instead of inventing a source.
8. Keep provider keys and service-role credentials server-side.
9. Store only sanitized request metadata and request IDs, not raw student prompts by default.
10. Set request timeouts, output limits, budget limits, and an emergency kill switch.

## Response

```json
{
  "answer": "...",
  "sources": [{ "title": "Approved lesson", "url": "...", "curriculumId": "..." }],
  "requestId": "...",
  "safety": { "grounded": true, "reviewed": false }
}
```

Return `401/403` for authorization failures, `422` for invalid input, `429` for limits, and `503` when the provider is unavailable. The client intentionally has no mock-answer fallback in production mode.
