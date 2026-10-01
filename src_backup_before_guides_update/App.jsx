import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

import Landing from './pages/Landing.jsx'
import SignIn from './pages/SignIn.jsx'
import CreateAccount from './pages/CreateAccount.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import LessonView from './pages/LessonView.jsx'
import Guides from './pages/Guides.jsx'
import GuideDetail from './pages/GuideDetail.jsx'
import AICoach from './pages/AICoach.jsx'
import Profile from './pages/Profile.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              feature="Dashboard"
              description="Sign in to access your personal STRATIX dashboard."
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={
            <ProtectedRoute
              feature="Course Lesson"
              description="Sign in to continue this lesson and track your training progress."
            >
              <LessonView />
            </ProtectedRoute>
          }
        />

        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:guideId" element={<GuideDetail />} />

        <Route
          path="/ai-coach"
          element={
            <ProtectedRoute
              feature="AI Coach"
              description="Sign in to use AI Coach and get personalized VALORANT coaching."
            >
              <AICoach />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              feature="Profile"
              description="Sign in to access and manage your STRATIX profile."
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
