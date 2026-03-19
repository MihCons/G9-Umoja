function ReportsTable({
  title = 'Incoming Reports',
  emptyMessage = 'No reports submitted yet.',
  reports,
  selectedReportIds = [],
  onToggleReport,
  onVerify,
  onReject,
  onEditReport,
}) {
  const showSelection = typeof onToggleReport === 'function'

  return (
    <div className="card">
      <h2>{title}</h2>

      <table>
        <thead>
          <tr>
            {showSelection && <th>Select</th>}
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
              <td colSpan={showSelection ? 9 : 8}>
                <div className="empty-message">{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                {showSelection && (
                  <td>
                    {(() => {
                      const isRejected = report.status === 'Rejected'
                      return (
                    <input
                      type="checkbox"
                      checked={selectedReportIds.includes(report.id)}
                      onChange={() => onToggleReport(report)}
                      disabled={isRejected}
                      aria-label={`Select report ${report.id}`}
                    />
                      )
                    })()}
                  </td>
                )}
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
                    <button onClick={() => onEditReport(report)}>
                      Add Details
                    </button>

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