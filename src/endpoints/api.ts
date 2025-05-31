import axios from "axios"

const BASE_URL = "http://127.0.0.1:8000/api/"

const LOGIN_URL = `${BASE_URL}login/`
const REFREASH_URL = `${BASE_URL}token/refresh/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}authenticated/`

const REGISTER_URL = `${BASE_URL}register/`
const USERS_URL = `${BASE_URL}users/`
const TODO_URL = `${BASE_URL}todos/`

export const login = async (id_number: string, password: string) => {
    try {
        const response = await axios.post(LOGIN_URL,
            {id_number, password},
            {withCredentials: true}
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
        const response = await axios.post(REFREASH_URL,
            {},
            { withCredentials: true }
        )
        return response.data.refreshed;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}

export const getTodos = async () => {
    try {
        const response = await axios.get(TODO_URL,
            { withCredentials: true }
        )
        return response.data;
    } catch (error) {
        console.error('Get todos failed:', error);
        return call_refresh(error, () => axios.get(TODO_URL, { withCredentials: true }));
    }
}

const call_refresh = async (error: any, func: () => Promise<any>) => {
    if (error.response && error.response.status === 401) {
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

export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL,
            {},
            { withCredentials: true }
        )
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
}

export const is_authenticated = async () => {
    try {
        await axios.get(AUTH_URL,
            { withCredentials: true }
        )
        return true;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
}

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