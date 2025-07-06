import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

// Base configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Authentication endpoints
const LOGIN_URL = `${BASE_URL}login/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTH_URL = `${BASE_URL}authenticated/`;

const REQUEST_PASSWORD_RESET_URL = `${BASE_URL}request-password-reset/`;
const VERIFY_PASSWORD_RESET_URL = `${BASE_URL}verify-password-reset/`;

// User management endpoints
const REGISTER_URL = `${BASE_URL}register/`;
const RESET_PASSWORD_URL = `${BASE_URL}admin-reset-password/`;
const USERS_URL = `${BASE_URL}users/`;
const ACTIVITY_LOGS_URL = `${BASE_URL}activity-logs/`;

// Profile endpoints
const PROFILE_URL = `${BASE_URL}me/`;
const UPDATE_PROFILE_URL = `${BASE_URL}me/update/`;
const UPDATE_AVATAR_URL = `${BASE_URL}update-avatar/`;

// Todo endpoints
const TODO_URL = `${BASE_URL}todos/`;

// Interfaces
interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

interface RefreshResponse {
  refreshed: boolean;
}

interface UserData {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  password?: string;
  user_level?: string;
  status?: string;
}

interface ActivityLog {
  id: number;
  admin: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  action: string;
  details: any;
  created_at: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  total_pages: number;
  current_page: number;
}

// Helper functions
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    console.error("API Error:", apiError);
    throw new Error(apiError.message || "An error occurred");
  }
  console.error("Unknown error:", error);
  throw new Error("An unexpected error occurred");
};

const callWithRefresh = async <T>(
  func: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const response = await func();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const refreshed = await refreshToken();
        if (refreshed) {
          const retryResponse = await func();
          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    throw error;
  }
};

// Authentication services
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await axios.post<RefreshResponse>(
      REFRESH_URL,
      {},
      { withCredentials: true }
    );
    return response.data.refreshed;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await axios.post(LOGOUT_URL, {}, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(
      REQUEST_PASSWORD_RESET_URL,
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// In api.ts or authService.ts
export const verifyPasswordReset = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}verify-password-reset/`,
      {
        email: email.toLowerCase(),
        otp,
        new_password: newPassword,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
    throw error;
  }
};

export const is_authenticated = async (): Promise<boolean> => {
  try {
    await axios.get(AUTH_URL, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

// User management services
export const register = async (userData: UserData) => {
  try {
    const response = await axios.post(REGISTER_URL, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const adminResetPassword = async (
  email: string,
  adminPassword: string
) => {
  try {
    const response = await axios.post(
      RESET_PASSWORD_URL,
      { email, admin_password: adminPassword },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUsers = async () => {
  return callWithRefresh(() => axios.get(USERS_URL, { withCredentials: true }));
};

export const updateUser = async (
  userId: number,
  userData: Partial<UserData>
) => {
  try {
    const response = await axios.patch(`${USERS_URL}${userId}/`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const changeUserStatus = async (userId: number, status: string) => {
  try {
    const response = await axios.patch(
      `${USERS_URL}${userId}/status/`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await axios.delete(`${USERS_URL}${userId}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Activity Logs Service
export const getActivityLogs = async (params?: {
  action?: string;
  user_id?: string;
  admin_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<ActivityLog>> => {
  try {
    const response = await axios.get<PaginatedResponse<ActivityLog>>(
      ACTIVITY_LOGS_URL,
      {
        withCredentials: true,
        params: {
          page: params?.page || 1,
          page_size: params?.page_size || 10,
          ...params,
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Profile services
export const getMyProfile = async () => {
  return callWithRefresh(() =>
    axios.get(PROFILE_URL, { withCredentials: true })
  );
};

export const updateProfile = async (data: {
  current_password?: string;
  new_password?: string;
  avatar?: File;
}) => {
  try {
    const formData = new FormData();
    if (data.current_password)
      formData.append("current_password", data.current_password);
    if (data.new_password) formData.append("new_password", data.new_password);
    if (data.avatar) formData.append("avatar", data.avatar);

    const response = await axios.patch(UPDATE_PROFILE_URL, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Ensure we return a success status
    return { success: true, ...response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateAvatar = async (avatarFile: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axios.patch(UPDATE_AVATAR_URL, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Add timestamp to avatar URL to bust cache
    const timestamp = Date.now();
    if (response.data.avatar_url) {
      response.data.avatar_url = `${response.data.avatar_url}?t=${timestamp}`;
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Todo services
export const fetchTodos = async () => {
  return callWithRefresh(() => axios.get(TODO_URL, { withCredentials: true }));
};
