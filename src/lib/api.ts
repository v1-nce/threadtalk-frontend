import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: '', // process.env.NEXT_PUBLIC_API_URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const MAX_RETRIES = 10;
const RETRYABLE_STATUSES = [408, 500, 503];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error: string }>) => {
    const config = error.config as any;
    const status = error.response?.status;
    
    // Handle rate limiting (429)
    if (status === 429) {
      const retryAfter = parseInt(error.response?.headers['retry-after'] || '60', 10) * 1000;
      if (config && !config._rateLimitRetry) {
        config._rateLimitRetry = true;
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        return api(config);
      }
    }
    
    // Handle retryable errors (408, 500, 503)
    if (status && RETRYABLE_STATUSES.includes(status) && config && !config._retry) {
      config._retry = config._retry || 0;
      
      if (config._retry < MAX_RETRIES) {
        config._retry += 1;
        const delay = Math.pow(2, config._retry - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(config);
      }
    }
    
    throw new Error(error.response?.data?.error || error.message);
  }
);

export interface User {
  id: string;
  username: string;
  email?: string;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  topic_id: string;
  created_at: string;
  username: string;
  comment_count: number;
}

export interface PaginatedPosts {
  data: Post[];
  next_cursor: string;
}

export interface PostDetailsResponse {
  post: Post;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id?: string;
  created_at: string;
  username: string;
  children?: Comment[];
}

export interface SignupRequest {
  username: string;
  password: string;
}

export type SignupResponse = User | { 
  message: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = User | { 
  message: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface CreateTopicRequest {
  name: string;
  description: string;
}

// Create Topic Response

export interface CreatePostRequest {
  title: string;
  content: string;
  topic_id: string;
}

// Create Post Response

export interface CreateCommentRequest {
  content: string;
  post_id: string;
  parent_id?: string;
}

export type GetTopicsResponse = Topic[];

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>('/api/profile');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createTopic = async (data: CreateTopicRequest): Promise<Topic> => {
  const response = await api.post<Topic>('/api/topics', data);
  return response.data;
};

export const getTopics = async (): Promise<Topic[]> => {
  const response = await api.get<Topic[]>('/topics');
  return response.data;
};

export const getTopicPosts = async (topicId: string, cursor = '', search = ''): Promise<PaginatedPosts> => {
  const query = new URLSearchParams({ cursor });
  if (search) query.append("search", search);
  const response = await api.get<PaginatedPosts>(`/topics/${topicId}/posts?${query.toString()}`);
  return response.data;
};

export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await api.post<Post>('/api/posts', data);
  return response.data;
};

export const getPostDetails = async (postId: string): Promise<PostDetailsResponse> => {
  const response = await api.get<PostDetailsResponse>(`/posts/${postId}`);
  return response.data;
};

export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  const response = await api.post<Comment>('/api/comments', data);
  return response.data;
};

export default api;