function ReportsTable({
  reports,
  selectedReportIds,
  onToggleReport,
  onSelectAll,
  onVerify,
  onReject,
  onCreateCombinedAlert,
}) {
  const selectedCount = selectedReportIds.length
  const canCreateCombined = selectedCount > 0

  return (
    <div className="card">
      <h2>Incoming Reports</h2>
      <div className="reports-toolbar">
        <button type="button" onClick={onSelectAll} disabled={reports.length === 0}>
          {selectedCount === reports.length && reports.length > 0 ? 'Clear Selection' : 'Select All'}
        </button>
        <button type="button" onClick={onCreateCombinedAlert} disabled={!canCreateCombined}>
          Create Alert from Selected ({selectedCount})
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Phone</th>
            <th>District</th>
            <th>Crop</th>
            <th>Symptom</th>
            <th>Severity</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="9">
                <div className="empty-message">No reports submitted yet.</div>
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.phone}</td>
                <td>{report.district}</td>
                <td>{report.crop}</td>
                <td>{report.symptom}</td>
                <td>{report.severity}</td>
                <td>{report.date}</td>
                <td>
                  <span
                    className={`status-badge ${
                      report.status === 'Pending'
                        ? 'status-pending'
                        : report.status === 'Verified'
                        ? 'status-verified'
                        : 'status-rejected'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onVerify(report.id)}
                      disabled={report.status !== 'Pending'}
                    >
                      Verify
                    </button>

                    <button
                      onClick={() => onReject(report.id)}
                      disabled={report.status !== 'Pending'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportsTable