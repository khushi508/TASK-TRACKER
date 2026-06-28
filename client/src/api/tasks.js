const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.errors = data.errors || null;
    throw error;
  }
  return data;
}

export async function getTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/tasks${query ? `?${query}` : ""}`);
  return handleResponse(res);
}

export async function createTask(taskData) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return handleResponse(res);
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
