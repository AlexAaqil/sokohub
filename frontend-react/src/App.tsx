import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar/Navbar';
import { HomePage } from './pages/HomePage';
import Login from './pages/AuthPages/Login';
import Register from './pages/AuthPages/Register';
// import { ShopPage } from './pages/ShopPage';
// import { DealsPage } from './pages/DealsPage';
// import { SocialPage } from './pages/SocialPage';
// import { DashboardPage } from './pages/DashboardPage';
// import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-14">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/shop/:id" element={<ShopPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/social" element={<SocialPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;