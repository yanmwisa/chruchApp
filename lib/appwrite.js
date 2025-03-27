import { Client, Account, ID } from "react-native-appwrite";
import { Platform } from "react-native";
import { BUNDLE_ID, APPWRITE_PROJECT_ID, APPWRITE_ENDPOINT } from "@env";

const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setPlatform(BUNDLE_ID);

const account = new Account(client);

export { account, ID };

console.log("Running on platform:", Platform.OS); // 'ios' or 'android'
