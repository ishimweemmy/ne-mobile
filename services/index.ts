import { AuthService } from "./auth.service";
import { PostService } from "./post.service";

const authService = new AuthService("http://192.168.1.200:5000");
const postService = new PostService("https://jsonplaceholder.typicode.com");

export { authService, postService }
