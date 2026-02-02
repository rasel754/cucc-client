// Mock data for the entire application
// Replace with real API calls when backend is ready

export interface Member {
  id: string;
  memberId: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  batch: string;
  department: string;
  wing: "programming" | "cybersecurity" | "research";
  role: "member" | "admin" | "executive";
  status: "pending" | "approved" | "rejected";
  joinDate: string;
  eventsParticipated: number;
  avatar?: string;
  skills: string[];
  bloodGroup: string;
  address: string;
}

export interface Event {
  id: string;
  title: string;
  type: "contest" | "workshop" | "seminar" | "hackathon" | "bootcamp";
  date: string;
  status: "upcoming" | "ongoing" | "completed";
  participants: number;
  maxParticipants: number;
  wing: "programming" | "cybersecurity" | "research" | "all";
  description: string;
  venue: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "general" | "event" | "result" | "important";
  publishDate: string;
  author: string;
  attachment?: string;
}

export interface Certificate {
  id: string;
  title: string;
  eventName: string;
  issueDate: string;
  type: "participation" | "achievement" | "completion";
  downloadUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  position?: string;
}

// Current logged-in user (mock)
export const currentUser: Member = {
  id: "u1",
  memberId: "CUCC-2024-001",
  name: "Rakib Hassan",
  email: "rakib.hassan@student.cu.edu.bd",
  phone: "+8801712345678",
  studentId: "2021-1-60-001",
  batch: "60",
  department: "CSE",
  wing: "programming",
  role: "member",
  status: "approved",
  joinDate: "2024-01-15",
  eventsParticipated: 12,
  skills: ["Python", "JavaScript", "React", "Problem Solving"],
  bloodGroup: "O+",
  address: "Dhaka, Bangladesh",
};

// All members
export const members: Member[] = [
  currentUser,
  {
    id: "u2",
    memberId: "CUCC-2024-002",
    name: "Fatima Akter",
    email: "fatima.akter@student.cu.edu.bd",
    phone: "+8801812345678",
    studentId: "2021-1-60-015",
    batch: "60",
    department: "CSE",
    wing: "cybersecurity",
    role: "executive",
    status: "approved",
    joinDate: "2024-01-20",
    eventsParticipated: 18,
    skills: ["Network Security", "Penetration Testing", "Linux"],
    bloodGroup: "A+",
    address: "Chittagong, Bangladesh",
  },
  {
    id: "u3",
    memberId: "CUCC-2024-003",
    name: "Mehedi Hasan",
    email: "mehedi.hasan@student.cu.edu.bd",
    phone: "+8801912345678",
    studentId: "2022-1-61-022",
    batch: "61",
    department: "CSE",
    wing: "research",
    role: "member",
    status: "approved",
    joinDate: "2024-02-10",
    eventsParticipated: 8,
    skills: ["Machine Learning", "Data Science", "Python"],
    bloodGroup: "B+",
    address: "Sylhet, Bangladesh",
  },
  {
    id: "u4",
    memberId: "CUCC-2024-004",
    name: "Nadia Islam",
    email: "nadia.islam@student.cu.edu.bd",
    phone: "+8801612345678",
    studentId: "2022-1-61-033",
    batch: "61",
    department: "EEE",
    wing: "programming",
    role: "member",
    status: "pending",
    joinDate: "2024-03-05",
    eventsParticipated: 0,
    skills: ["C++", "Competitive Programming"],
    bloodGroup: "AB+",
    address: "Rajshahi, Bangladesh",
  },
  {
    id: "u5",
    memberId: "CUCC-2024-005",
    name: "Tanvir Rahman",
    email: "tanvir.rahman@student.cu.edu.bd",
    phone: "+8801512345678",
    studentId: "2023-1-62-011",
    batch: "62",
    department: "CSE",
    wing: "cybersecurity",
    role: "member",
    status: "pending",
    joinDate: "2024-03-15",
    eventsParticipated: 0,
    skills: ["Ethical Hacking", "Web Security"],
    bloodGroup: "O-",
    address: "Khulna, Bangladesh",
  },
  {
    id: "u6",
    memberId: "CUCC-2024-006",
    name: "Sabrina Khanam",
    email: "sabrina.khanam@student.cu.edu.bd",
    phone: "+8801312345678",
    studentId: "2020-1-59-044",
    batch: "59",
    department: "CSE",
    wing: "research",
    role: "admin",
    status: "approved",
    joinDate: "2023-06-01",
    eventsParticipated: 25,
    skills: ["AI", "Deep Learning", "Research Writing"],
    bloodGroup: "A-",
    address: "Dhaka, Bangladesh",
  },
];

// Events
export const events: Event[] = [
  {
    id: "e1",
    title: "Intra University Programming Contest 2024",
    type: "contest",
    date: "2024-04-15",
    status: "upcoming",
    participants: 45,
    maxParticipants: 100,
    wing: "programming",
    description: "Annual programming contest for all CUCC members",
    venue: "Computer Lab 1, Block C",
  },
  {
    id: "e2",
    title: "Cybersecurity Workshop: Ethical Hacking",
    type: "workshop",
    date: "2024-04-10",
    status: "upcoming",
    participants: 30,
    maxParticipants: 50,
    wing: "cybersecurity",
    description: "Hands-on workshop on ethical hacking techniques",
    venue: "Seminar Hall, Block A",
  },
  {
    id: "e3",
    title: "AI/ML Research Seminar",
    type: "seminar",
    date: "2024-03-25",
    status: "completed",
    participants: 80,
    maxParticipants: 100,
    wing: "research",
    description: "Research presentations on latest AI/ML advancements",
    venue: "Auditorium, Main Building",
  },
  {
    id: "e4",
    title: "Web Development Bootcamp",
    type: "bootcamp",
    date: "2024-03-01",
    status: "completed",
    participants: 60,
    maxParticipants: 60,
    wing: "programming",
    description: "5-day intensive bootcamp on full-stack development",
    venue: "Computer Lab 2, Block C",
  },
  {
    id: "e5",
    title: "CUCC Hackathon 2024",
    type: "hackathon",
    date: "2024-05-20",
    status: "upcoming",
    participants: 25,
    maxParticipants: 50,
    wing: "all",
    description: "24-hour hackathon with exciting prizes",
    venue: "Innovation Hub, Block D",
  },
];

// Notices
export const notices: Notice[] = [
  {
    id: "n1",
    title: "Registration Open for Intra University Contest",
    content: "Online registration is now open for the Intra University Programming Contest 2024. All members are encouraged to participate.",
    category: "event",
    publishDate: "2024-03-20",
    author: "Sabrina Khanam",
  },
  {
    id: "n2",
    title: "New Member Orientation Session",
    content: "All newly approved members are invited to attend the orientation session on March 28th at 3:00 PM.",
    category: "general",
    publishDate: "2024-03-18",
    author: "Executive Committee",
  },
  {
    id: "n3",
    title: "Web Development Bootcamp Results",
    content: "Congratulations to all participants! Certificates will be distributed next week.",
    category: "result",
    publishDate: "2024-03-10",
    author: "Programming Wing",
  },
  {
    id: "n4",
    title: "Important: Membership Fee Deadline",
    content: "All members are reminded to pay their annual membership fee by March 31st to maintain active status.",
    category: "important",
    publishDate: "2024-03-15",
    author: "Treasurer",
  },
];

// Certificates for current user
export const certificates: Certificate[] = [
  {
    id: "c1",
    title: "Participation Certificate",
    eventName: "Web Development Bootcamp 2024",
    issueDate: "2024-03-06",
    type: "completion",
    downloadUrl: "#",
  },
  {
    id: "c2",
    title: "1st Runner Up",
    eventName: "Intra University Contest 2023",
    issueDate: "2023-12-15",
    type: "achievement",
    downloadUrl: "#",
  },
  {
    id: "c3",
    title: "Participation Certificate",
    eventName: "AI/ML Research Seminar",
    issueDate: "2024-03-25",
    type: "participation",
    downloadUrl: "#",
  },
];

// User achievements
export const userAchievements: Achievement[] = [
  {
    id: "a1",
    title: "1st Runner Up - Intra University Contest 2023",
    description: "Secured 2nd position among 80+ participants",
    date: "2023-12-15",
    position: "2nd",
  },
  {
    id: "a2",
    title: "Best Project Award - Web Dev Bootcamp",
    description: "Built an innovative e-commerce platform",
    date: "2024-03-06",
    position: "1st",
  },
];

// User's participated events
export const userEvents: Event[] = events.filter(e => e.status === "completed").slice(0, 3);

// Dashboard stats
export const dashboardStats = {
  totalMembers: 156,
  pendingApprovals: 12,
  activeEvents: 3,
  totalEvents: 45,
  totalCertificates: 234,
  monthlyGrowth: 15,
};

// Wing names mapping
export const wingNames = {
  programming: "Programming Club",
  cybersecurity: "Cyber Security Club",
  research: "R&D Club",
};

// Role names mapping
export const roleNames = {
  member: "Member",
  admin: "Admin",
  executive: "Executive",
};

// Status colors
export const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
};

// Event type colors
export const eventTypeColors = {
  contest: "bg-primary/10 text-primary border-primary/20",
  workshop: "bg-cucc-cyber/10 text-cucc-cyber border-cucc-cyber/20",
  seminar: "bg-cucc-gold/10 text-cucc-gold border-cucc-gold/20",
  hackathon: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  bootcamp: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};
