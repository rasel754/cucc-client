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

export interface Notice {
  id: string;
  title: string;
  content: string; // Mapped from backend description
  category: string;
  date: string;
  priority: string;
  hasAttachment: boolean;
  attachment?: string;
  author?: string;
  publishDate: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  studentId: string;
  department?: string; // Added department
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
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;

}

export interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  visibility: "Public" | "MemberOnly";
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  maxParticipants: number;
  venue: string;
  organizingWing: string;
  coverImage?: {
    url: string;
    publicId: string;
  };
  participants: string[];
  status?: "upcoming" | "ongoing" | "completed"; // Derived in frontend or backend
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Alumni {
  _id: string; // or id, based on backend. Usually _id for Mongo.
  id?: string;
  name: string;
  email: string;
  batch: string;
  country: string;
  company: string;
  jobRole: string; // Changed from role
  linkedIn: string; // Changed from linkedin and made required
  github: string; // Made required
  status: "PENDING" | "APPROVED" | "REJECTED";
  profilePhoto?: string; // If available
  // Add other fields if necessary based on CreateAlumni request
}

export interface ExecutiveMember {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  email: string;
  department?: string;
  batch?: string;
  profilePhoto?: string;
  image?: {
    url: string;
    publicId: string;
  };
  linkedin?: string;
  github?: string;
  bio?: string;
}


export interface Gallery {
  _id: string;
  title: string;
  description: string;
  date: string;
  images: {
    url: string;
    publicId: string;
  }[];
  category: 'All' | 'Events' | 'Workshops' | 'Contests' | 'Achievements' | 'Team';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Advisor {
  _id: string;
  name: string;
  profileImage?: {
    url: string;
    publicId: string;
  };
  email: string;
  role: string;
  department: string;
  isDeleted: boolean;
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
  paymentMethod: "BKASH" | "NAGAD";
  transactionId: string;
  skills?: string[];
  extraCurricular?: string[];
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
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

    // Get the response text first
    const responseText = await response.text();

    if (!response.ok) {
      let errorData: any = {};
      try {
        if (responseText && responseText !== "undefined") {
          errorData = JSON.parse(responseText);
        }
      } catch (e) {
        console.error("Failed to parse error response:", responseText);
      }
      throw new Error(errorData.message || `Login failed: ${response.status} ${response.statusText}`);
    }

    // Parse the success response
    try {
      if (!responseText || responseText === "undefined") {
        throw new Error("Server returned an empty or invalid response");
      }
      return JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse login response:", responseText);
      throw new Error("Server returned an invalid response. Please check if the backend is running correctly.");
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to send reset link");
    }

    return response.json();
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token // The backend expects the token in the Authorization header
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to reset password");
    }

    return response.json();
  }

  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData: any = {};
      try {
        if (responseText && responseText !== "undefined") {
          errorData = JSON.parse(responseText);
        }
      } catch (e) {
        console.error("Failed to parse error response:", responseText);
      }
      throw new Error(errorData.message || `Logout failed: ${response.status} ${response.statusText}`);
    }

    try {
      if (!responseText || responseText === "undefined") {
        return { success: true, message: "Logged out successfully" };
      }
      return JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse logout response:", responseText);
      return { success: true, message: "Logged out successfully" };
    }
  }

  async createMember(data: CreateMemberRequest, profilePhoto?: File | null): Promise<ApiResponse<User>> {
    const formData = new FormData();

    // Append the file if provided
    if (profilePhoto) {
      formData.append('file', profilePhoto);
    }

    // Append all other data as a JSON string in the 'data' field
    // This matches the backend's parseBody middleware which expects req.body.data
    formData.append('data', JSON.stringify(data));

    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Do NOT set Content-Type header - browser will set it automatically with boundary
    };

    const response = await fetch(`${API_BASE_URL}/users/create-student`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData: any = {};
      try {
        if (responseText && responseText !== "undefined") {
          errorData = JSON.parse(responseText);
        }
      } catch (e) {
        console.error("Failed to parse error response:", responseText);
      }
      throw new Error(errorData.message || `Registration failed: ${response.status} ${response.statusText}`);
    }

    try {
      if (!responseText || responseText === "undefined") {
        throw new Error("Server returned an empty or invalid response");
      }
      return JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse registration response:", responseText);
      throw new Error("Server returned an invalid response. Please check if the backend is running correctly.");
    }
  }

  async createEvent(data: {
    title: string;
    eventType: string;
    startTime: string;
    endTime: string;
    registrationDeadline: string;
    maxParticipants: number;
    organizingWing?: string;
    description: string;
    venue: string;
  }, coverImage?: File | null): Promise<ApiResponse> {
    const formData = new FormData();

    if (coverImage) {
      formData.append('file', coverImage);
    }

    // Ensure dates are ISO strings if they aren't already
    const payload = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      registrationDeadline: new Date(data.registrationDeadline).toISOString(),
    };

    formData.append('data', JSON.stringify(payload));

    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create event");
    }

    return response.json();
  }

  async getAllEvents(): Promise<ApiResponse<Event[]>> {
    const headers = this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/events/admin`, { // Using /admin endpoint for admin dashboard to see all
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch events");
    }

    return response.json();
  }

  async getEvents(): Promise<ApiResponse<Event[]>> {
    const headers = this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch events");
    }

    return response.json();
  }

  async updateEvent(id: string, data: Partial<Event>, coverImage?: File | null): Promise<ApiResponse<Event>> {
    const formData = new FormData();

    if (coverImage) {
      formData.append('file', coverImage);
    }

    // Handle date fields if present in data
    const payload = { ...data };
    if (payload.startTime) payload.startTime = new Date(payload.startTime).toISOString();
    if (payload.endTime) payload.endTime = new Date(payload.endTime).toISOString();
    if (payload.registrationDeadline) payload.registrationDeadline = new Date(payload.registrationDeadline).toISOString();

    formData.append('data', JSON.stringify(payload));

    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PATCH",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update event");
    }

    return response.json();
  }

  async deleteEvent(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete event");
    }

    return response.json();
  }

  async createNotice(data: {
    title: string;
    content: string;
    category: string;
    attachment?: string; // Kept for type compatibility, though now we use file
    publishedDate?: string;
  }, attachment?: File | null): Promise<ApiResponse> {
    const formData = new FormData();

    if (attachment) {
      formData.append('file', attachment);
    }

    // Adapt frontend 'content' to backend 'description'
    const payload = {
      title: data.title,
      description: data.content, // Map content to description
      category: data.category,
      publishedDate: data.publishedDate ? new Date(data.publishedDate).toISOString() : new Date().toISOString(),
    };

    formData.append('data', JSON.stringify(payload));

    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/notices`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create notice");
    }

    return response.json();
  }

  async getAllNotices(query?: { category?: string }): Promise<ApiResponse<Notice[]>> {
    const queryParams = new URLSearchParams();
    if (query?.category && query.category !== "All") {
      queryParams.append("category", query.category);
    }

    const response = await fetch(`${API_BASE_URL}/notices?${queryParams.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, // Public endpoint
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch notices");
    }

    // Transform backend data to frontend model
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      result.data = result.data.map((n: any) => ({
        id: n._id,
        title: n.title,
        content: n.description, // Map description to content
        category: n.category,
        date: new Date(n.publishedDate).toLocaleDateString(),
        priority: "normal", // Backend doesn't have priority yet, default to normal
        hasAttachment: !!n.attachment?.url,
        attachment: n.attachment?.url,
        author: n.author?.name || "Admin",
        publishDate: n.publishedDate,
      }));
    }

    return result;
  }

  async getSingleNotice(id: string): Promise<ApiResponse<Notice>> {
    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notice details");
    }

    const result = await response.json();
    // Transform single notice
    if (result.success && result.data) {
      const n = result.data;
      result.data = {
        id: n._id,
        title: n.title,
        content: n.description,
        category: n.category,
        date: new Date(n.publishedDate).toLocaleDateString(),
        priority: "normal",
        hasAttachment: !!n.attachment?.url,
        attachment: n.attachment?.url,
        author: n.author?.name || "Admin",
        publishDate: n.publishedDate,
      };
    }
    return result;
  }

  async updateNotice(id: string, data: {
    title?: string;
    content?: string;
    category?: string;
    attachment?: string;
  }, attachmentFile?: File | null): Promise<ApiResponse> {
    const formData = new FormData();

    if (attachmentFile) {
      formData.append('file', attachmentFile);
    }

    const payload: any = {};
    if (data.title) payload.title = data.title;
    if (data.content) payload.description = data.content; // Map content to description
    if (data.category) payload.category = data.category;

    formData.append('data', JSON.stringify(payload));

    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: "PATCH",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update notice");
    }

    return response.json();
  }

  async deleteNotice(id: string): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete notice");
    }

    return response.json();
  }

  async createAlumni(data: {
    name: string;
    email: string;
    batch: string;
    country: string;
    company: string;
    jobRole: string;
    linkedIn: string;
    github: string;
  }, profilePhoto?: File | null): Promise<ApiResponse> {
    const formData = new FormData();

    if (profilePhoto) {
      formData.append('file', profilePhoto);
    }

    formData.append('data', JSON.stringify(data));

    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/alumni`, {
      method: "POST",
      headers: headers,
      body: formData,
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to register as alumni");
    }

    return response.json();
  }


  async getAllMembers(): Promise<ApiResponse<User[]>> {
    const headers = this.getHeaders();

    const response = await fetch(`${API_BASE_URL}/member`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch members");
    }

    const result = await response.json();
    return result; // Assuming standard ApiResponse structure
  }

  async getMemberById(id: string): Promise<ApiResponse<User>> {
    const headers = this.getHeaders();
    const response = await fetch(`${API_BASE_URL}/member/admin/${id}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch member details");
    }

    return response.json();
  }

  async updateMemberStatus(id: string, status: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/member/admin/${id}/status`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ approvalStatus: status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update member status");
    }

    return response.json();
  }

  async updateMemberRole(id: string, role: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/member/admin/${id}/role`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update member role");
    }

    return response.json();
  }

  async deleteMember(id: string, isDeleted: boolean): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/member/admin/${id}/delete`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify({ isDeleted }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update member delete status");
    }

    return response.json();
  }

  // Alumni Endpoints

  async getAlumni(query?: string): Promise<ApiResponse<Alumni[]>> {
    const queryString = query ? `?${query}` : "";
    const response = await fetch(`${API_BASE_URL}/alumni${queryString}`, {
      method: "GET",
      // Public endpoint usually, but might need auth if backend requires it. 
      // Assuming public read for approved alumni as per req "GET /api/v1/alumni (Get All Approved show in publicly )"
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch alumni");
    }

    return response.json();
  }

  async getPendingAlumni(): Promise<ApiResponse<Alumni[]>> {
    const response = await fetch(`${API_BASE_URL}/alumni/pending`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch pending alumni");
    }

    return response.json();
  }

  // For Admin to see ALL alumni, usually the /alumni endpoint with a param or a specific admin endpoint.
  // Requirement says: "show all alumni list in admin alumni section" and "GET /api/v1/alumni (Get All Approved show in publicly )"
  // It effectively implies we might need to filter by status on the client or have a specific query.
  // If GET /api/v1/alumni only returns approved, and GET /api/v1/alumni/pending returns pending.
  // We might need to call both or use a different endpoint if available.
  // For now, I'll add a method that tries to get all if possible, or we will use the two available endpoints.
  // Let's assume for admin we might want to fetch everything if the backend supports it, otherwise we combine.
  // Based on standard practices, often /alumni for admin returns all if authenticated as admin, 
  // but if the public one is strictly filtered, we might need to rely on specific endpoints.
  // I will assume for now that standard getAlumni is public/approved only, and pending is separate.
  // I'll add a specific method to potentially fetch 'all' if supported, or just expose the pending one for now 
  // and we can combine them in the frontend or calling a generic 'admin' endpoint if one existed.
  // Given the explicit "GET /api/v1/alumni/pending", I will stick to these two.

  async approveAlumni(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/alumni/approve/${id}`, {
      method: "PATCH", // Changed to PATCH as per requirement "PATCH /api/v1/alumni/approve/:id"
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to approve alumni");
    }

    return response.json();
  }

  async rejectAlumni(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/alumni/reject/${id}`, {
      method: "PATCH", // Changed to PATCH as per requirement "PATCH /api/v1/alumni/reject/:id"
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to reject alumni");
    }


    return response.json();
  }

  // Executive Body Endpoints

  async getExecutiveBody(): Promise<ApiResponse<ExecutiveMember[]>> {
    const response = await fetch(`${API_BASE_URL}/executive-body`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch executive body");
    }

    return response.json();
  }

  async createExecutiveMember(data: FormData): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/executive-body`, {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create executive member");
    }

    return response.json();
  }

  async updateExecutiveMember(id: string, data: FormData): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/executive-body/${id}`, {
      method: "PATCH",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update executive member");
    }

    return response.json();
  }



  // Advisor Endpoints
  async createAdvisor(data: FormData): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/advisors`, {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create advisor");
    }

    return response.json();
  }

  async getAllAdvisors(): Promise<ApiResponse<Advisor[]>> {
    const response = await fetch(`${API_BASE_URL}/advisors`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch advisors");
    }

    return response.json();
  }

  async getSingleAdvisor(id: string): Promise<ApiResponse<Advisor>> {
    const response = await fetch(`${API_BASE_URL}/advisors/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch advisor details");
    }

    return response.json();
  }

  async updateAdvisor(id: string, data: FormData): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/advisors/${id}`, {
      method: "PATCH",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update advisor");
    }

    return response.json();
  }

  async deleteAdvisor(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/advisors/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete advisor");
    }

    return response.json();
  }
  async getExecutiveBodyMembers(): Promise<ApiResponse<ExecutiveMember[]>> {
    const response = await fetch(`${API_BASE_URL}/executive-body`, {
      method: "GET",
      // Public endpoint usually, seeing as it's for display on website
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch executive body members");
    }

    return response.json();
  }

  async addExecutiveBodyMember(data: {
    name: string;
    email: string;
    role: string;
    department?: string;
    batch?: string;
    linkedin?: string;
    github?: string;
    bio?: string;
  }, profilePhoto?: File | null): Promise<ApiResponse> {
    const formData = new FormData();

    if (profilePhoto) {
      formData.append('file', profilePhoto);
    }

    formData.append('data', JSON.stringify(data));

    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/executive-body`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add executive member");
    }

    return response.json();
  }

  async updateExecutiveBodyMember(id: string, data: Partial<ExecutiveMember>, profilePhoto?: File | null): Promise<ApiResponse> {
    const formData = new FormData();

    if (profilePhoto) {
      formData.append('file', profilePhoto);
    }

    formData.append('data', JSON.stringify(data));

    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/executive-body/${id}`, {
      method: "PATCH",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update executive member");
    }

    return response.json();
  }

  async deleteExecutiveBodyMember(id: string): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_BASE_URL}/executive-body/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete executive member");
    }

    return response.json();
  }

  // Gallery Endpoints

  async createGallery(data: {
    title: string;
    description: string;
    date?: string;
    category?: string;
  }, images: File[]): Promise<ApiResponse<Gallery>> {
    const formData = new FormData();

    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.date) formData.append('date', data.date);
    if (data.category) formData.append('category', data.category);

    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create gallery");
    }

    return response.json();
  }

  async getAllGalleries(): Promise<ApiResponse<Gallery[]>> {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: "GET",
      // Public
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch galleries");
    }

    return response.json();
  }

  async getSingleGallery(id: string): Promise<ApiResponse<Gallery>> {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "GET",
      // Public
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch gallery details");
    }

    return response.json();
  }

  async updateGallery(id: string, data: Partial<Gallery>, newImages?: File[]): Promise<ApiResponse<Gallery>> {
    const formData = new FormData();

    if (newImages && newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append('images', file);
      });
    }

    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.date) formData.append('date', data.date);
    if (data.category) formData.append('category', data.category);

    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "PATCH",
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update gallery");
    }

    return response.json();
  }

  async deleteGallery(id: string): Promise<ApiResponse> {
    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    };

    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete gallery");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
