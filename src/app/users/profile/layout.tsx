import ProfileCard from "@/components/main/profile/ProfileCard";
import ProfileMenu from "@/components/main/profile/ProfileMenu";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Profile",
  description: "User profile section",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" bg-muted/5 flex min-h-[60vh]">
      <div className="w-md h-full">
        <ProfileCard />
      </div>
      <div className="flex flex-col w-full">
        <ProfileMenu></ProfileMenu>
        {children}
      </div>
    </div>
  );
}
