"use client";
import Link from "next/link";
import React from "react";
import useAuthModal from "../../../hooks/useAuthModal";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import { useSidebar } from '../../../providers/SidebarContext';

function isScreenSizeGreaterThan1000() {
  return window.innerWidth > 1000;
}

const Navbar = () => {
  const router = useRouter();
  const authModal = useAuthModal();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const { toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    //player.reset();
    router.refresh();
    router.push("/");
    if (error) {
      toast.error(error.message);
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (

    <div className="sticky inset-x-0 top-0 bg-white dark:bg-gray-950 z-[20] h-fit border-b border-zinc-300">
      <div className="flex items-center justify-between py-2 px-8 mx-auto max-w-7xl">
        <button
          onClick={() => router.push("/")}
          className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white"
        >
          Quiz_app
        </button>

        {user ? (
          <div className="flex gap-x-4 items-center">
            {isScreenSizeGreaterThan1000() && (
              <div className="email">{user.email}</div>
            )}
            <Button
              onClick={() => router.push("/account")}
              className="bg-white"
            >
              <FaUserAlt />
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-white rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white"
            >
              Wyloguj
            </Button>

            <Button onClick={handleToggleSidebar} className="bg-white">
              Powiadomienia
            </Button>
          </div>
        ) : (
          <button
            onClick={authModal.onOpen}
            className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white ml-4"
          >
            Zaloguj
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
