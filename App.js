import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef, isReadyRef, replace } from "./RootNavigation";
import Chats from "./components/Chats";
import Login from "./components/Login";
import Register from "./components/Register";
import axios from "./axios";
import AddChat from "./components/AddChat";
import Chat from "./components/Chat";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: {
    backgroundColor: "#2c65ed",
  },
  headerTitleStyle: {
    color: "white",
  },
  headerTintColor: "white",
};

const App = () => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");

    if (token) {
      axios
        .post(
          "/api/user/login",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data && res.data._id) {
            axios
              .get(`/api/profile/${res.data._id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              })
              .then((res) => {
                if (res.data && res.data.email) {
                  loadUser(res.data);
                  replace("Chats");
                }
              });
          }
        })
        .catch((err) => console.log(err));
    }

    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const loadUser = (data) => {
    setUser({
      id: data._id,
      name: data.name,
      email: data.email,
    });
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <Stack.Navigator
        // initialRouteName="Chat"
        screenOptions={globalScreenOptions}
      >
        <Stack.Screen name="Login">
          {(props) => <Login loadUser={loadUser} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(props) => <Register loadUser={loadUser} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chats">
          {(props) => <Chats user={user} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="AddChat">
          {(props) => <AddChat user={user} {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Chat">
          {(props) => <Chat user={user} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
