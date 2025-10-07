import useAuthStore from "@/store/authStore";
import axios, { AxiosInstance } from "axios";

class MessageService {
  private api: AxiosInstance;
  private baseURL = "https://tifstay-project-be.onrender.com";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log("API Response:", response.status, response.config.url);
        return response;
      },
      async (error) => {
        console.error(
          "Response Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          useAuthStore.setState({
            token: null,
            isAuthenticated: false,
            user: null,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  // Send message to admin
  async sendMessage(message: string) {
    try {
      const userServiceType = useAuthStore.getState().userServiceType;
      const user = useAuthStore.getState().user;
      
      const response = await this.api.post("/api/message/sendMessage", {
        senderId: user?.id,
        receiverId: "admin", // Admin ID - adjust if needed
        message: message,
      });

      return {
        success: true,
        data: response.data,
        message: response.data?.message || "Message sent successfully",
      };
    } catch (error: any) {
      console.error("Send Message Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to send message",
      };
    }
  }

  // Get previous chat with admin
  async getPreviousChat() {
    try {
      const userServiceType = useAuthStore.getState().userServiceType;
      
      // Determine the endpoint based on service type
      const endpoint = userServiceType === "hostel_owner" 
        ? "/api/message/getHostelOwnerPreviousChat"
        : "/api/message/getTiffinProviderPreviousChat"; // Adjust if different

      const response = await this.api.get(endpoint);

      return {
        success: true,
        data: response.data,
        hasConversation: response.data?.hasConversation || false,
        messages: response.data?.messages || [],
        conversationId: response.data?.conversationId,
      };
    } catch (error: any) {
      console.error("Get Previous Chat Error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load messages",
        messages: [],
      };
    }
  }
}

export default new MessageService();