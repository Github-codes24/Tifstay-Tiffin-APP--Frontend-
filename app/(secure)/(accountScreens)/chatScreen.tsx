import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import useAuthStore from "@/store/authStore";
import messageService from "@/store/messageService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "admin";
  createdAt?: string;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const { user, userServiceType } = useAuthStore();

  // Load previous messages on mount
  useEffect(() => {
    loadPreviousMessages();

    return () => {
      // Clear cache when component unmounts
      messageService.clearCache();
    };
  }, []);

  const loadPreviousMessages = async () => {
    setIsLoading(true);
    try {
      console.log("📥 Loading previous messages...");
      const response = await messageService.getPreviousChat();
      console.log("📥 Get chat response:", response);

      if (response.success) {
        // Store admin info for sending messages
        if (response.adminInfo) {
          setAdminInfo(response.adminInfo);
          console.log("✅ Admin info loaded:", response.adminInfo);
        }

        if (response.hasConversation && response.messages.length > 0) {
          // Transform API messages to our format
          const formattedMessages = response.messages.map(
            (msg: any, index: number) => {
              // Get user name - check both fullName (hostel) and name (tiffin)
              const currentUserName = user?.fullName || user?.name;

              return {
                id: msg._id || `${Date.now()}-${index}`,
                text: msg.message,
                time: formatTime(msg.createdAt),
                sender: msg.senderName === currentUserName ? "me" : "admin",
                createdAt: msg.createdAt,
              };
            }
          );

          console.log("✅ Formatted messages:", formattedMessages.length);
          setMessages(formattedMessages);
          setConversationId(response.conversationId);

          // Scroll to bottom after loading
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } else {
          console.log("ℹ️ No previous conversation found");
        }
      } else {
        console.log("⚠️ Failed to load messages:", response.error);
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
      Alert.alert("Error", "Failed to load previous messages");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Check if we have admin info
    if (!adminInfo?.adminId) {
      Alert.alert(
        "Error",
        "Unable to send message. Admin information not available. Please try refreshing.",
        [
          {
            text: "Refresh",
            onPress: () => loadPreviousMessages(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return;
    }

    const messageText = input.trim();
    const tempId = Date.now().toString();

    // Optimistic UI update
    const newMessage: Message = {
      id: tempId,
      text: messageText,
      time: formatTime(new Date().toISOString()),
      sender: "me",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsSending(true);

    // Scroll to bottom immediately
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      console.log("📤 Sending message to admin ID:", adminInfo.adminId);
      console.log("📤 Message:", messageText);

      const response = await messageService.sendMessage(
        messageText,
        adminInfo.adminId
      );
      console.log("📥 Send message response:", response);

      if (response.success) {
        const serverData = response.data?.data;

        if (serverData) {
          // Update the message with server data if available
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...msg,
                    id: serverData._id || tempId,
                    time: formatTime(
                      serverData.createdAt || new Date().toISOString()
                    ),
                  }
                : msg
            )
          );

          // Store conversation ID if this is first message
          if (serverData.conversationId && !conversationId) {
            setConversationId(serverData.conversationId);
          }
        }

        console.log("✅ Message sent successfully");
      } else {
        // Remove the message if sending failed
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

        // Check if it's an auth error
        if (
          response.error?.includes("Token") ||
          response.error?.includes("401") ||
          response.error?.includes("Unauthorized")
        ) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again.",
            [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
          );
        } else {
          Alert.alert("Error", response.error || "Failed to send message");
        }
      }
    } catch (error: any) {
      console.error("❌ Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMe && { color: Colors.white, textAlign: "right" },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timeText,
            isMe ? { color: Colors.white } : { color: Colors.grey },
          ]}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color={Colors.title} />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Chat with Admin</Text>
        {adminInfo && (
          <Text style={styles.headerSubtitle}>{adminInfo.adminName}</Text>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color={Colors.grey} />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>
        Send a message to start the conversation with admin
      </Text>
      {adminInfo && (
        <Text style={styles.adminInfoText}>Admin: {adminInfo.adminName}</Text>
      )}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary || "#5E9BED"} />
      <Text style={styles.loadingText}>Loading messages...</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {renderHeader()}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {isLoading ? (
          renderLoading()
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={
              messages.length === 0
                ? styles.emptyListContainer
                : styles.listContainer
            }
            ListEmptyComponent={renderEmptyState}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: false });
              }
            }}
          />
        )}

        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              adminInfo ? "Type Message..." : "Loading admin info..."
            }
            placeholderTextColor={Colors.grey}
            value={input}
            onChangeText={setInput}
            editable={!isSending && !!adminInfo}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSending || !input.trim() || !adminInfo) &&
                styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={isSending || !input.trim() || !adminInfo}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Image source={Images.send} style={{ width: 40, height: 39 }} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.title,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.grey,
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#5E9BED",
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F5FF",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    minHeight: 56,
    maxHeight: 100,
    color: "#000",
  },
  sendButton: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.title || "#000",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.grey || "#666",
    textAlign: "center",
  },
  adminInfoText: {
    fontSize: 12,
    color: Colors.primary || "#5E9BED",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.grey || "#666",
  },
});
