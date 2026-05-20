import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./context/ThemeContext";
import { ChatbotProvider } from "./context/ChatbotContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "./components/NotFound";

import Home from './features/home/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import VerifyOTP from './features/auth/VerifyOTP';
import ResetPassword from './features/auth/ResetPassword';

import ProfileSetup from './features/dashboard/ProfileSetup/ProfileSetup';
import ProfilePage from "./features/dashboard/ProfileSetup/ProfilePage";
import PasswordUpdate from "./features/dashboard/ProfileSetup/PasswordUpdate";

import AdminDashboard from './features/admin/AdminDashboard';
import UserDashboard from './features/dashboard/UserDashboard';

import UsersPage from "./features/admin/pages/UsersPageAdmin";
import AddBlog from "./features/admin/pages/AddBlogPage";
import TestimonialsPage from "./features/admin/pages/TestimonialsPage";
import AdminProfilePage from "./features/admin/pages/AdminProfilePage";
import AdminPasswordPage from "./features/admin/pages/AdminPasswordPage";
import RecycleBin from "./features/admin/pages/RecycleBinPage";

import BMR from './features/dashboard/calculator/Bmr';
import BMI from './features/dashboard/calculator/Bmi';
import Macro from './features/dashboard/calculator/MacroCalculator';
import CalorieChecker from "./features/dashboard/CalorieChecker";
import StopWatch from "./features/dashboard/stopwatch/StopwatchPage";

import WorkoutList from './features/dashboard/workout/WorkoutList';
import WorkoutDetail from './features/dashboard/workout/WorkoutDetail';
import WorkoutForm from './features/dashboard/workout/WorkoutForm';
import ExercisePage from './features/dashboard/workout/ExercisesPage';

import Feedback from './features/dashboard/feedback/UserFeedbackModal';

import FoodLog from './features/dashboard/food/FoodLogList';
import FoodLogForm from './features/dashboard/food/FoodLogForm';
import FoodLogDetail from './features/dashboard/food/FoodLogDetail';
import Notifications from "./features/dashboard/workout/Notifications";
import Goals from './features/dashboard/goal/Goal';

import Chatbot from "./features/dashboard/layout/Chatbot";
import GlobalChatButton from "./features/dashboard/layout/GlobalChatButton";


function App() {
  return (
    <Router>
      <Routes>

        {/* ---------------- PUBLIC ROUTES (NO CHATBOT HERE) ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Profile Setup (NO CHATBOT HERE) */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute role={2}>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN DASHBOARD (NO CHATBOT HERE) ---------------- */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <AdminDashboard />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/profile"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <AdminProfilePage />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/password"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <AdminPasswordPage />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/users"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <UsersPage />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/recycle-bin"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <RecycleBin />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/add-blog"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <AddBlog />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/testimonials"
          element={
            <ProtectedRoute role={1}>
              <ThemeProvider>
                <TestimonialsPage />
              </ThemeProvider>
            </ProtectedRoute>
          }
        />

        {/* USER TOOLS (ALL HAVE CHATBOT) */}
        <Route
          path="/user-dashboard/bmr"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <BMR />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/bmi"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <BMI />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/macro-calculator"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <Macro />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

                <Route
          path="/user-dashboard/goals"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <Goals />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

<Route
  path="/user-dashboard"
  element={
    <ProtectedRoute role={2}>
      <NotificationProvider>
        <ThemeProvider>
          <ChatbotProvider>
            <Chatbot />
            <GlobalChatButton />
            <UserDashboard />
          </ChatbotProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ProtectedRoute>
  }
/>

        <Route
          path="/user-dashboard/calorie-checker"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <CalorieChecker />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/workouts"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <WorkoutList />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/feedback"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <Feedback />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/workouts/:id"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <WorkoutDetail />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/workout-form"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <WorkoutForm />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/workout-form/:id"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <WorkoutForm />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/exercises"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <ExercisePage />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/stopwatch"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <StopWatch />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/notifications"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
                <ThemeProvider>
                  <ChatbotProvider>
                    <Chatbot />
                    <GlobalChatButton />
                    <Notifications />
                  </ChatbotProvider>
                </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/profile"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <ProfilePage />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/update-password"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <PasswordUpdate />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/foodlogs"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <FoodLog />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/foodlog-form"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <FoodLogForm />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/foodlog-form/:id"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <FoodLogForm />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard/foodlog-detail/:id"
          element={
            <ProtectedRoute role={2}>
              <NotificationProvider>
              <ThemeProvider>
                <ChatbotProvider>
                  <Chatbot />
                  <GlobalChatButton />
                  <FoodLogDetail />
                </ChatbotProvider>
              </ThemeProvider>
              </NotificationProvider>
            </ProtectedRoute>
          }
        />

        {/* ---------------- 404 (NO CHATBOT) ---------------- */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
