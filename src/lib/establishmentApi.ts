import axios from "axios";
import type { AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ESTABLISHMENTS_URL = `${BASE_URL}establishment/establishments/`;

export interface Establishment {
  id: number;
  name: string;
  address: string;
  coordinates: string;
  year: string;
  createdAt: string;
}

export interface EstablishmentFormData {
  name: string;
  address_line: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code?: string;
  latitude?: string;
  longitude?: string;
  year_established?: string;
}

// Get all establishments
export const fetchEstablishments = async (): Promise<Establishment[]> => {
  try {
    const response: AxiosResponse<Establishment[]> = await axios.get(
      ESTABLISHMENTS_URL,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new establishment
export const createEstablishment = async (
  data: EstablishmentFormData
): Promise<Establishment> => {
  try {
    const response = await axios.post(ESTABLISHMENTS_URL, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to create establishment"
      );
    }
    throw error;
  }
};

// Update an establishment
export const updateEstablishment = async (
  id: number,
  data: Partial<EstablishmentFormData>
): Promise<Establishment> => {
  try {
    const response: AxiosResponse<Establishment> = await axios.patch(
      `${ESTABLISHMENTS_URL}${id}/`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteEstablishment = async (
  id: number
): Promise<AxiosResponse> => {
  try {
    const response = await axios.delete(`${ESTABLISHMENTS_URL}${id}/`, {
      withCredentials: true,
      validateStatus: (status) => status === 204 || status === 404,
    });
    return response;
  } catch (error) {
    console.error("API Delete Error:", error);
    throw error;
  }
};

// Search establishments
export const searchEstablishments = async (
  query: string
): Promise<Establishment[]> => {
  try {
    const response: AxiosResponse<Establishment[]> = await axios.get(
      ESTABLISHMENTS_URL,
      {
        withCredentials: true,
        params: { search: query },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export function handleApiError(error: unknown): never {
  // your error handling logic here
  throw error;
}
