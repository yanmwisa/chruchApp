// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBau5rIV4KlWRDWXokmSMbbMrzsiDrCQmI",
  authDomain: "church-79c42.firebaseapp.com",
  projectId: "church-79c42",
  storageBucket: "church-79c42.firebasestorage.app",
  messagingSenderId: "200895707830",
  appId: "1:200895707830:web:b4905edaa35ee3ede94417"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
