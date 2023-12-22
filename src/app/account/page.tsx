"use client";

import { useUserAuth } from "@/lib/userAuth";

export default function Home() {
  useUserAuth();
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="max-w-8xl mx-auto p-24">Witaj użytkowniku!</div>
    </div>
  );
}
