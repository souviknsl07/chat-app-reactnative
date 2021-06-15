import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Image, Input, Button } from "react-native-elements";
import axios from "../axios";

const Login = ({ navigation, loadUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem("token", token);
  };

  const signIn = (e) => {
    e.preventDefault();

    const loginInfo = {
      email: email,
      password: password,
    };

    axios
      .post("/api/user/login", loginInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.userId && res.data.success === "true") {
          saveAuthTokenInSession(res.data.token);
          axios
            .get(`/api/profile/${res.data.userId}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: res.data.token,
              },
            })
            .then((res) => {
              if (res.data && res.data.email) {
                loadUser(res.data);
                navigation.replace("Chats");
              }
            });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="dark" />
      <Image
        style={{ height: 200, width: 200 }}
        source={{
          uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
        }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Your email..."
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Your password.."
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button containerStyle={styles.button} onPress={signIn} title="Login" />
      <Button
        containerStyle={styles.button}
        onPress={() => navigation.navigate("Register")}
        type="outline"
        title="Register"
      />
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
