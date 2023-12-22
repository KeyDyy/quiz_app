'use client'
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../../hooks/useUser';
//import '@/app/friends/index.css';
// Define a type for the found user data
type FoundUser = {
    id: string;
    full_name: string | null;
    username: string;
    avatar_url: string | null;
};

const InviteFriend = () => {
    const { user } = useUser();
    const [username, setUsername] = useState('');
    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setFoundUser(null); // Reset foundUser when the username changes
    };

    const findUser = async () => {
        try {
            if (username) {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, full_name, username, avatar_url')
                    .like('username', `%${username}%`)
                    .single();

                if (error) {
                    //throw new Error('Error finding user:', error);
                }

                if (data) {
                    setFoundUser(data);
                } else {
                    setFoundUser(null);
                }
            } else {
                // Throw an error if the input is empty or not provided.
                throw new Error('Username is required.');
            }
        } catch (error) {
            console.error('Error finding user:', error);
        }
    };

    const inviteFriend = async () => {

        if (foundUser && user) {
            try {
                console.log('user object:', user); // Debugging statement to inspect the user object
                console.log('user ID', user.id);

                // Check if an invite already exists from user1 to user2 with status "Pending"
                const existingInviteUser1ToUser2 = await supabase
                    .from('friends')
                    .select('id,user1,user2')
                    .eq('user1', user.id)
                    .eq('user2', foundUser.id)
                    .single()

                // Check if an invite already exists from user2 to user1 with status "Pending"
                const existingInviteUser2ToUser1 = await supabase
                    .from('friends')
                    .select('id,user1,user2')
                    .eq('user1', foundUser.id)
                    .eq('user2', user.id)
                    .single()

                if (existingInviteUser1ToUser2.data || existingInviteUser2ToUser1.data) {
                    console.log('Friend invitation already exists.');
                    // Show an alert or handle this case as needed.
                    alert('Friend invitation already exists.');
                } else {
                    // If no existing invite is found, create a new record in the "friends" table.
                    const { error } = await supabase
                        .from('friends')
                        .upsert([
                            {
                                user1: user.id, // Currently logged user as user1
                                user2: foundUser.id,
                                status: 'Pending',
                            }
                        ]);

                    if (error) {
                        console.error('Error sending friend invitation:', error);
                    } else {
                        console.log('Invitation sent successfully.');
                    }
                }
            } catch (error) {
                console.error('Error inviting friend:', error);
            }
        }
    };

    return (
        <div className="relative">
            {user && (

                <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 transform translate-y-full sm:translate-y-0">
                    <h2 className="text-2xl font-bold">Find and Invite Friends by Username</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className="input w-2/3 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter username or ID"
                        />
                        <button onClick={findUser} className="findButton bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                            Find User
                        </button>
                    </div>
                    {foundUser && (
                        <div className="mt-4">
                            <h3 className="text-xl font-bold">Found User</h3>
                            <p>Username: {foundUser.username}</p>
                            <p>Full Name: {foundUser.full_name || 'N/A'}</p>
                            <button onClick={inviteFriend} className="inviteButton bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                                Invite to Friends
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default InviteFriend;
