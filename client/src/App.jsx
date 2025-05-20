import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './index.css';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import StatsTable from './pages/StatsTable';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/stats-table" element={<StatsTable />} /> 
        <Route path="/dashboard" element={
         
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
