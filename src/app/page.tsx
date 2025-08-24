import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold">Welcome Dwi Gunardi Meinaki</h1>
      <Link href="/admin">
        <Button className="bg-cyan-600">Access Dashboard</Button>
      </Link>
    </div>
  );
}
