import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";
import messageService from "@/services/messageService";
import useAuthStore from "@/store/authStore";
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
  const flatListRef = useRef<FlatList>(null);
  const { user, userServiceType } = useAuthStore();

  // Load previous messages on mount
  useEffect(() => {
    loadPreviousMessages();
  }, []);

  const loadPreviousMessages = async () => {
    setIsLoading(true);
    try {
      const response = await messageService.getPreviousChat();

      if (response.success && response.data) {
        if (response.hasConversation && response.messages.length > 0) {
          // Transform API messages to our format
          const formattedMessages = response.messages.map((msg: any) => ({
            id: msg._id || Date.now().toString(),
            text: msg.message,
            time: formatTime(msg.createdAt),
            sender: msg.senderName === user?.fullName ? "me" : "admin",
            createdAt: msg.createdAt,
          }));

          setMessages(formattedMessages);
          setConversationId(response.conversationId);

          // Scroll to bottom after loading
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
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
      const response = await messageService.sendMessage(messageText);

      if (response.success) {
        // Update message with server response if needed
        if (response.data?.data) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId
                ? {
                    ...msg,
                    id: response.data.data._id || tempId,
                    time: formatTime(response.data.data.createdAt),
                  }
                : msg
            )
          );

          // If this is the first message, set the conversation ID
          if (response.data.data.conversationId && !conversationId) {
            setConversationId(response.data.data.conversationId);
          }
        }
      } else {
        // Remove the message if sending failed
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        Alert.alert("Error", response.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
        <Ionicons name="arrow-back" size={20} color={Colors.title} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Chat with Admin</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={80} color={Colors.grey} />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>
        Send a message to start the conversation
      </Text>
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
          />
        )}

        {/* Input box */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type Message..."
            value={input}
            onChangeText={setInput}
            editable={!isSending}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (isSending || !input.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={isSending || !input.trim()}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: "#000",
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
