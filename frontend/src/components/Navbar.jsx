import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Umoja Crop Alert System</h2>
      <div className="nav-links">
        <Link to="/">Farmer Report</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  )
}

export default Navbar