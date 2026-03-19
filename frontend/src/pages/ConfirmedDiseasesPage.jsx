import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'

function ConfirmedDiseasesPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPublicAlerts() {
      setLoading(true)
      setError('')

      try {
        const response = await api.get('/alerts/public')
        setAlerts(response.data || [])
      } catch (err) {
        setError('Unable to load confirmed diseases right now. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicAlerts()
  }, [])

  const confirmedAlerts = useMemo(
    () => alerts.filter((alert) => String(alert?.message || '').trim().length > 0),
    [alerts],
  )

  return (
    <div className="page">
      <section className="hero-banner card">
        <p className="auth-eyebrow">Public Advisory</p>
        <h1>Confirmed Disease Alerts</h1>
        <p>
          This page shows diseases that have been confirmed by district teams and published as official alerts.
        </p>
      </section>

      <section className="card">
        <h2>Published Alerts</h2>

        {loading ? <div className="empty-message">Loading confirmed diseases...</div> : null}

        {!loading && error ? <div className="error-message">{error}</div> : null}

        {!loading && !error && confirmedAlerts.length === 0 ? (
          <div className="empty-message">No confirmed disease alerts have been published yet.</div>
        ) : null}

        {!loading && !error
          ? confirmedAlerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <p>
                  <strong>District:</strong> {alert.district}
                </p>
                <p>
                  <strong>Disease Alert:</strong> {alert.message}
                </p>
                <p>
                  <strong>Date:</strong> {alert.alert_date || 'Unknown'}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge status-${String(alert.status || '').toLowerCase()}`}>
                    {alert.status || 'draft'}
                  </span>
                </p>
              </div>
            ))
          : null}
      </section>
    </div>
  )
}

export default ConfirmedDiseasesPage
