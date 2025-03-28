import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert
} from "react-native";
import { login, getCurrentUser } from "../lib/auth";

const LoginScreen = ({ navigation }) => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        console.log(
          "Already logged in:",
          "user name is ",
          user.name,
          "user Email is ",
          user.email
        );
        navigation.replace("Home");
      }
    };

    checkUser();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await login(Email, password);

      console.log("user login", response);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.log("error", error);
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <Animated.View
      style={{ flex: 1, opacity: fadeAnim, backgroundColor: "#fff" }}
    >
      {/* Top purple curved section */}
      <View
        style={{
          backgroundColor: "#7B4397",
          height: 200,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>
          Welcome Back
        </Text>
        <Text style={{ color: "#fff", fontSize: 16, marginTop: 5 }}>
          Sign in to continue
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <SafeAreaView style={{ alignItems: "center" }}>
          <View style={{ width: "100%", marginTop: -30 }}>
            <TextInput
              value={Email}
              onChangeText={(text) => setEmail(text)}
              placeholder="E-mail"
              placeholderTextColor="#999"
              style={{
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 15
              }}
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={{
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 10,
                borderColor: "#ccc",
                borderWidth: 1,
                marginBottom: 10
              }}
            />
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: "right",
                  color: "#7B4397",
                  marginBottom: 20
                }}
                onPress={() => navigation.navigate("Reset")}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: "#7B4397",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 20
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Login
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ color: "#333" }}>New user?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text
                  style={{
                    color: "#7B4397",
                    fontWeight: "bold",
                    marginLeft: 5
                  }}
                >
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default LoginScreen;
