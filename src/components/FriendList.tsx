'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../lib/supabase';
import '@/app/friends/index.css';
import { useSidebar } from '../../providers/SidebarContext';

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
    const [showPendingOptions, setShowPendingOptions] = useState(false);

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


    return (
        <div>
            {user && (
                <div className={`right-sidebar ${showSidebar ? 'show' : 'hide'}`}>

                    <h2 className="friend-list-header">Friend List</h2>
                    <div className="friend-section">
                        <h3>
                            {/* Accepted */}
                            <button
                                onClick={() => setShowAccepted(!showAccepted)} // Toggle visibility
                                className="toggle-accepted-button"
                            >
                                {showAccepted ? 'Hide' : 'Show'} Accepted
                            </button>
                        </h3>
                        {showAccepted && ( // Conditional rendering of the accepted list
                            <ul>
                                {friends
                                    .filter((friend) => friend.status === 'Accepted')
                                    .map((friend) => (
                                        <li key={friend.userId} className="friend-list-item">
                                            <img
                                                src={friend.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                                                alt="Avatar"
                                                className="avatar"
                                            />
                                            <div className="friend-info">
                                                <p className="username">{friend.username}</p>
                                            </div>


                                            <div className="options-dropdown">
                                                <button className="options-button">...</button>
                                                <ul className="options-list">
                                                    <li>
                                                        <button className="small-button" onClick={() => ignoreFriend(friend.userId)}>
                                                            Remove
                                                        </button>
                                                        <button className="small-button" onClick={() => blockFriend(friend.userId)}>
                                                            Block
                                                        </button>
                                                    </li>

                                                </ul>
                                            </div>

                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                    <div className="friend-section">
                        <h3>
                            {/* Pending */}
                            <button
                                onClick={() => setShowPending(!showPending)} // Toggle visibility
                                className="toggle-pending-button"
                            >
                                {showPending ? 'Hide' : 'Show'} Pending
                            </button>
                        </h3>
                        {showPending && ( // Conditional rendering of the pending list
                            <ul>
                                {friends
                                    .filter((friend) => friend.status === 'Pending')
                                    .map((friend) => (
                                        <li key={friend.userId} className="friend-list-item">
                                            <img
                                                src={friend.avatar || 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'}
                                                alt="Avatar"
                                                className="avatar"
                                            />
                                            <div className="friend-info">
                                                <p className="username">{friend.username}</p>
                                            </div>


                                            <div className="options-dropdown">
                                                <button className="options-button">...</button>
                                                <ul className="options-list">
                                                    <li>
                                                        <button className="small-button" onClick={() => acceptFriend(friend.userId)} disabled={friend.status === 'Accepted'}>
                                                            Accept
                                                        </button>
                                                        <button className="small-button" onClick={() => ignoreFriend(friend.userId)} disabled={friend.status === 'Accepted'}>
                                                            Ignore
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
            )
            }</div>
    );
}
export default FriendList;