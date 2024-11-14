import {
  useEffect,
  useLayoutEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { refreshTokens } from "../api/auth";
import axiosInstance from "../api/axios";
import { LOGOUT_URL, SIGN_IN_URL, SIGN_UP_URL } from "../api/auth/constants";

interface AuthContextType {
  accessToken: string | null;
  signIn: (data: { email: string; password: string }) => void;
  signUp: (data: { email: string; username: string; password: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await refreshTokens();
        setAccessToken(response.access_token);
      } catch {
        setAccessToken(null);
      }
    };
    fetchMe();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && accessToken
          ? `Bearer ${accessToken}`
          : config.headers.Authorization;

      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const refreshInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originlRequest = error.config;

        if (
          error.response.status === 403 &&
          error.response.data.response.message === "Not valid JWT"
        ) {
          try {
            const token = await refreshTokens();

            setAccessToken(token.access_token);

            originlRequest.headers.Authorization = `Bearer ${token}`;
            originlRequest._retry = true;

            return axiosInstance(originlRequest);
          } catch {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const signIn = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post(SIGN_IN_URL, data);
    setAccessToken(response.data.access_token);
  };

  const signUp = async (data: {
    email: string;
    username: string;
    password: string;
  }) => {
    const response = await axiosInstance.post(SIGN_UP_URL, data);
    setAccessToken(response.data.access_token);
  };

  const logout = async () => {
    await axiosInstance.post(LOGOUT_URL);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
