'use client'
import Link from "next/link";
import React from "react";
import useAuthModal from "../../../hooks/useAuthModal";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from "../../../hooks/useUser";
import { toast } from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Navbar = ({

}) => {
  //const player = usePlayer();
  const router = useRouter();
  const authModal = useAuthModal();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    //player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="sticky inset-x-0 top-0 bg-white dark:bg-gray-950 z-[20] h-fit border-b border-zinc-300">
      <div className="flex items-center justify-between py-2 px-8 mx-auto max-w-7xl">

        <button onClick={() => router.push('/')} className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
          Quiz_app
        </button>


        {user ? (
          <div className="flex gap-x-4 items-center">

            {user.email}
            <Button
              onClick={() => router.push('/account')}
              className="bg-white"
            >
              <FaUserAlt />
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-white px-6 py-2"
            >
              Logout
            </Button>
          </div>
        ) : (
          <button onClick={authModal.onOpen}
            className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white ml-4">Zaloguj</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
