import { account, ID } from "./appwrite";

export async function signUp(email, password, name) {
  try {
    const response = await account.create(ID.unique(), email, password, name);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function login(email, password) {
  try {
    // Optional: logout any existing session before logging in
    await account.deleteSession("current");
  } catch (_) {
    // No active session — ignore
  }
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch {
    return null;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw error;
  }
}
