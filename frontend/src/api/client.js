import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to inject token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  auth: {
    login: (credentials) => apiClient.post("/student/login", credentials),
    register: (userData) => apiClient.post("/student/register", userData),
    getProfile: (id) => apiClient.get(id ? `/student/${id}` : "/student/me")
  },

  // Events
  events: {
    getAll: () => apiClient.get("/events"),
    getById: (id) => apiClient.get(`/events/${id}`),
    create: (eventData) => apiClient.post("/events", eventData)
  },

  // Registrations
  registrations: {
    getByStudent: (studentId) => apiClient.get(`/registrations/student/${studentId}`),
    register: (studentId, eventId) => apiClient.post(`/registrations/student/${studentId}/event/${eventId}`),
    checkStatus: (studentId, eventId) => apiClient.get(`/registrations/student/${studentId}/event/${eventId}/status`)
  },

  // Certificates
  certificates: {
    getByStudent: (studentId) => apiClient.get(`/certificates/student/${studentId}`),
    create: (studentId, eventId, data) => apiClient.post(`/certificates/student/${studentId}/event/${eventId}`, data)
  },

  // Library
  library: {
    getAll: () => apiClient.get("/books"),
    getById: (id) => apiClient.get(`/books/${id}`),
    reserve: (id) => apiClient.post(`/books/${id}/reserve`),
    returnBook: (id) => apiClient.post(`/books/${id}/return`),
    addBook: (data) => apiClient.post("/books", data)
  },

  // Lost & Found
  lostFound: {
    getAll: () => apiClient.get("/lost-found"),
    getById: (id) => apiClient.get(`/lost-found/${id}`),
    create: (data) => apiClient.post("/lost-found", data)
  }
};

export default apiClient;
