// Import necessary modules
"use client"
import { useUserAuth } from "@/lib/userAuth";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../../hooks/useUser';
import FriendList from '@/components/FriendList'
import FriendInvite from '@/components/FriendSearch'

// New component to check and add username

function UsernameCheck() {
  const [username, setUsername] = useState('');
  const [isUsernameMissing, setIsUsernameMissing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    checkUsername();
  }, [user]);

  async function checkUsername() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      if (!data || !data.length || !data[0].username) {
        setIsUsernameMissing(true);
        setShowModal(true);
      } else {
        setUsername(data[0].username);
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  }

  const handleAddUsername = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user?.id);

      setIsUsernameMissing(false);
      setShowModal(false);
      checkUsername();
      if (error) {
        throw error;
      }

      if (data) {
        // setIsUsernameMissing(false);
        // setShowModal(false);
        // checkUsername();
      }
    } catch (error) {
      console.error('Error adding username:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      {showModal && (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-20 rounded-lg">
            <p>Proszę dodaj swój nick:</p>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
            <button
              onClick={handleAddUsername}
              className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
              Dodaj nick
            </button>
          </div>
        </div>
      )}
      {isUsernameMissing ? null : (
        <h2 className="text-2xl font-bold">Twój nick: {username}</h2>
      )}
    </div>
  );
}

// Modify the Home component to include the UsernameCheck component
export default function Home() {
  useUserAuth();


  return (
    <div className="">
      {/* Sekcja 1 i 2: Górna lewa strona */}

      <div className="flex bg-gray-100 dark:bg-gray-900">
        <div className="flex-1">
          <div className="max-w-md mx-auto p-8">Zawartość sekcji 1</div>
          <div className="max-w-md mx-auto p-8">Zawartość sekcji 2</div>
        </div>

        <div className="flex-1">

          <FriendInvite />
          <FriendList />

          <UsernameCheck />



        </div>
      </div>

    </div>
  );

}

