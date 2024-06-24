import axios, { AxiosInstance } from "axios";

export class AuthService {
    protected instance: AxiosInstance;
    public constructor(url: string) {
      this.instance = axios.create({
        baseURL: url,
        timeout: 30000,
        timeoutErrorMessage: "Request timed out!",
      });
    }

    login = async (email: string, password: string) => {
        try {
            const response = await this.instance.post("/login", {
                email,
                password,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    register = async (email: string, password: string) => {
        try {
            const response = await this.instance.post("/register", {
                email,
                password,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    logout = async () => {
        try {
            const response = await this.instance.post("/logout");
            return response;
        } catch (error) {
            throw error;
        }
    }
}