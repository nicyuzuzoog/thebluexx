import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import SocialFloat from './components/common/SocialFloat.jsx';
import LoadingScreen from './components/common/LoadingScreen.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';

// Lazy load pages
const Home = lazy(() => import('./pages/Home.jsx'));
const NewsPage = lazy(() => import('./pages/NewsPage.jsx'));
const NewsDetail = lazy(() => import('./pages/NewsDetail.jsx'));
const MoviesPage = lazy(() => import('./pages/MoviesPage.jsx'));
const MovieDetail = lazy(() => import('./pages/MovieDetail.jsx'));
const JobsPage = lazy(() => import('./pages/JobsPage.jsx'));
const StoriesPage = lazy(() => import('./pages/StoriesPage.jsx'));
const StoryDetail = lazy(() => import('./pages/StoryDetail.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews.jsx'));
const AdminMovies = lazy(() => import('./pages/admin/AdminMovies.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminAds = lazy(() => import('./pages/admin/AdminAds.jsx'));
const AdminJobs = lazy(() => import('./pages/admin/AdminJobs.jsx'));
const AdminPending = lazy(() => import('./pages/admin/AdminPending.jsx'));
const AdminSubscribers = lazy(() => import('./pages/admin/AdminSubscribers.jsx'));
const CreateNews = lazy(() => import('./pages/admin/CreateNews.jsx'));
const CreateMovie = lazy(() => import('./pages/admin/CreateMovie.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  const location = useLocation();

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {/* Only show Navbar on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      <main className={isAdminRoute ? 'admin-main-wrapper' : 'main-content'}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:slug" element={<MovieDetail />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
            <Route path="/admin/news" element={
              <AdminRoute><AdminNews /></AdminRoute>
            } />
            <Route path="/admin/news/create" element={
              <AdminRoute><CreateNews /></AdminRoute>
            } />
            <Route path="/admin/movies" element={
              <AdminRoute><AdminMovies /></AdminRoute>
            } />
            <Route path="/admin/movies/create" element={
              <AdminRoute><CreateMovie /></AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute><AdminUsers /></AdminRoute>
            } />
            <Route path="/admin/ads" element={
              <AdminRoute><AdminAds /></AdminRoute>
            } />
            <Route path="/admin/jobs" element={
              <AdminRoute><AdminJobs /></AdminRoute>
            } />
            <Route path="/admin/pending" element={
              <AdminRoute><AdminPending /></AdminRoute>
            } />
            <Route path="/admin/subscribers" element={
              <AdminRoute><AdminSubscribers /></AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Only show Footer & SocialFloat on non-admin routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <SocialFloat />}

      <style>{`
        .admin-main-wrapper {
          min-height: 100vh;
          padding-top: 0;
          margin-top: 0;
        }
      `}</style>
    </div>
  );
}

export default App;