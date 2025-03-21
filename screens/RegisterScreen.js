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
import app from "../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

const auth = getAuth();

const RegisterScreen = ({ navigation }) => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);

  const handleRegister = () => {
    if (!Email || !password) {
      Alert.alert("Veuillez entrer un email et un mot de passe");
      return;
    }

    createUserWithEmailAndPassword(auth, Email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, { displayName: Name });
      })
      .then(() => {
        Alert.alert("Votre compte a été créé avec succès !");
        navigation.navigate("Login");
      })
      .catch((err) => {
        let errorMessage = "Une erreur est survenue. Veuillez réessayer.";
        if (err.code === "auth/email-already-in-use") {
          errorMessage = "Cet email est déjà utilisé. Essayez un autre.";
        } else if (err.code === "auth/invalid-email") {
          errorMessage = "Adresse email invalide.";
        } else if (err.code === "auth/weak-password") {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
        } else if (err.code === "auth/network-request-failed") {
          errorMessage = "Problème de connexion. Vérifiez votre internet.";
        } else if (err.code === "auth/too-many-requests") {
          errorMessage = "Trop de tentatives. Essayez plus tard.";
        }
        Alert.alert("Erreur", errorMessage);
      });
  };

  return (
    <Animated.View
      style={{ flex: 1, opacity: fadeAnim, backgroundColor: "#fff" }}
    >
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
          Create Account
        </Text>
        <Text style={{ color: "#fff", fontSize: 16, marginTop: 5 }}>
          Join us today
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <SafeAreaView style={{ alignItems: "center" }}>
          <View style={{ width: "100%", marginTop: -30 }}>
            <TextInput
              value={Name}
              onChangeText={setName}
              placeholder="Full Name"
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
              value={Email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
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
              onChangeText={setPassword}
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

            <TouchableOpacity
              onPress={handleRegister}
              style={{
                backgroundColor: "#7B4397",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginBottom: 20
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Sign up
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ color: "#333" }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    color: "#7B4397",
                    fontWeight: "bold",
                    marginLeft: 5
                  }}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default RegisterScreen;
