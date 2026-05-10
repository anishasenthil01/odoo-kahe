import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CreateTrip from './pages/CreateTrip';
import TripList from './pages/TripList';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ActivitySearch from './pages/ActivitySearch';
import BudgetDashboard from './pages/BudgetDashboard';
import PackingList from './pages/PackingList';
import TripNotes from './pages/TripNotes';
import PublicItinerary from './pages/PublicItinerary';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/public/:id" element={<PublicItinerary />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="trips" element={<TripList />} />
              <Route path="trips/create" element={<CreateTrip />} />
              <Route path="itinerary/:id" element={<ItineraryBuilder />} />
              <Route path="itinerary/:id/activities/:stopId" element={<ActivitySearch />} />
              <Route path="itinerary/:id/budget" element={<BudgetDashboard />} />
              <Route path="itinerary/:id/packing" element={<PackingList />} />
              <Route path="itinerary/:id/notes" element={<TripNotes />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
