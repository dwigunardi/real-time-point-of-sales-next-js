import { Button } from "@/components/ui/button";
import { Roles } from "@/constants/role-constant";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    return redirect('/login')
  }

  const cookieStore = await cookies();
  const profile = JSON.parse(cookieStore.get('user_profile')?.value || '{}');

  if (profile.role.toUpperCase() == Roles.ADMIN) {
    return redirect('/admin')
  }

  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold">Welcome Dwi Gunardi Meinaki</h1>
      <Link href="/admin">
        <Button className="bg-cyan-600">Access Dashboard</Button>
      </Link>
    </div>
  );
}
