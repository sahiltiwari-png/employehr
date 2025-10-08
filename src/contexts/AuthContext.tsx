import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  organizationId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      // Normalize photo field for UI avatar: prefer profilePhotoUrl, fallback to existing profileImage
      if (!userData.profileImage && userData.profilePhotoUrl) {
        userData.profileImage = userData.profilePhotoUrl;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      // Enforce employee-only access for existing sessions
      const storedRole: string | null = (typeof userData.role === 'string' ? userData.role : null) || localStorage.getItem('role');
      if (!storedRole || storedRole.toLowerCase() !== 'employee') {
        // Clear invalid session and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setOrganizationId(null);
        setLoading(false);
        navigate('/login');
        return;
      }
      setUser(userData);
      if (userData.organizationId) {
        setOrganizationId(userData.organizationId);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiLogin(email, password);
      // Validate role: allow only 'employee'
      const responseRole: string | undefined = (typeof response?.role === 'string' ? response.role : undefined) ||
        (typeof response?.user?.role === 'string' ? response.user.role : undefined) ||
        (Array.isArray(response?.user?.roles) ? (typeof response.user.roles[0] === 'string' ? response.user.roles[0] : response.user.roles[0]?.name) : undefined);
      if (!responseRole || responseRole.toLowerCase() !== 'employee') {
        // Throw shaped error so Login page can show a friendly message
        const err: any = new Error('Only employees can log in');
        err.response = { data: { message: 'Only employees can log in' } };
        throw err;
      }
      // Store user data, token, and role
      const userData = response.user || { email };
      // Normalize photo field for UI avatar
      if (!userData.profileImage && userData.profilePhotoUrl) {
        userData.profileImage = userData.profilePhotoUrl;
      }
      // Persist validated role
      userData.role = responseRole;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token || 'dummy-token');
      localStorage.setItem('role', responseRole);
      setUser(userData);
      if (userData.organizationId) {
        setOrganizationId(userData.organizationId);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setOrganizationId(null);
    navigate('/login');
  };

  const value = {
    isAuthenticated: !!user,
    user,
    organizationId,
    login,
    logout,
    loading,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};