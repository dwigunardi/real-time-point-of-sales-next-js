'use client'

import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function Home() {
  const signout = async function () {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut()
  }

  return (
    <div>
      <Input />
      <Button onClick={() => signout()}>logout</Button>
      <DarkModeToggle />
    </div>
  );
}
