import React, { useEffect, useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../lib/supabase';


interface Friend {
    userId: string;
    username: string;
    avatar: string;
}

const FriendList: React.FC = () => {
    const { user } = useUser();
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        if (user) {
            fetchFriends(user.id);
        }
    }, [user]);

    const fetchFriends = async (userId: string) => {
        try {
            const { data: friends1, error: error1 } = await supabase
                .from('friends')
                .select('user1')
                .eq('status', 'Accepted')
                .eq('user2', userId);

            const { data: friends2, error: error2 } = await supabase
                .from('friends')
                .select('user2')
                .eq('status', 'Accepted')
                .eq('user1', userId);

            if (error1 || error2) {
                console.error('Error fetching friends:', error1 || error2);
                return;
            }

            const uniqueFriendIds = new Set<string>();

            friends1.forEach((friend) => uniqueFriendIds.add(friend.user1));
            friends2.forEach((friend) => uniqueFriendIds.add(friend.user2));

            const friendData: Friend[] = await Promise.all(
                Array.from(uniqueFriendIds).map(async (friendId) => {
                    const userData = await supabase
                        .from('users')
                        .select('username, avatar_url')
                        .eq('id', friendId)
                        .single();

                    console.log('User Data:', userData);

                    return {
                        userId: friendId,
                        username: userData?.data?.username || 'N/A',
                        avatar: userData?.data?.avatar_url || 'N/A',
                    };
                })
            );

            console.log('Friend Data:', friendData);

            setFriends(friendData);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    return (
        <div>
            <h2>Friend List</h2>
            <ul>
                {friends.map((friend) => (
                    <li key={friend.userId} className="friend-list-item">
                        <img src={friend.avatar} alt="Avatar" className="avatar" />
                        <p>Username: {friend.username}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;