export const validateUsername = (username: string): string | null => {
  if (username.length < 3 || username.length > 50) {
    return "Username must be between 3 and 50 characters";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
};

export const validatePostTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (trimmed.length < 5 || title.length > 250) {
    return "Title must be between 5 and 250 characters";
  }
  return null;
};

export const validatePostContent = (content: string): string | null => {
  if (content.length > 600) {
    return "Content must be 600 characters or less";
  }
  return null;
};

export const validateCommentContent = (content: string): string | null => {
  if (content.length > 2000) {
    return "Comment must be 2000 characters or less";
  }
  return null;
};

export const validateTopicName = (name: string): string | null => {
  if (name.trim().length < 1 || name.length > 50) {
    return "Topic name must be between 1 and 50 characters";
  }
  return null;
};

export const validateTopicDescription = (description: string): string | null => {
  if (description.length > 600) {
    return "Description must be 600 characters or less";
  }
  return null;
};

