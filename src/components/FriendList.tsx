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
    const { showSidebar } = useSidebar();
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

    const handleToggleSidebar = () => {
        toggleSidebar();
    };

    return (
        <div className="relative">
            {user && (
                <div className={`right-sidebar ${showSidebar ? 'show' : 'hide'} sm:w-64 md:w-72 lg:w-96 xl:w-120 flex flex-col h-screen`}>
                    <div className="flex-1 overflow-y-auto">
                        <button onClick={handleToggleSidebar} className="bg-white">
                            <h2 className="friend-list-header text-xl font-bold">Friend List</h2>
                        </button>
                        <div className="friend-section mt-5">
                            <h3>
                                <button
                                    onClick={() => setShowAccepted(!showAccepted)}
                                    className="toggle-accepted-button text-blue-500"
                                >
                                    {showAccepted ? 'Pokaż' : 'Ukryj'} Zaakceptowane
                                </button>
                            </h3>
                            {showAccepted && (
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

                                                <div className="options-dropdown relative">
                                                    <button className="options-button text-2xl cursor-pointer">...</button>
                                                    <ul className="options-list hidden absolute z-10 bg-white border border-gray-300 list-none p-0 -left-10">
                                                        <li>
                                                            <button className="small-button p-2" onClick={() => ignoreFriend(friend.userId)}>
                                                                Usuń
                                                            </button>
                                                            <button className="small-button p-2" onClick={() => blockFriend(friend.userId)}>
                                                                Zablokuj
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                        <div className="friend-section mt-5">
                            <h3>
                                <button
                                    onClick={() => setShowPending(!showPending)}
                                    className="toggle-pending-button text-blue-500"
                                >
                                    {showPending ? 'Ukryj' : 'Pokaż'} Oczekujące
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

                                                <div className="options-dropdown relative">
                                                    <button className="options-button text-2xl cursor-pointer">...</button>
                                                    <ul className="options-list hidden absolute z-10 bg-white border border-gray-300 list-none p-0 -left-10">
                                                        <li>
                                                            <button className="small-button p-2" onClick={() => acceptFriend(friend.userId)} disabled={friend.status === 'Accepted'}>
                                                                Akceptuj
                                                            </button>
                                                            <button className="small-button p-2" onClick={() => ignoreFriend(friend.userId)} disabled={friend.status === 'Accepted'}>
                                                                Usuń
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    {showSidebar && (

                        <FriendInvite />

                    )}
                </div>
            )}
        </div>
    )
};

export default FriendList;