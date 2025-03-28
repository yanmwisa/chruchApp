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

export async function sendPasswordRecovery(email) {
  try {
    await account.createRecovery(email, "eglise://reset");
  } catch (error) {
    throw error;
  }
}

export async function confirmPasswordRecovery(userId, secret, newPassword) {
  try {
    await account.updateRecovery(userId, secret, newPassword, newPassword);
  } catch (error) {
    throw error;
  }
}

export async function isAdmin() {
  try {
    const user = await account.get();
    return user.labels?.includes("admin");
  } catch (e) {
    console.log("Auth check failed:", e);
    return false;
  }
}
