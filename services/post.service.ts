import axios, { AxiosInstance } from "axios";

export class PostService {
    protected instance: AxiosInstance;
    public constructor(url: string) {
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Request timed out!",
        });
    }

    createPost = async (title: string, body: string, thumbnail: string, video: string, userId: string) => {
        try {
            const response = await this.instance.post("/posts", {
                title,
                body,
                thumbnail,
                video,
                userId,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    getPosts = async () => {
        try {
            const response = await this.instance.get("/posts");
            return response;
        } catch (error) {
            throw error;
        }
    }

    getPost = async (postId: string) => {
        try {
            const response = await this.instance.get(`/posts/${postId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    updatePost = async (postId: string, title: string, body: string, thumbnail: string, video: string) => {
        try {
            const response = await this.instance.put(`/posts/${postId}`, {
                title,
                body,
                thumbnail,
                video,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    deletePost = async (postId: string) => {
        try {
            const response = await this.instance.delete(`/posts/${postId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    getPostComments = async (postId: string) => {
        try {
            const response = await this.instance.get(`/posts/${postId}/comments`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    createComment = async (postId: string, body: string, userId: string) => {
        try {
            const response = await this.instance.post(`/posts/${postId}/comments`, {
                body,
                userId,
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
}