import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ESTABLISHMENTS_URL = `${BASE_URL}establishment/establishments/`;
const NATURE_OF_BUSINESS_URL = `${BASE_URL}establishment/nature-of-business/`;

// Interface Definitions
export interface NatureOfBusiness {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Establishment {
  id: number;
  name: string;
  address: string;
  coordinates: string;
  year: string;
  createdAt: string;
  address_line: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
  latitude?: string;
  longitude?: string;
  year_established?: string | null;
  nature_of_business?: NatureOfBusiness | null;
  polygon?: {
    coordinates: any;
    created_at: string;
  } | null;
}

export interface EstablishmentFormData {
  name: string;
  address_line: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
  latitude?: string;
  longitude?: string;
  year_established: string | null;
  nature_of_business_id?: number | null;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Error Handling Utility
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      errors?: Record<string, string[]>;
    }>;
    const message =
      axiosError.response?.data?.message || "An unexpected error occurred";
    const errors = axiosError.response?.data?.errors;
    const status = axiosError.response?.status;

    throw {
      message,
      errors,
      status,
    } as ApiError;
  }
  throw {
    message: "An unexpected error occurred",
  } as ApiError;
};

// Establishment CRUD Operations
export const fetchEstablishments = async (): Promise<Establishment[]> => {
  try {
    const response: AxiosResponse<{ data: Establishment[] }> = await axios.get(
      ESTABLISHMENTS_URL,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchEstablishmentById = async (
  id: number
): Promise<Establishment> => {
  try {
    const response: AxiosResponse<{ data: Establishment }> = await axios.get(
      `${ESTABLISHMENTS_URL}${id}/`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createEstablishment = async (
  data: EstablishmentFormData
): Promise<Establishment> => {
  try {
    const response: AxiosResponse<{ data: Establishment }> = await axios.post(
      ESTABLISHMENTS_URL,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateEstablishment = async (
  id: number,
  data: Partial<EstablishmentFormData>
): Promise<Establishment> => {
  try {
    const response: AxiosResponse<{ data: Establishment }> = await axios.patch(
      `${ESTABLISHMENTS_URL}${id}/`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteEstablishment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${ESTABLISHMENTS_URL}${id}/`, {
      withCredentials: true,
      validateStatus: (status) => status === 204 || status === 404,
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const searchEstablishments = async (
  query: string
): Promise<Establishment[]> => {
  try {
    const response: AxiosResponse<{ data: Establishment[] }> = await axios.get(
      ESTABLISHMENTS_URL,
      {
        withCredentials: true,
        params: { search: query },
      }
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Nature of Business CRUD Operations
export const fetchNatureOfBusinessOptions = async (): Promise<
  NatureOfBusiness[]
> => {
  try {
    const response: AxiosResponse<NatureOfBusiness[]> = await axios.get(
      NATURE_OF_BUSINESS_URL,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchNatureOfBusinessById = async (
  id: number
): Promise<NatureOfBusiness> => {
  try {
    const response: AxiosResponse<NatureOfBusiness> = await axios.get(
      `${NATURE_OF_BUSINESS_URL}${id}/`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createNatureOfBusiness = async (
  data: Omit<NatureOfBusiness, "id" | "created_at" | "updated_at">
): Promise<NatureOfBusiness> => {
  try {
    const response: AxiosResponse<NatureOfBusiness> = await axios.post(
      NATURE_OF_BUSINESS_URL,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateNatureOfBusiness = async (
  id: number,
  data: Partial<NatureOfBusiness>
): Promise<NatureOfBusiness> => {
  try {
    const response: AxiosResponse<NatureOfBusiness> = await axios.put(
      `${NATURE_OF_BUSINESS_URL}${id}/`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteNatureOfBusiness = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${NATURE_OF_BUSINESS_URL}${id}/`, {
      withCredentials: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
};

// Utility function for select options
export const getNatureOfBusinessOptions = async (): Promise<
  { value: number; label: string }[]
> => {
  try {
    const data = await fetchNatureOfBusinessOptions();
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  } catch (error) {
    return handleApiError(error);
  }
};
