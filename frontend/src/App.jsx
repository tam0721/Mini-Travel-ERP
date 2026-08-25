import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BookingListPage from './pages/BookingListPage'
import BookingFormPage from './pages/BookingFormPage'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
})

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><BookingListPage /></PrivateRoute>} />
          <Route path="/bookings/new" element={<PrivateRoute><BookingFormPage /></PrivateRoute>} />
          <Route path="/bookings/:id/edit" element={<PrivateRoute><BookingFormPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
