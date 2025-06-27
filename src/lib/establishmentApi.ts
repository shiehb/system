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
  address_line: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postal_code: string;
  latitude?: string;
  longitude?: string;
  year_established?: string | null;
  nature_of_business?: string;
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
  nature_of_business?: string;
}

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
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");
        throw new Error(errorMessages);
      }
      throw new Error(
        error.response?.data?.message || "Failed to create establishment"
      );
    }
    throw error;
  }
};

export const updateEstablishment = async (
  id: number,
  data: EstablishmentFormData
): Promise<Establishment> => {
  try {
    const response: AxiosResponse<{ data: Establishment }> = await axios.patch(
      `${ESTABLISHMENTS_URL}${id}/`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");
        throw new Error(errorMessages);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update establishment"
      );
    }
    throw error;
  }
};

export const deleteEstablishment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${ESTABLISHMENTS_URL}${id}/`, {
      withCredentials: true,
      validateStatus: (status) => status === 204 || status === 404,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete establishment"
      );
    }
    throw error;
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

function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
  }
  throw new Error("An unexpected error occurred");
}
