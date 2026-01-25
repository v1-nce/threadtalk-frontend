import { create } from 'zustand';
import { getTopics, createTopic as apiCreateTopic, Topic, CreateTopicRequest } from '../lib/api';

interface TopicState {
    topics: Topic[];
    loading: boolean;
    fetchTopics: () => Promise<void>;
    createTopic: (data: CreateTopicRequest) => Promise<Topic>;
    getTopicById: (id: string) => Topic | undefined;
}

export const useTopicStore = create<TopicState>((set, get) => ({
    topics: [],
    loading: false,

    fetchTopics: async () => {
        set({ loading: true });
        try {
            const topics = await getTopics();
            set({ topics, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    createTopic: async (data: CreateTopicRequest) => {
        const topic = await apiCreateTopic(data);
        set((state) => ({ topics: [...state.topics, topic] }));
        return topic;
    },

    getTopicById: (id: string) => {
        return get().topics.find((t) => String(t.id) === String(id));
    },
}));
