import { create } from 'zustand';
import {
    getTopicPosts,
    getPostDetails,
    createPost as apiCreatePost,
    deletePost as apiDeletePost,
    createComment as apiCreateComment,
    deleteComment as apiDeleteComment,
    Post,
    Comment,
    CreatePostRequest,
    CreateCommentRequest,
} from '../lib/api';

interface PostState {
    postsByTopic: Record<string, Post[]>;
    currentPost: Post | null;
    comments: Comment[];
    loading: boolean;
    fetchTopicPosts: (topicId: string, search?: string) => Promise<void>;
    fetchPostDetails: (postId: string) => Promise<void>;
    createPost: (data: CreatePostRequest) => Promise<Post>;
    deletePost: (postId: string, topicId?: string) => Promise<void>;
    createComment: (data: CreateCommentRequest) => Promise<void>;
    deleteComment: (commentId: string, postId: string) => Promise<void>;
    clearCurrentPost: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
    postsByTopic: {},
    currentPost: null,
    comments: [],
    loading: false,

    fetchTopicPosts: async (topicId: string, search = '') => {
        set({ loading: true });
        try {
            const res = await getTopicPosts(topicId, '', search);
            set((state) => ({
                postsByTopic: { ...state.postsByTopic, [topicId]: res.data || [] },
                loading: false,
            }));
        } catch {
            set({ loading: false });
        }
    },

    fetchPostDetails: async (postId: string) => {
        set({ loading: true });
        try {
            const data = await getPostDetails(postId);
            set({ currentPost: data.post, comments: data.comments || [], loading: false });
        } catch {
            set({ currentPost: null, comments: [], loading: false });
        }
    },

    createPost: async (data: CreatePostRequest) => {
        const post = await apiCreatePost(data);
        // Refresh the topic's posts
        const res = await getTopicPosts(data.topic_id);
        set((state) => ({
            postsByTopic: { ...state.postsByTopic, [data.topic_id]: res.data || [] },
        }));
        return post;
    },

    deletePost: async (postId: string, topicId?: string) => {
        await apiDeletePost(postId);
        if (topicId) {
            const res = await getTopicPosts(topicId);
            set((state) => ({
                postsByTopic: { ...state.postsByTopic, [topicId]: res.data || [] },
            }));
        }
        // Refresh current post if viewing it
        const current = get().currentPost;
        if (current && String(current.id) === String(postId)) {
            try {
                const data = await getPostDetails(postId);
                set({ currentPost: data.post, comments: data.comments || [] });
            } catch {
                set({ currentPost: null });
            }
        }
    },

    createComment: async (data: CreateCommentRequest) => {
        await apiCreateComment(data);
        // Refresh comments
        const details = await getPostDetails(data.post_id);
        set({ comments: details.comments || [] });
    },

    deleteComment: async (commentId: string, postId: string) => {
        await apiDeleteComment(commentId);
        // Refresh comments
        const details = await getPostDetails(postId);
        set({ comments: details.comments || [] });
    },

    clearCurrentPost: () => {
        set({ currentPost: null, comments: [] });
    },
}));
