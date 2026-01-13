export type UserRole = "Admin" | "Pharmacist" | "Customer";
export type UserStatus = "Active" | "Suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
};

export const users: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    email: "sarah.c@pharmacy.com",
    role: "Admin",
    status: "Active",
    lastActive: "2025-12-30",
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.w@pharmacy.com",
    role: "Pharmacist",
    status: "Active",
    lastActive: "2025-12-31",
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "m.garcia@gmail.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-12-28",
  },
  {
    id: "4",
    name: "Robert Taylor",
    email: "robert.t@pharmacy.com",
    role: "Pharmacist",
    status: "Suspended",
    lastActive: "2025-11-15",
  },
  {
    id: "5",
    name: "Linda Moore",
    email: "linda.m@gmail.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-12-25",
  },
  {
    id: "11",
    name: "Dr. Sarah Chen",
    email: "sarah.c@pharmacy.com",
    role: "Admin",
    status: "Active",
    lastActive: "2025-12-30",
  },
  {
    id: "12",
    name: "James Wilson",
    email: "james.w@pharmacy.com",
    role: "Pharmacist",
    status: "Active",
    lastActive: "2025-12-31",
  },
  {
    id: "13",
    name: "Maria Garcia",
    email: "m.garcia@gmail.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-12-28",
  },
  {
    id: "14",
    name: "Robert Taylor",
    email: "robert.t@pharmacy.com",
    role: "Pharmacist",
    status: "Suspended",
    lastActive: "2025-11-15",
  },
  {
    id: "15",
    name: "Linda Moore",
    email: "linda.m@gmail.com",
    role: "Customer",
    status: "Active",
    lastActive: "2025-12-25",
  },
  // ... add more as needed for pagination testing
];
