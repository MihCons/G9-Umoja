import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import FarmerPage from './pages/FarmerPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<FarmerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App