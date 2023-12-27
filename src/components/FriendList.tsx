'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../lib/supabase';
import '@/app/friends/index.css';
import { useSidebar } from '../../providers/SidebarContext';
import FriendInvite from './FriendSearch'

interface Friend {
    user1: string;
    user2: any;
    userId: string;
    username: string;
    status: string;
    avatar?: string;
}


const FriendList = () => {

    const { user } = useUser();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showAccepted, setShowAccepted] = useState(true);
    const [showPending, setShowPending] = useState(false);

    const [showPendingOptions, setShowPendingOptions] = useState(false);
    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        if (user) {
            fetchFriends(user.id);
        }
    }, [user]);

    const fetchFriends = async (userId: string) => {
        try {
            const { data: friendsData, error } = await supabase
                .from('friends')
                .select('user1, user2, status')
                .or(`user1.eq.${userId},user2.eq.${userId}`);

            if (error) {
                console.error('Error fetching friends:', error);
                return;
            }

            const uniqueFriendData: Friend[] = [];

            for (const friend of friendsData as unknown as Friend[]) {
                const friendId = friend.user1 === userId ? friend.user2 : friend.user1;
                const status = friend.status;

                const existingFriend = uniqueFriendData.find((f) => f.userId === friendId);
                if (!existingFriend) {
                    const userData = await supabase
                        .from('users')
                        .select('username, avatar_url')
                        .eq('id', friendId)
                        .single();

                    if (!userData.error) {
                        const image = userData.data?.avatar_url;
                        uniqueFriendData.push({
                            userId: friendId,
                            username: userData.data?.username || 'N/A',
                            status: status,
                            avatar: image || 'N/A',
                            user1: '',
                            user2: undefined
                        });
                    }
                }
            }

            setFriends(uniqueFriendData);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const ignoreFriend = async (friendId: string) => {
        try {

            const { error: error1 } = await supabase
                .from('friends')
                .delete()
                .eq('user1', friendId)
                .eq('user2', user?.id);


            const { error: error2 } = await supabase
                .from('friends')
                .delete()
                .eq('user1', user?.id)
                .eq('user2', friendId);

            if (error1 || error2) {
                console.error('Error ignoring friend:', error1 || error2);
            } else {

                fetchFriends(user?.id || '');
            }
        } catch (error) {
            console.error('Error ignoring friend:', error);
        }
    };

    const blockFriend = async (friendId: string) => {
        try {
            // Update the status to 'Declined' in the database for user1
            const { error: error1 } = await supabase
                .from('friends')
                .update({ status: 'Declined' })
                .eq('user1', friendId)
                .eq('user2', user?.id);

            // Update the status to 'Declined' in the database for user2
            const { error: error2 } = await supabase
                .from('friends')
                .update({ status: 'Declined' })
                .eq('user1', user?.id)
                .eq('user2', friendId);

            if (error1 || error2) {
                console.error('Error blocking friend:', error1 || error2);
            } else {
                // Update the UI by fetching the updated friend list
                fetchFriends(user?.id || '');
            }
        } catch (error) {
            console.error('Error blocking friend:', error);
        }
    };
    const acceptFriend = async (friendId: string) => {
        try {
            // Update the status to 'Accepted' in the database for both user1 and user2
            const { error: error1 } = await supabase
                .from('friends')
                .update({ status: 'Accepted' })
                .eq('user1', friendId)
                .eq('user2', user?.id);


            if (error1) {
                console.error('Error accepting friend:', error1);
            } else {
                // Update the UI by fetching the updated friend list
                fetchFriends(user?.id || '');
            }
        } catch (error) {
            console.error('Error accepting friend:', error);
        }
    };
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


    return (
        <div className="relative flex bg-gray-100 dark:bg-gray-900">
            {/* Sekcja 1: Górna lewa strona */}
            <div className="flex-1">
                {user && (
                    // <div className={`right-sidebar ${showSidebar ? 'show' : 'hide'} sm:w-64 md:w-72 lg:w-96 xl:w-120 flex flex-col h-screen`}>
                    <div className="flex-1 overflow-y-auto">

                        <div className="friend-section mt-5">
                            Znajomi

                            <ul>
                                {/* Mapowanie przez zaakceptowanych przyjaciół i wyświetlanie ich */}
                                {friends
                                    .filter((friend) => friend.status === 'Accepted')
                                    .map((friend) => (
                                        <li key={friend.userId} className="friend-list-item flex items-center justify-between mb-4 bg-gray-200 p-2 rounded w-full">
                                            <img
                                                src={friend.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                                                alt="Avatar"
                                                className="avatar w-10 h-10 rounded-full mr-2"
                                            />
                                            <div className="friend-info flex-1">
                                                <p className="username font-bold">{friend.username}</p>
                                            </div>
                                            {/* <button className="small-button" onClick={() => createGameInvitation(friend.userId, window.location.pathname)}>

                                                Invite
                                            </button> */}

                                            <button className="small-button p-2" onClick={() => ignoreFriend(friend.userId)}>
                                                Remove
                                            </button>
                                            <button className="small-button p-2" onClick={() => blockFriend(friend.userId)}>
                                                Block
                                            </button>
                                            <div className="options-dropdown relative">

                                            </div>
                                        </li>
                                    ))}
                            </ul>

                        </div>
                        <div className="friend-section mt-5">
                            <h3>
                                <button onClick={() => setShowPending(!showPending)}>
                                    {showPending ? 'Schowaj' : 'Pokaż'} Oczekujące
                                </button>
                            </h3>

                            {showPending && (
                                <ul>
                                    {/* Mapowanie przez oczekujących przyjaciół i wyświetlanie ich */}
                                    {friends
                                        .filter((friend) => friend.status === 'Pending')
                                        .map((friend) => (
                                            <li key={friend.userId} className="friend-list-item flex items-center justify-between mb-4 bg-gray-200 p-2 rounded w-full">
                                                <img
                                                    src={friend.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                                                    alt="Avatar"
                                                    className="avatar w-10 h-10 rounded-full mr-2"
                                                />
                                                <div className="friend-info flex-1">
                                                    <p className="username font-bold">{friend.username}</p>
                                                </div>

                                                <button className="small-button p-2" onClick={() => acceptFriend(friend.userId)} disabled={friend.status === 'Accepted'}>
                                                    Accept
                                                </button>
                                                <button className="small-button p-2" onClick={() => ignoreFriend(friend.userId)} disabled={friend.status === 'Accepted'}>
                                                    Ignore
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    //</div>
                )}
            </div>
        </div>
    );
}

export default FriendList;