// API Service Layer
// Handles all communication with the backend

const API_BASE_URL = "http://localhost:5000/api/v1";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  batch: string;
  section: string;
  yearSemester: string;
  dateOfBirth: string;
  gender: string;
  shift: string;
  bloodGroup: string;
  religion: string;
  phoneNumber: string;
  whatsapp: string;
  presentAddress: string;
  permanentAddress: string;
  emergencyContact: string;
  clubWing: "Programming" | "Cyber Security" | "R&D";
  profilePhoto: string;
  paymentMethod: "BKASH" | "NAGAD";
  transactionId: string;
  skills: string[];
  extraCurricular: string[];
  role: "user" | "admin";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  status: "in-progress" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  password: string;
  studentId: string;
  batch: string;
  section: string;
  yearSemester: string;
  dateOfBirth: string;
  gender: string;
  shift: string;
  bloodGroup: string;
  religion: string;
  phoneNumber: string;
  whatsapp?: string;
  presentAddress: string;
  permanentAddress?: string;
  emergencyContact?: string;
  clubWing: "Programming" | "Cyber Security" | "R&D";
  profilePhoto?: string;
  paymentMethod: "BKASH" | "NAGAD";
  transactionId: string;
  skills?: string[];
  extraCurricular?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  }

  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Logout failed");
    }

    return response.json();
  }

  async createMember(data: CreateMemberRequest): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/users/create-student`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  }

  async createEvent(data: {
    title: string;
    type: string;
    date: string;
    maxParticipants: number;
    wing: string;
    description: string;
    venue: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create event");
    }

    return response.json();
  }

  async createNotice(data: {
    title: string;
    content: string;
    category: string;
    attachment?: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notices`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create notice");
    }

    return response.json();
  }

  async updateNotice(id: string, data: {
    title?: string;
    content?: string;
    category?: string;
    attachment?: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update notice");
    }

    return response.json();
  }

  async createAlumni(data: {
    name: string;
    email: string;
    batch: string;
    country: string;
    company: string;
    role: string;
    linkedin?: string;
    github?: string;
  }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/alumni`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to register as alumni");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
