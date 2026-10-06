import { useCallback, useEffect, useState } from 'react'
import { API_BASE_URL, normalizeRecords } from '../api.js'
import ResourceList from './ResourceList.jsx'

function Workouts() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const retry = useCallback(() => setRefreshKey((key) => key + 1), [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${API_BASE_URL}/api/workouts/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Could not load workouts (HTTP ${response.status}).`)
        }
        setRecords(normalizeRecords(await response.json()))
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Could not load workouts.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()
    return () => controller.abort()
  }, [refreshKey])

  return (
    <ResourceList
      error={error}
      loading={loading}
      onRetry={retry}
      records={records}
      title="Workouts"
    />
  )
}

export default Workouts
