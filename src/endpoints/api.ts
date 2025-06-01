import axios from "axios"

// Base configuration
const BASE_URL = "http://127.0.0.1:8000/api/"

// Authentication endpoints
const LOGIN_URL = `${BASE_URL}login/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`

// User management endpoints
const REGISTER_URL = `${BASE_URL}register/`
const RESET_PASSWORD_URL = `${BASE_URL}admin-reset-password/`
const USERS_URL = `${BASE_URL}users/`

// Profile endpoints
const PROFILE_URL = `${BASE_URL}me/`
const UPDATE_PROFILE_URL = `${BASE_URL}me/update/`
const UPDATE_AVATAR_URL = `${BASE_URL}update-avatar/`

// Todo endpoints
const TODO_URL = `${BASE_URL}todos/`

// Helper functions
const call_refresh = async (error: any, func: () => Promise<any>) => {
    if (error.response?.status === 401) {
        const tokenRefreshed = await refresh_token();
        if (tokenRefreshed) {
            try {
                const retryResponse = await func();
                return retryResponse.data;
            } catch (retryError) {
                console.error("Retry failed:", retryError);
                throw retryError;
            }
        }
    }
    throw error;
}

// Authentication services
export const login = async (id_number: string, password: string) => {
    try {
        const response = await axios.post(LOGIN_URL,
            { id_number, password },
            { withCredentials: true }
        );
        
        if (!response.data.success) {
            throw new Error(response.data.message || 'Login failed');
        }
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Login failed:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        console.error('Login error:', error);
        throw error;
    }
}

export const refresh_token = async () => {
    try {
        const response = await axios.post(REFRESH_URL,
            {},
            { withCredentials: true }
        );
        return response.data.refreshed;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}

export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL,
            {},
            { withCredentials: true }
        );
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
}

export const is_authenticated = async () => {
    try {
        await axios.get(AUTH_URL, { withCredentials: true });
        return true;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
}

// User management services
export const register = async (
    id_number: string,
    first_name: string,
    last_name: string,
    middle_name: string,
    email: string,
    password?: string,
    user_level?: string,
    status?: string   
) => {
    try {
        const response = await axios.post(
            REGISTER_URL,
            {
                id_number,
                first_name,
                last_name,
                middle_name,
                email,
                password: password || undefined,
                user_level,
                status,
            },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const adminResetPassword = async (
  idNumber: string,
  adminPassword: string
) => {
  try {
    const response = await axios.post(
      RESET_PASSWORD_URL,
      {
        id_number: idNumber,
        admin_password: adminPassword
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Password reset failed:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
    console.error('Password reset error:', error);
    throw error;
  }
}

// Profile services
export const getMyProfile = async () => {
    try {
        const response = await axios.get(PROFILE_URL, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Get profile failed:', error);
        return call_refresh(error, () => axios.get(PROFILE_URL, { withCredentials: true }));
    }
}

export const updateProfile = async (data: { 
    current_password?: string,
    new_password?: string,
    avatar?: File 
}) => {
    try {
        const formData = new FormData();
        
        if (data.current_password) {
            formData.append('current_password', data.current_password);
        }
        
        if (data.new_password) {
            formData.append('new_password', data.new_password);
        }
        
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        const response = await axios.patch(
            UPDATE_PROFILE_URL,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Profile update failed:', error.response?.data);
            if (error.response?.status === 400 && error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(error.response?.data?.message || 'Profile update failed');
        }
        console.error('Profile update error:', error);
        throw error;
    }
}

export const updateAvatar = async (avatarFile: File) => {
    try {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await axios.patch(
            UPDATE_AVATAR_URL,
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Avatar update failed:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Avatar update failed');
        }
        console.error('Avatar update error:', error);
        throw error;
    }
}

// User management services (admin only)
export const getUsers = async () => {
    try {
        const response = await axios.get(USERS_URL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Get users failed:', error);
        return call_refresh(error, () => axios.get(USERS_URL, { withCredentials: true }));
    }
};

export const updateUser = async (userId: number, userData: any) => {
  try {
    const response = await axios.patch(
      `${USERS_URL}${userId}/`,
      userData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
    throw error;
  }
};

export const changeUserStatus = async (userId: number, status: string) => {
  try {
    const response = await axios.patch(
      `${USERS_URL}${userId}/`,
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Status update failed');
    }
    throw error;
  }
};


// Todo services
export const getTodos = async () => {
    try {
        const response = await axios.get(TODO_URL,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error('Get todos failed:', error);
        return call_refresh(error, () => axios.get(TODO_URL, { withCredentials: true }));
    }
}