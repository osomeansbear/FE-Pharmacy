"use client";

// import { users } from "@/constants/userMockData";
import UsersTable from "@/components/desktop/admin/users/UsersTable";

// interface User = {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   status: UserStatus;
//   lastActive: string;
// };
export default function UsersPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <UsersTable />
      </div>
      {/* Mobile */}
      <div className="block md:hidden"></div>
    </>
  );
}
