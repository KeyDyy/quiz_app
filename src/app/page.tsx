"use client";
import useAuthModal from "../../hooks/useAuthModal";
import { useUser } from "../../hooks/useUser";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { getQuizzesData } from "@/lib/fetching";

interface QuizData {
  logo: string;
  title: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [data, setData] = useState<QuizData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizData = await getQuizzesData();
        setData(quizData);
      } catch (error) {
        console.error("Błąd pobierania danych", error);
      }
    };
    fetchData();
  }, []);

  const handleImageClick = (subject: string) => {
    if (!user) {
      authModal.onOpen();
    } else if (subject === "AI") {
      router.push("/Quized_by_AI");
    } else {
      router.push(`/quiz/${subject.toLowerCase()}`);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex justify-center">
      <main className="max-w-8xl mx-auto p-7">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data
            .sort((a, b) =>
              a.description === "AI" ? -1 : b.description === "AI" ? 1 : 0
            )
            .map((quiz: QuizData) => (
              <div
                key={quiz.title}
                className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md"
              >
                <a onClick={() => handleImageClick(quiz.description)}>
                  <img
                    src={quiz.logo}
                    alt={quiz.title}
                    className="w-120 mx-auto rounded-lg"
                  />
                </a>
                <p className="text-center">{quiz.title}</p>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}
