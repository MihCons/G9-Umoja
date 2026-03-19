import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { isAuthenticated, register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  function onChange(event) {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccessMessage('')
    try {
      const response = await register(formData)
      setSuccessMessage(
        response?.message || 'Registration submitted. Email Umoja@cropalert.com so we can verify your account.',
      )
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || 'Registration failed. Try a different username.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-layout page">
      <div className="auth-panel card">
        <p className="auth-eyebrow">Umoja Staff Access</p>
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Register for dashboard access. After registering, email Umoja@cropalert.com and we will verify your account in the database.
        </p>
        <form onSubmit={onSubmit} className="form">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={onChange}
            minLength={3}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={onChange}
            minLength={8}
            required
          />
          {successMessage ? <p className="success-message">{successMessage}</p> : null}
          {error ? <p className="error-message">{error}</p> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footnote">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage