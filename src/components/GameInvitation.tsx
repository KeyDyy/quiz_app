'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../../hooks/useUser';

interface GameInvitation {
    invitation_id: number;
    game_id?: number | null;
    sender_user_id: string;
    receiver_user_id: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
}

const GameInvitation = () => {
    const { user } = useUser();
    const [pendingInvitations, setPendingInvitations] = useState<GameInvitation[]>([]); // Zainicjowanie jako pusta tablica

    useEffect(() => {
        if (user && user.id) {
            checkGameInvitations(user.id);
        }
    }, [user]);

    const checkGameInvitations = async (userId: string) => {
        try {
            if (!userId) {
                console.error('User ID is not valid.');
                return;
            }

            const { data, error } = await supabase
                .from('game_invitations') // Ustal typ danych
                .select()
                .eq('receiver_user_id', userId)
                .eq('status', 'Pending');

            if (error) {
                console.error('Error checking game invitations:', error);
                return;
            }

            if (!data || data.length === 0) {
                console.log('Brak oczekujących zaproszeń do gry.');
                setPendingInvitations(data);
                return;
            }

            setPendingInvitations(data);
        } catch (error) {
            console.error('Error checking game invitations:', error);
        }
    };

    const acceptGameInvitation = async (invitationId: number) => {
        try {
            const { data, error } = await supabase
                .from('game_invitations') // Ustal typ danych
                .update({ status: 'Accepted' })
                .eq('invitation_id', invitationId); // Użyj 'invitation_id' zamiast 'id'

            if (error) {
                console.error('Error accepting game invitation:', error);
            } else {
                console.log('Zaproszenie do gry zostało zaakceptowane.');
                // Odśwież listę zaproszeń
                checkGameInvitations(user?.id || '');
            }
        } catch (error) {
            console.error('Error accepting game invitation:', error);
        }
    };

    const rejectGameInvitation = async (invitationId: number) => {
        try {
            const { data, error } = await supabase
                .from('game_invitations') // Ustal typ danych
                .delete()
                .eq('invitation_id', invitationId); // Użyj 'invitation_id' zamiast 'id'

            if (error) {
                console.error('Error rejecting game invitation:', error);
            } else {
                console.log('Zaproszenie do gry zostało odrzucone.');
                // Odśwież listę zaproszeń
                checkGameInvitations(user?.id || '');
            }
        } catch (error) {
            console.error('Error rejecting game invitation:', error);
        }
    };

    return (
        <div>
            {pendingInvitations.map((invitation) => (
                <div key={invitation.invitation_id} className="mt-4 p-4 bg-gray-100 rounded">
                    <p>You have received a game invitation from a user.{invitation.sender_user_id}</p>
                    <div className="mt-4">
                        <button
                            onClick={() => acceptGameInvitation(invitation.invitation_id)}
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => rejectGameInvitation(invitation.invitation_id)}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GameInvitation;
