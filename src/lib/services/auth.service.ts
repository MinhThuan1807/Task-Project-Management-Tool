import { verify } from "crypto";
import axiosInstance from "../axios";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  password: string;
}
interface VerifyEmailParams {
  email: string;
  token: string;
}

export const authApi = {
  login: async (data: LoginFormData) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterFormData) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  verifyEmail: async (data: VerifyEmailParams) => {
    const response = await axiosInstance.post('/auth/verify', data)
    return response.data;
  }
}