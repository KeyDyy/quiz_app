'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  console.log(session?.data?.user?.email)
  return (
    <div className="p-8">
      <div className='text-white'>{session?.data?.user?.email}</div>
      <div >{session?.data?.user?.name}</div>
      <button className='text-white' onClick={() => signOut()}>Logout</button>
    </div>
  )
}

Home.requireAuth = true
