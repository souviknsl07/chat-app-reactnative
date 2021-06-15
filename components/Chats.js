import React, { useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, SafeAreaView, ScrollView, View } from "react-native";
import { Avatar } from "react-native-elements";
import ChatList from "./ChatList";
import { SimpleLineIcons } from "@expo/vector-icons";
import axios from "../axios";

const Chats = ({ navigation, user }) => {
  const [chats, setChats] = useState([]);

  const logout = (e) => {
    e.preventDefault();
    window.sessionStorage.removeItem("token");
    navigation.replace("Login");
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      axios
        .get(`/api/chats/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        .then((res) => {
          setChats(
            res.data.map((doc) => ({
              id: doc._id,
              chatName: doc.chatName,
            }))
          );
        });
    }
  }, [chats]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ChatWare",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleAlign: "center",
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              onPress={logout}
              rounded
              source={{
                uri: "https://banner2.cleanpng.com/20180920/yko/kisspng-computer-icons-portable-network-graphics-avatar-ic-5ba3c66df14d32.3051789815374598219884.jpg",
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("AddChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, chatName }) => (
          <ChatList
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
