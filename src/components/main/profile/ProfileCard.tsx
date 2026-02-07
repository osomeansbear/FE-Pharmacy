"use client";

import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../../../stores/authStore";

export default function ProfileCard() {
  const [isEdit, setIsEdit] = useState(false);
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full  flex flex-col justify-center gap-4 items-center border border-primary/20  bg-secondary px-8 py-4">
      <div className="bg-success rounded-full">
        <CircleUserRound
          // fill="#4a6d5a"
          strokeWidth={0.8}
          size={52}
          className="text-white"
        ></CircleUserRound>
      </div>
      {isEdit ? (
        <></>
      ) : (
        <>
          <div className="w-full">
            <div className="flex justify-between w-full border-b-1 border-muted/20 py-2">
              <span className="text-muted text-sm">Full name:</span>
              <span className="font-semibold">{user.fullName}</span>
            </div>
            <div className="flex justify-between w-full border-b-1 border-muted/20 py-2">
              <span className="text-muted text-sm">Email:</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between w-full border-b-1 border-muted/20 py-2">
              <span className="text-muted text-sm">Phone:</span>
              <span className="font-semibold">{user.phone}</span>
            </div>
            {/* <div className="flex justify-between w-full border-b-1 border-muted/20 py-2">
              <span className="text-muted text-sm">Date of birth:</span>
              <span className="font-semibold">{user.dob}</span>
            </div>
            <div className="flex justify-between w-full border-b-1 border-muted/20 py-2">
              <span className="text-muted text-sm">Gender:</span>
              <span className="font-semibold">{user.gender}</span>
            </div> */}
          </div>
          <Button
            onClick={() => {
              setIsEdit(!isEdit);
            }}
            className="border border-success bg-secondary font-semibold text-success hover:text-secondary rounded-full hover:bg-success"
          >
            Edit Profile
          </Button>
        </>
      )}
    </div>
  );
}
