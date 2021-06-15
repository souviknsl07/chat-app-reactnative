import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import Pusher from "pusher-js/react-native";
import axios from "../axios";

const Chat = ({ navigation, route, user }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const pusher = new Pusher("b83d1aaeafe9fce70f0c", {
    cluster: "ap2",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: "https://banner2.cleanpng.com/20180920/yko/kisspng-computer-icons-portable-network-graphics-avatar-ic-5ba3c66df14d32.3051789815374598219884.jpg",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss;
    const messages = {
      message: input,
      displayName: user.name,
      email: user.email,
    };
    axios
      .post(`/api/chat/${route.params.id}`, messages, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {});
    setInput("");
  };

  const showChats = () => {
    axios
      .get(`/api/chat/${route.params.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  };

  useEffect(() => {
    const channel = pusher.subscribe("chats");
    channel.bind("updated", (data) => {
      showChats();
    });
  }, [route]);

  useLayoutEffect(() => {
    showChats();
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ _id, message, displayName, email, timestamp }) =>
                email === user.email ? (
                  <View key={_id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      //web
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      rounded
                      size={30}
                      bottom={-15}
                      right={-5}
                      source={{
                        uri: "https://banner2.cleanpng.com/20180920/yko/kisspng-computer-icons-portable-network-graphics-avatar-ic-5ba3c66df14d32.3051789815374598219884.jpg",
                      }}
                    />
                    <Text style={styles.senderText}>{message}</Text>
                  </View>
                ) : (
                  <View key={_id} style={styles.reciever}>
                    <Avatar
                      position="absolute"
                      //web
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      rounded
                      size={30}
                      bottom={-15}
                      left={-5}
                      rounded
                      size={30}
                      source={{
                        uri: "https://banner2.cleanpng.com/20180920/yko/kisspng-computer-icons-portable-network-graphics-avatar-ic-5ba3c66df14d32.3051789815374598219884.jpg",
                      }}
                    />
                    <Text style={styles.recieverText}>{message}</Text>
                    <Text style={styles.recieverName}>{displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Messages..."
                style={styles.textInput}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#2868E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sender: {
    padding: 15,
    backgroundColor: "#2863E6",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  recieverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "gray",
  },
  recieverText: {
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderText: {
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});
