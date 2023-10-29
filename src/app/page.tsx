"use client";
import useAuthModal from "../../hooks/useAuthModal";
import { useUser } from "../../hooks/useUser";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const handleImageClick = (subject: string) => {
    if (!user) {
      authModal.onOpen();
    } else {
      router.push(
        subject === "Stwórz Quiz za pomocą AI" ? "/Quized_by_AI" : "/that_quiz"
      );
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex justify-center">
      <main className="max-w-8xl mx-auto p-7">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "Stwórz Quiz za pomocą AI",
            "GEOGRAFIA",
            "FIZYKA",
            "CHEMIA",
            "BIOLOGIA",
            "KOSMOS",
            "SAMOCHODY",
            "KSIĄŻKI",
          ].map((subject) => (
            <div
              key={subject}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md"
            >
              <a onClick={() => handleImageClick(subject)}>
                <img
                  src={
                    subject === "Stwórz Quiz za pomocą AI"
                      ? `/images/AI.png`
                      : `/images/${subject}.png`
                  }
                  alt={subject}
                  className="w-120 mx-auto rounded-lg"
                />
              </a>
              <p className="text-center">{subject}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
