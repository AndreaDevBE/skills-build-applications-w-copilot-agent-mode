const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const isValidCodespaceName = /^[a-z0-9-]+$/i.test(codespaceName ?? '')

export const API_BASE_URL = isValidCodespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function normalizeRecords(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    for (const key of ['results', 'items', 'data']) {
      if (key in payload) {
        return normalizeRecords(payload[key])
      }
    }
  }

  throw new Error('The API returned an unsupported collection response.')
}
