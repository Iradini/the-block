import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BrowsePage } from './pages/BrowsePage'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
