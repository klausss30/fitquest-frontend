import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import WeekPage from './pages/WeekPage'
import PlanPage from './pages/PlanPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RecordsPage from './pages/RecordsPage'
import RecordDetailPage from './pages/RecordDetailPage'
import ProfilePage from './pages/ProfilePage'
import WorkoutPage from './pages/WorkoutPage'
import OnboardingPage from './pages/OnboardingPage'
import SettingsPage from './pages/SettingsPage'

// Routes that require an authenticated user.
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth()
  return user && token ? <>{children}</> : <Navigate to="/login" replace />
}

// Authenticated users skip login and registration pages.
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth()
  return user && token ? <Navigate to="/" replace /> : <>{children}</>
}

function AppRoutes() {
  return (
    <div className="min-h-dvh bg-[#FAFAF8] flex items-stretch justify-center sm:items-center">
      <div className="w-full min-h-dvh relative overflow-hidden sm:max-w-[430px]">
        <Routes>
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/"         element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/onboarding" element={<PrivateRoute><OnboardingPage /></PrivateRoute>} />
          <Route path="/week"     element={<PrivateRoute><WeekPage /></PrivateRoute>} />
          <Route path="/plan"     element={<PrivateRoute><PlanPage /></PrivateRoute>} />
          <Route path="/workout"  element={<PrivateRoute><WorkoutPage /></PrivateRoute>} />
          <Route path="/records"  element={<PrivateRoute><RecordsPage /></PrivateRoute>} />
          <Route path="/records/:id" element={<PrivateRoute><RecordDetailPage /></PrivateRoute>} />
          <Route path="/profile"  element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
