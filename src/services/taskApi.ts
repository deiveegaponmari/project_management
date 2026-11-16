const API_BASE = import.meta.env.PROD
  ? 'https://backend-project-management-bix8.onrender.com/api'
  : 'http://localhost:5000/api';

const parseJson = async (response: Response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  return data;
};

export const registerUser = async (payload: { name: string; email: string; password: string }) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Registration failed');
  }

  return data;
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('taskflow_token') || ''}`,
    },
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch tasks');
  }

  return (data || []).map((task: any) => ({
    id: task._id || task.id,
    projectId: task.project?._id || task.project || null,
    title: task.title,
    description: task.description || '',
    status: task.status || 'backlog',
    assignee: task.assignee?.name || task.assignee || 'Unassigned',
    dueDate: task.dueDate || null,
    priority: task.priority || 'medium',
    comments: Array.isArray(task.comments) ? task.comments.map((comment: any) => comment.text || comment) : [],
    activity: Array.isArray(task.activity) ? task.activity.map((item: any) => item.details || item.action || item) : [],
  }));
};

export const createTask = async (payload: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('taskflow_token') || ''}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create task');
  }

  return data;
};

export const updateTaskStatus = async (taskId: string, payload: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('taskflow_token') || ''}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update task');
  }

  return data;
};

export const addTaskComment = async (taskId: string, payload: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('taskflow_token') || ''}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to add comment');
  }

  return data;
};
