import { postService } from "@/services";
import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "",
  platform: "",
  projectId: "",
  databaseId: "",
  userCollectionId: "",
  videosCollectionId: "",
  commentsCollectionId: "",
  storageId: "",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarUrl }
    );
    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId
    );
    const result = await postService.getPosts();
    if (result.status !== 200) {
      Alert.alert("Unable to fetch posts")
      throw new Error("Could not fetch posts");
    }
    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file: any, type: string) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId: string, type: string) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form: any) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.body,
        creator: form.userId,
      }
    );

    // post this to jsonplaceholder
    const response = await postService.createPost(form.title, form.body, thumbnailUrl as any, videoUrl as any, form.userId);
    if (response.status !== 201) Alert.alert("Error", "Post could not be uploaded");

    return {
      newPost,
      response,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.equal("creator", userId)]
    );

    const result = await postService.getPosts();

    if (result.status !== 200) {
      Alert.alert("Error", "Posts could not be fetched");
    }

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get video post by id
export async function getPost(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      postId
    );

    const result = await postService.getPost(postId);

    if (result.status !== 200) {
      Alert.alert("Error", "Post could not be fetched");
    }

    return [post];
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getComments(postId: string) {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.equal("post", postId)]
    );
    const result = await postService.getPostComments(postId);
    if (result.status !== 200) {
      Alert.alert("Error", "Comments could not be fetched");
    }

    return comments.documents;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createComment(postId: string, comment: { name: string, body: string, userId: string }) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        post: postId,
        name: comment.name,
        body: comment.body,
        user: comment.userId,
      }
    );

    const result = await postService.createComment(postId, comment.body, comment.userId);

    if (result.status !== 201) {
      Alert.alert("Error", "Comment could not be uploaded");
    }

    return newComment;

  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deletePost(postId: string) {
  try {
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      postId
    );

    const result = await postService.deletePost(postId);

    if (result.status !== 200) {
      Alert.alert("Error", "Post could not be deleted");
    }

    return deletedPost;
  } catch (error: any) {
    throw new Error(error);
  }
}
