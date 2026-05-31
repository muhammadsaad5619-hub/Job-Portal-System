import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import JobSearch from './pages/jobseeker/JobSearch'
import JobDetail from './pages/jobseeker/JobDetail'
import SeekerDashboard from './pages/jobseeker/SeekerDashboard'
import SeekerProfile from './pages/jobseeker/SeekerProfile'
import MyApplications from './pages/jobseeker/MyApplications'
import SavedJobs from './pages/jobseeker/SavedJobs'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import PostJob from './pages/employer/PostJob'
import ManageJobs from './pages/employer/ManageJobs'
import ViewApplicants from './pages/employer/ViewApplicants'
import CompanyProfile from './pages/employer/CompanyProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageJobListings from './pages/admin/ManageJobListings'
import NotFound from './pages/NotFound'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/jobs' element={<JobSearch />} />
        <Route path='/jobs/:id' element={<JobDetail />} />

        {/* Job Seeker Routes */}
        <Route path='/seeker/dashboard' element={<SeekerDashboard />} />
        <Route path='/seeker/profile' element={<SeekerProfile />} />
        <Route path='/seeker/applications' element={<MyApplications />} />
        <Route path='/seeker/saved' element={<SavedJobs />} />

        {/* Employer Routes */}
        <Route path='/employer/dashboard' element={<EmployerDashboard />} />
        <Route path='/employer/post-job' element={<PostJob />} />
        <Route path='/employer/jobs' element={<ManageJobs />} />
        <Route path='/employer/applicants/:jobId' element={<ViewApplicants />} />
        <Route path='/employer/company' element={<CompanyProfile />} />

        {/* Admin Routes */}
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/users' element={<ManageUsers />} />
        <Route path='/admin/jobs' element={<ManageJobListings />} />

        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App