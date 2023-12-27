'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../lib/supabase';
import '@/app/friends/index.css';
import { useSidebar } from '../../providers/SidebarContext';
import FriendInvite from './FriendSearch'
import GameInvitation from './GameInvitation';

interface Friend {
    user1: string;
    user2: any;
    userId: string;
    username: string;
    status: string;
    avatar?: string;
}


const Notifications = () => {

    const { user } = useUser();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showAccepted, setShowAccepted] = useState(true);
    const [showPending, setShowPending] = useState(false);
    const { showSidebar } = useSidebar();
    const [showPendingOptions, setShowPendingOptions] = useState(false);
    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        if (user) {
            //fetchFriends(user.id);
        }
    }, [user]);



    const createGameInvitation = async (receiverUserId: any, quizLink: string | undefined) => {
        try {
            const senderUserId = user?.id; // Assuming you have the sender's user ID
            let quizDesc = '';

            // Check if a quiz link is provided
            if (quizLink) {
                const quizDescMatch = quizLink.match(/\/quiz\/(\w+)/);
                if (quizDescMatch) {
                    quizDesc = quizDescMatch[1];
                }
            }

            // If quizDesc is not found in the link, show a list of available descriptions
            if (!quizDesc) {
                const { data: quizzes, error: quizError } = await supabase
                    .from('quizzes')
                    .select('description');

                if (quizError) {
                    console.error('Error fetching quizzes:', quizError);
                    return;
                }

                if (quizzes && quizzes.length > 0) {
                    // Display available quiz descriptions and let the user choose
                    console.log('Choose a quiz description:');
                    quizzes.forEach((quiz) => {
                        console.log(`- ${quiz.description}`);
                    });
                    // You can implement the logic for the user to choose a quiz description here
                    // Set the chosen quizDesc based on the user's choice
                } else {
                    console.log('No quiz descriptions available.');
                    return;
                }
            }

            // Check if a pending invitation already exists between the sender and receiver
            const { data: existingInvitations, error: existingError } = await supabase
                .from('game_invitations')
                .select()
                .eq('sender_user_id', senderUserId)
                .eq('receiver_user_id', receiverUserId)
                .eq('status', 'Pending');

            if (existingError) {
                console.error('Error checking existing invitations:', existingError);
                return;
            }

            if (existingInvitations.length > 0) {
                // Handle the case where there's an existing pending invitation
                console.log('There is already a pending invitation between you and this user.');
                return;
            }

            // Create a new game invitation with the chosen quizDesc
            const { data, error } = await supabase
                .from('game_invitations')
                .upsert([
                    {
                        sender_user_id: senderUserId,
                        receiver_user_id: receiverUserId,
                        status: 'Pending',
                        quiz_desc: quizDesc, // Add quiz_desc to the invitation
                    },
                ]);

            if (error) {
                console.error('Error creating game invitation:', error);
            } else {
                // Handle successful invitation creation
                console.log('Game invitation sent successfully.');
            }
        } catch (error) {
            console.error('Error creating game invitation:', error);
        }
    };

    const handleToggleSidebar = () => {
        toggleSidebar();
    };

    return (
        <div className="relative">
            {user && (
                <div className={`right-sidebar ${showSidebar ? 'show' : 'hide'} sm:w-64 md:w-72 lg:w-96 xl:w-120 flex flex-col h-screen`}>
                    <div className="flex-1 overflow-y-auto">
                        <button onClick={handleToggleSidebar} className="bg-white">
                            <h2 className="friend-list-header text-xl font-bold">Powiadowmienia</h2>
                        </button>
                        {showSidebar && (

                            <GameInvitation />

                        )}
                    </div>
                </div>


            )
            }
        </div >
    )
};

export default Notifications;