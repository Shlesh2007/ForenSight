import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CaseListPage from './pages/CaseListPage'
import CaseDetailPage from './pages/CaseDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CaseListPage />} />
        <Route path="/cases/:caseId" element={<CaseDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
