import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { PageLoader } from '../components/PageLoader'
import { ProtectedRoute } from './ProtectedRoute'

// Every page except Login loads on first visit, so opening the app doesn't
// download the board, drag-and-drop or image libraries up front. Login stays
// eager because it's usually the first screen. Pages use named exports, so
// each import maps its component to the `default` that lazy() expects.
const SignUpPage = lazy(() =>
  import('../pages/SignUpPage').then((m) => ({ default: m.SignUpPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('../pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
)
const ResetPasswordPage = lazy(() =>
  import('../pages/ResetPasswordPage').then((m) => ({
    default: m.ResetPasswordPage,
  })),
)
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProjectsListPage = lazy(() =>
  import('../pages/ProjectsListPage').then((m) => ({
    default: m.ProjectsListPage,
  })),
)
const KanbanBoardPage = lazy(() =>
  import('../pages/KanbanBoardPage').then((m) => ({
    default: m.KanbanBoardPage,
  })),
)
const TasksPage = lazy(() =>
  import('../pages/TasksPage').then((m) => ({ default: m.TasksPage })),
)
const ProfilePage = lazy(() =>
  import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const TaskRedirectPage = lazy(() =>
  import('../pages/TaskRedirectPage').then((m) => ({
    default: m.TaskRedirectPage,
  })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route
            path="/projects/:projectId/board"
            element={<KanbanBoardPage />}
          />
          <Route path="/my-tasks" element={<TasksPage scope="mine" />} />
          <Route path="/tasks" element={<TasksPage scope="all" />} />
          <Route path="/tasks/:taskId" element={<TaskRedirectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}
