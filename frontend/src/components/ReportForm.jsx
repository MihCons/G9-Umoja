import { useState } from 'react'
import api from '../services/api'

function ReportForm() {
  const [formData, setFormData] = useState({
    phone: '',
    district: '',
    crop: '',
    symptom: '',
    severity: 'Low',
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const newReport = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
    }

    try {
      await api.post('/reports', newReport)
      setSubmitted(true)
      setFormData({
        phone: '',
        district: '',
        crop: '',
        symptom: '',
        severity: 'Low',
      })
    } catch (error) {
      console.error('Error sending report:', error)
    }
  }

  return (
    <div className="card">
      <h2>Report Crop Disease</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="crop"
          placeholder="Crop"
          value={formData.crop}
          onChange={handleChange}
          required
        />
        <textarea
          name="symptom"
          placeholder="Describe the symptom"
          value={formData.symptom}
          onChange={handleChange}
          required
        />
        <select
          name="severity"
          value={formData.severity}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Send Report</button>
      </form>

      {submitted && (
        <p className="success-message">Report submitted successfully.</p>
      )}
    </div>
  )
}

export default ReportForm