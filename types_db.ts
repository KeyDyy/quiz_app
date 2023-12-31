export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answers: {
        Row: {
          answer_id: number
          answer_text: string | null
          is_correct: boolean
          question_id: number
        }
        Insert: {
          answer_id?: number
          answer_text?: string | null
          is_correct?: boolean
          question_id: number
        }
        Update: {
          answer_id?: number
          answer_text?: string | null
          is_correct?: boolean
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          }
        ]
      }
      friends: {
        Row: {
          created_at: string
          id: number
          status: Database["public"]["Enums"]["friend_invite_status"]
          user1: string
          user2: string
        }
        Insert: {
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["friend_invite_status"]
          user1: string
          user2: string
        }
        Update: {
          created_at?: string
          id?: number
          status?: Database["public"]["Enums"]["friend_invite_status"]
          user1?: string
          user2?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_user1_fkey"
            columns: ["user1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user2_fkey"
            columns: ["user2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      game_answers: {
        Row: {
          answer_id: number
          game_id: number | null
          is_correct: boolean | null
          question_id: number | null
          selected_answer_id: number | null
          user_id: string | null
        }
        Insert: {
          answer_id?: number
          game_id?: number | null
          is_correct?: boolean | null
          question_id?: number | null
          selected_answer_id?: number | null
          user_id?: string | null
        }
        Update: {
          answer_id?: number
          game_id?: number | null
          is_correct?: boolean | null
          question_id?: number | null
          selected_answer_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_answers_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "multiplayer_games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "game_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "game_answers_selected_answer_id_fkey"
            columns: ["selected_answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["answer_id"]
          },
          {
            foreignKeyName: "game_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      game_invitations: {
        Row: {
          game_id: number | null
          invitation_id: number
          receiver_user_id: string
          sender_user_id: string
          status: Database["public"]["Enums"]["game_invite_status"] | null
        }
        Insert: {
          game_id?: number | null
          invitation_id?: number
          receiver_user_id: string
          sender_user_id: string
          status?: Database["public"]["Enums"]["game_invite_status"] | null
        }
        Update: {
          game_id?: number | null
          invitation_id?: number
          receiver_user_id?: string
          sender_user_id?: string
          status?: Database["public"]["Enums"]["game_invite_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "game_invitations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "multiplayer_games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "game_invitations_receiver_user_id_fkey"
            columns: ["receiver_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invitations_sender_user_id_fkey"
            columns: ["sender_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      multiplayer_games: {
        Row: {
          end_time: string | null
          game_id: number
          quiz_id: number | null
          start_time: string | null
          winner_user_id: string | null
        }
        Insert: {
          end_time?: string | null
          game_id?: number
          quiz_id?: number | null
          start_time?: string | null
          winner_user_id?: string | null
        }
        Update: {
          end_time?: string | null
          game_id?: number
          quiz_id?: number | null
          start_time?: string | null
          winner_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_games_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          }
        ]
      }
      questions: {
        Row: {
          content: string | null
          question_id: number
          question_text: string | null
          quiz_id: number | null
        }
        Insert: {
          content?: string | null
          question_id?: number
          question_text?: string | null
          quiz_id?: number | null
        }
        Update: {
          content?: string | null
          question_id?: number
          question_text?: string | null
          quiz_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          }
        ]
      }
      quizzes: {
        Row: {
          creation_date: string | null
          creator_user_id: string | null
          description: string | null
          logo: string | null
          quiz_id: number
          title: string
        }
        Insert: {
          creation_date?: string | null
          creator_user_id?: string | null
          description?: string | null
          logo?: string | null
          quiz_id?: number
          title: string
        }
        Update: {
          creation_date?: string | null
          creator_user_id?: string | null
          description?: string | null
          logo?: string | null
          quiz_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      statistics: {
        Row: {
          stat_id: number
          total_correct_answers: number | null
          total_quizzes_taken: number | null
          user_id: string | null
        }
        Insert: {
          stat_id?: number
          total_correct_answers?: number | null
          total_quizzes_taken?: number | null
          user_id?: string | null
        }
        Update: {
          stat_id?: number
          total_correct_answers?: number | null
          total_quizzes_taken?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "statistics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      friend_invite_status: "Pending" | "Accepted" | "Declined"
      game_invite_status: "Pending" | "Accepted" | "Declined"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
