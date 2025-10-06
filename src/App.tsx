import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import LeavePolicy from "./pages/LeavePolicy";
import LeaveRequests from "./pages/LeaveRequests";
import LeaveAllotment from "./pages/LeaveAllotment";
import LeaveAllotmentHistory from "./pages/LeaveAllotmentHistory";
import LeaveBalance from "./pages/LeaveBalance";
import ApplyLeave from "./pages/ApplyLeave";
import Employees from "./pages/Employees";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import AddEmployeeStepper from "./pages/AddEmployeeStepper";
import HR from "./pages/HR";
import Regularization from "./pages/Regularization";
import SubmitRegularization from "./pages/SubmitRegularization";
import Payroll from "./pages/Payroll";
import SalarySlips from "./pages/SalarySlips";  
import Reports from "./pages/Reports";
import EmployeesReport from "./pages/EmployeesReport";
import LeaveRequestsReport from "./pages/LeaveRequestsReport";
import PayrollReport from "./pages/PayrollReport";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationDetails from "./pages/OrganizationDetails";
import EmployeeAttendanceDetail from "./pages/EmployeeAttendanceDetail";

// Layout
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/employees" element={<Employees />} />
                      <Route path="/add-employee" element={<AddEmployeeStepper />} />
                      {/* Previously SuperAdmin-only routes; now accessible to all authenticated users */}
                      <Route path="/hr" element={<HR />} />
                      <Route path="/hr/:id" element={<HR />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/regularization" element={<Regularization />} />
                      <Route path="/regularization/submit" element={<SubmitRegularization />} />
                      <Route path="/organizations/:id" element={<OrganizationDetails />} />
                      {/* Previously CompanyAdmin-only routes; now accessible to all authenticated users */}
                      <Route path="/payroll" element={<Payroll />} />
                      <Route path="/salary-slips" element={<SalarySlips />} />
                      <Route path="/attendance" element={<Attendance />} />
                      <Route path="/attendance/employee/:id" element={<EmployeeAttendanceDetail />} />
                      <Route path="/apply-leave" element={<ApplyLeave />} />
                      <Route path="/leaves" element={<Leaves />} />
                      <Route path="/leaves/policy" element={<LeavePolicy />} />
                      <Route path="/leaves/requests" element={<LeaveRequests />} />
                      <Route path="/leaves/allotment" element={<LeaveAllotment />} />
                      <Route path="/leaves/balance" element={<LeaveBalance />} />
                      <Route path="/leaves/allotment/history/:employeeId" element={<LeaveAllotmentHistory />} />
                      <Route path="/reports/employees" element={<EmployeesReport />} />
                      <Route path="/reports/leave-requests" element={<LeaveRequestsReport />} />
                      <Route path="/reports/payroll" element={<PayrollReport />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/create-organization" element={<CreateOrganization />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;