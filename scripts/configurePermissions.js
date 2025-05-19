const { Client, Databases, ID, Permission, Role } = require("node-appwrite");
require("dotenv").config();

// Initialiser le client Appwrite
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const NOTIFICATIONS_COLLECTION_ID = "682ac5ea002385d029ee";
const NOTIFICATION_TOKENS_COLLECTION_ID = "682ac6f9000c44f3dde8";
const POSTS_COLLECTION_ID = "67e6ce9c0032a8690644";

async function configurePermissions() {
  try {
    console.log("Configuring permissions for collections...");

    // Configurer les permissions pour la collection posts
    await databases.updateCollection(
      APPWRITE_DATABASE_ID,
      POSTS_COLLECTION_ID,
      undefined, // Ne pas changer le nom
      undefined, // Ne pas changer la configuration
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    console.log("Posts collection permissions updated successfully");

    // Configurer les permissions pour la collection notifications
    await databases.updateCollection(
      APPWRITE_DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      undefined,
      undefined,
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );
    console.log("Notifications collection permissions updated successfully");

    // Configurer les permissions pour la collection notification_tokens
    await databases.updateCollection(
      APPWRITE_DATABASE_ID,
      NOTIFICATION_TOKENS_COLLECTION_ID,
      undefined,
      undefined,
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );
    console.log(
      "Notification tokens collection permissions updated successfully"
    );

    console.log("All permissions configured successfully");
  } catch (error) {
    console.error("Error configuring permissions:", error);
  }
}

configurePermissions();
