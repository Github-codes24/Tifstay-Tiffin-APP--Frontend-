import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { fonts } from "@/constants/typography";
import { Colors } from "@/constants/Colors";
import { Images } from "@/constants/Images";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: "1", text: "consequat nunc vitae tincidunt risus quam lectus.", time: "06:33 AM", sender: "me" },
    { id: "2", text: "Lorem ipsum dolor sit amet consectetur. Turpis vivamus pretium ac diam vitae cursus. Dictumst id consequat nunc vitae tincidunt risus quam lectus.", time: "06:34 AM", sender: "other" },
    { id: "3", text: "Lorem ipsum dolor sit amet consectetur. Turpis vivamus pretium ac diam vitae cursus. Dictumst id consequat nunc vitae tincidunt risus quam lectus.", time: "06:35 AM", sender: "me" },
    { id: "4", text: "Lorem ipsum dolor sit amet consectetur. Turpis vivamus pretium ac diam vitae cursus. Dictumst id consequat nunc vitae tincidunt risus quam lectus.", time: "06:36 AM", sender: "other" },
    { id: "5", text: "Lorem ipsum dolor sit amet consectetur. Turpis vivamus pretium ac diam vitae cursus. Dictumst id consequat nunc vitae tincidunt risus quam lectus.", time: "06:37 AM", sender: "me" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sender: "me",
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  const renderMessage = ({ item }:any) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={[styles.messageText, isMe ? { color:Colors.white  , textAlign:'right'} : { color: "#000" }]}>
          {item.text}
        </Text>
        <Text
          style={[
            styles.timeText,
            isMe ? { color:Colors.white } : { color: Colors.grey },
          ]}
        >
          {item.time}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Input box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type Message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Image source={Images.send} style={{width:40,height:39}} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    fontFamily:fonts.interRegular,
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
    height:56
  },
  sendButton: {
    borderRadius: 50,
  },
});
