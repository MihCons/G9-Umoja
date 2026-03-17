import { useEffect, useState } from 'react'
import api from '../services/api'
import { enqueueAlert, getAllQueued, dequeueAlert, clearQueue } from '../services/alertQueue'
import ReportsTable from '../components/ReportsTable'
import AlertsList from '../components/AlertsList'
import CreateAlertModal from '../components/CreateAlertModal'

function DashboardPage() {
  const [reports, setReports] = useState([])
  const [alerts, setAlerts] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [queuedCount, setQueuedCount] = useState(0)
  const [flushing, setFlushing] = useState(false)
  const [queuePaused, setQueuePaused] = useState(false)
  const queuePausedRef = useRef(false)
  const [selectedReportIds, setSelectedReportIds] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSending, setModalSending] = useState(false)
  const [modalError, setModalError] = useState('')

  async function fetchReports() {
    try {
      const response = await api.get('/reports')
      setReports(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  async function fetchAlerts() {
    try {
      const response = await api.get('/alerts')
      setAlerts(response.data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    }
  }

  async function syncQueueCount() {
    const items = await getAllQueued()
    setQueuedCount(items.length)
  }

  async function flushQueue() {
    if (queuePausedRef.current) return

    const items = await getAllQueued()
    if (!items.length) return

    setFlushing(true)
    for (const item of items) {
      // eslint-disable-next-line no-unused-vars
      const { id, queuedAt, ...alertData } = item
      try {
        await api.post('/alerts/send', alertData)
        await dequeueAlert(id)
      } catch {
        // leave in queue, will retry next time online
      }
    }
    setFlushing(false)
    syncQueueCount()
    fetchAlerts()
    fetchReports()
  }

  async function handleStopAndClearQueue() {
    setQueuePaused(true)
    queuePausedRef.current = true
    await clearQueue()
    setQueuedCount(0)
    setFlushing(false)
  }

  function handleResumeQueue() {
    setQueuePaused(false)
    queuePausedRef.current = false
    if (navigator.onLine) {
      flushQueue()
    }
  }

  function handleToggleReport(reportId) {
    setSelectedReportIds((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId],
    )
  }

  function handleSelectAllReports() {
    if (selectedReportIds.length === reports.length) {
      setSelectedReportIds([])
      return
    }
    setSelectedReportIds(reports.map((report) => report.id))
  }

  function handleOpenCombinedAlert() {
    if (selectedReportIds.length === 0) return
    setModalError('')
    setIsModalOpen(true)
  }

  async function handleSendCombinedAlert(alertData) {
    setModalError('')
    setModalSending(true)

    if (!navigator.onLine || queuePaused) {
      await enqueueAlert(alertData)
      await syncQueueCount()
      setModalSending(false)
      setIsModalOpen(false)
      setSelectedReportIds([])
      return
    }

    try {
      await api.post('/alerts/send', alertData)
      setIsModalOpen(false)
      setSelectedReportIds([])
      fetchAlerts()
      fetchReports()
    } catch (error) {
      await enqueueAlert(alertData)
      await syncQueueCount()
      setModalError('Send failed, alert added to offline queue.')
      setIsModalOpen(false)
      setSelectedReportIds([])
    } finally {
      setModalSending(false)
    }
  }

  useEffect(() => {
    queuePausedRef.current = queuePaused
  }, [queuePaused])

  useEffect(() => {
    fetchReports()
    fetchAlerts()
    syncQueueCount()

    const interval = setInterval(() => {
      fetchReports()
      fetchAlerts()
    }, 5000)

    function handleOnline() {
      setIsOnline(true)
      flushQueue()
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Flush any queued alerts left from a previous offline session
    if (navigator.onLine) {
      flushQueue()
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleVerify(id) {
    try {
      await api.put(`/reports/${id}/verify`)
      fetchReports()
    } catch (error) {
      console.error('Error verifying report:', error)
    }
  }

  async function handleReject(id) {
    try {
      await api.put(`/reports/${id}/reject`)
      fetchReports()
    } catch (error) {
      console.error('Error rejecting report:', error)
    }
  }

  const selectedReports = reports.filter((report) => selectedReportIds.includes(report.id))

  return (
    <div className="page">
      {!isOnline && (
        <div className="offline-banner">
          <span>
            You are offline — alerts will be queued and sent automatically when the connection is restored.
            {queuedCount > 0 && ` (${queuedCount} queued)`}
          </span>
          {queuedCount > 0 && (
            <button type="button" className="queue-clear-btn" onClick={handleStopAndClearQueue} aria-label="Stop queue and clear all queued alerts">
              ×
            </button>
          )}
        </div>
      )}
      {isOnline && queuedCount > 0 && (
        <div className="sync-banner">
          <span>
            {queuePaused
              ? `${queuedCount} queued alert(s) paused`
              : flushing
              ? `Sending ${queuedCount} queued alert(s)…`
              : `${queuedCount} queued alert(s) — reconnected, sending now…`}
          </span>
          <button type="button" className="queue-clear-btn" onClick={handleStopAndClearQueue} aria-label="Stop queue and clear all queued alerts">
            ×
          </button>
          {queuePaused && (
            <button type="button" className="queue-resume-btn" onClick={handleResumeQueue}>
              Resume Queue
            </button>
          )}
        </div>
      )}
      <section className="hero-banner card dashboard-hero">
        <p className="auth-eyebrow">Operations Dashboard</p>
        <h1>Disease Monitoring Control Center</h1>
        <p>Review incoming reports, verify field intelligence, and publish district-level alerts.</p>
      </section>
      <ReportsTable
        reports={reports}
        selectedReportIds={selectedReportIds}
        onToggleReport={handleToggleReport}
        onSelectAll={handleSelectAllReports}
        onVerify={handleVerify}
        onReject={handleReject}
        onCreateCombinedAlert={handleOpenCombinedAlert}
      />
      <AlertsList alerts={alerts} />

      {isModalOpen && (
        <CreateAlertModal
          report={alertReport}
          onClose={() => setAlertReport(null)}
          onSent={handleAlertSent}
        />
      )}
    </div>
  )
}

export default DashboardPage