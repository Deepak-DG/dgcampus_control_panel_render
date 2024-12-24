import axios from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://campus.dhobig.com/api";


export const loginSuperUser = async (mobile: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/superuser/login/`, {
      mobile_number: mobile,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login Error: ", error);
    throw error;
  }
};

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Clear tokens or any authentication data
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push('/');

    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return logout;
};
