import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CaseListPage from './pages/CaseListPage'
import CaseDetailPage from './pages/CaseDetailPage'
import ArtefactDetailPage from './pages/ArtefactDetailPage'
import TimelinePage from './pages/TimelinePage'
import ReportsPage from './pages/ReportsPage'
import CaseSettingsPage from './pages/CaseSettingsPage'
import AppSettingsPage from './pages/AppSettingsPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import { ToastProvider } from './components/ui/Toast'

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<CaseListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<AppSettingsPage />} />
          <Route path="/cases/:caseId" element={<CaseDetailPage />} />
          <Route path="/cases/:caseId/artefacts/:artefactId" element={<ArtefactDetailPage />} />
          <Route path="/cases/:caseId/timeline" element={<TimelinePage />} />
          <Route path="/cases/:caseId/reports" element={<ReportsPage />} />
          <Route path="/cases/:caseId/settings" element={<CaseSettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
