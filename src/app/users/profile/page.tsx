import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/users/profile/orders");
}
