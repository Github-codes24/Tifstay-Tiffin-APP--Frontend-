import useAuthStore from "@/store/authStore";
import hostelApiService from "../services/hostelApiService";
import tiffinApiService from "../services/tiffinApiServices";

class MessageService {
  private adminId: string | null = null;

  /**
   * Get admin ID from previous chat or cache
   */
  private async getAdminId(): Promise<string | null> {
    if (this.adminId) {
      return this.adminId;
    }

    try {
      const chatResponse = await this.getPreviousChat();
      if (chatResponse.success && chatResponse.adminInfo?.adminId) {
        this.adminId = chatResponse.adminInfo.adminId;
        return this.adminId;
      }
    } catch (error) {
      console.error("❌ Error getting admin ID:", error);
    }

    return null;
  }

  /**
   * Send message to admin with receiverId
   */
  async sendMessage(message: string, receiverId?: string) {
    try {
      const { userServiceType } = useAuthStore.getState();
      
      // Get admin ID if not provided
      let adminId = receiverId;
      if (!adminId) {
        const fetchedAdminId = await this.getAdminId();
        adminId = fetchedAdminId ?? undefined;
      }

      if (!adminId) {
        return {
          success: false,
          error: "Admin ID not found. Please try refreshing the chat.",
        };
      }

      let response;

      if (userServiceType === "hostel_owner") {
        response = await hostelApiService.sendMessageToAdmin(message, adminId);
      } else {
        response = await tiffinApiService.sendMessageToAdmin(message, adminId);
      }

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: "Message sent successfully",
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to send message",
        };
      }
    } catch (error: any) {
      console.error("❌ Send Message Error:", error);
      return {
        success: false,
        error: error.message || "Failed to send message",
      };
    }
  }

  /**
   * Get previous chat messages
   */
  async getPreviousChat() {
    try {
      const { userServiceType } = useAuthStore.getState();
      let response;

      if (userServiceType === "hostel_owner") {
        response = await hostelApiService.getHostelOwnerPreviousChat();
      } else {
        response = await tiffinApiService.getTiffinOwnerPreviousChat();
      }

      if (response.success) {
        const data = response.data?.data || response.data;
        
        // Cache admin ID
        if (data?.adminInfo?.adminId) {
          this.adminId = data.adminInfo.adminId;
        }
        
        return {
          success: true,
          hasConversation: data?.hasConversation || false,
          conversationId: data?.conversationId || null,
          adminInfo: data?.adminInfo || null,
          messages: data?.messages || [],
          lastMessageAt: data?.lastMessageAt || null,
          data: data,
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to load messages",
          hasConversation: false,
          messages: [],
        };
      }
    } catch (error: any) {
      console.error("❌ Get Previous Chat Error:", error);
      return {
        success: false,
        error: error.message || "Failed to load messages",
        hasConversation: false,
        messages: [],
      };
    }
  }

  /**
   * Clear cached admin ID
   */
  clearCache() {
    this.adminId = null;
  }
}

export default new MessageService();