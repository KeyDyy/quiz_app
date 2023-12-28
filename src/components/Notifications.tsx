"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { supabase } from "../lib/supabase";
import "@/app/friends/index.css";
import { useSidebar } from "../../providers/SidebarContext";
import FriendInvite from "./FriendSearch";
//import GameInvitation from './GameInvitation';

interface Friend {
  user1: string;
  user2: any;
  userId: string;
  username: string;
  status: string;
  avatar?: string;
}

interface GameInvitation {
  invitation_id: number;
  game_id?: number | null;
  sender_user_id: string;
  receiver_user_id: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const Notifications = () => {
  const { user } = useUser();
  const { showSidebar } = useSidebar();
  const { toggleSidebar } = useSidebar();
  const [pendingInvitations, setPendingInvitations] = useState<
    GameInvitation[]
  >([]); // Zainicjowanie jako pusta tablica

  useEffect(() => {
    if (user && user.id) {
      checkGameInvitations(user.id);
    }
  }, [user]);

  const checkGameInvitations = async (userId: string) => {
    try {
      if (!userId) {
        console.error("User ID is not valid.");
        return;
      }

      const { data, error } = await supabase
        .from("game_invitations") // Ustal typ danych
        .select()
        .eq("receiver_user_id", userId)
        .eq("status", "Pending");

      if (error) {
        console.error("Error checking game invitations:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.log("Brak oczekujących zaproszeń do gry.");
        setPendingInvitations(data);
        return;
      }

      setPendingInvitations(data);
    } catch (error) {
      console.error("Error checking game invitations:", error);
    }
  };

  const acceptGameInvitation = async (invitationId: number) => {
    try {
      const { data, error } = await supabase
        .from("game_invitations") // Ustal typ danych
        .update({ status: "Accepted" })
        .eq("invitation_id", invitationId); // Użyj 'invitation_id' zamiast 'id'

      if (error) {
        console.error("Error accepting game invitation:", error);
      } else {
        console.log("Zaproszenie do gry zostało zaakceptowane.");
        // Odśwież listę zaproszeń
        checkGameInvitations(user?.id || "");
      }
    } catch (error) {
      console.error("Error accepting game invitation:", error);
    }
  };

  const rejectGameInvitation = async (invitationId: number) => {
    try {
      const { data, error } = await supabase
        .from("game_invitations") // Ustal typ danych
        .delete()
        .eq("invitation_id", invitationId); // Użyj 'invitation_id' zamiast 'id'

      if (error) {
        console.error("Error rejecting game invitation:", error);
      } else {
        console.log("Zaproszenie do gry zostało odrzucone.");
        // Odśwież listę zaproszeń
        checkGameInvitations(user?.id || "");
      }
    } catch (error) {
      console.error("Error rejecting game invitation:", error);
    }
  };

  const createGameInvitation = async (
    receiverUserId: any,
    quizLink: string | undefined
  ) => {
    try {
      const senderUserId = user?.id;
      let quizDesc = "";

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
          .from("quizzes")
          .select("description");

        if (quizError) {
          console.error("Error fetching quizzes:", quizError);
          return;
        }

        if (quizzes && quizzes.length > 0) {
          // Display available quiz descriptions and let the user choose
          console.log("Choose a quiz description:");
          quizzes.forEach((quiz) => {
            console.log(`- ${quiz.description}`);
          });
          // You can implement the logic for the user to choose a quiz description here
          // Set the chosen quizDesc based on the user's choice
        } else {
          console.log("No quiz descriptions available.");
          return;
        }
      }

      // Check if a pending invitation already exists between the sender and receiver
      const { data: existingInvitations, error: existingError } = await supabase
        .from("game_invitations")
        .select()
        .eq("sender_user_id", senderUserId)
        .eq("receiver_user_id", receiverUserId)
        .eq("status", "Pending");

      if (existingError) {
        console.error("Error checking existing invitations:", existingError);
        return;
      }

      if (existingInvitations.length > 0) {
        // Handle the case where there's an existing pending invitation
        console.log(
          "There is already a pending invitation between you and this user."
        );
        return;
      }

      // Create a new game invitation with the chosen quizDesc
      const { data, error } = await supabase.from("game_invitations").upsert([
        {
          sender_user_id: senderUserId,
          receiver_user_id: receiverUserId,
          status: "Pending",
          quiz_desc: quizDesc, // Add quiz_desc to the invitation
        },
      ]);

      if (error) {
        console.error("Error creating game invitation:", error);
      } else {
        // Handle successful invitation creation
        console.log("Game invitation sent successfully.");
      }
    } catch (error) {
      console.error("Error creating game invitation:", error);
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (
    <div className="relative">
      <div className="relative">
        {user && (
          <div
            className={`right-sidebar ${
              showSidebar ? "show" : "hide"
            } sm:w-64 md:w-72 lg:w-96 xl:w-120 flex flex-col h-screen`}
          >
            <div className="flex-1 overflow-y-auto">
              <h2 className="mt-14 text-xl font-bold flex items-center justify-center">Powiadomienia</h2>
              <div className="flex items-center justify-center gap-4 mt-4">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.invitation_id}
                    className="p-4 bg-gray-100 rounded border border-gray-200"
                  >
                    <p>{invitation.sender_user_id} zaprasza Cię do gry</p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          acceptGameInvitation(invitation.invitation_id)
                        }
                        className="bg-green-500 text-gray-100 px-4 py-2 rounded mr-2 border-green-700 border font-bold"
                      >
                        Akceptuj
                      </button>
                      <button
                        onClick={() =>
                          rejectGameInvitation(invitation.invitation_id)
                        }
                        className="bg-red-500 text-gray-100 px-4 py-2 rounded border-red-700 border font-bold"
                      >
                        Odrzuć
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
