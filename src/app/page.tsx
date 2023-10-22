'use client';
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Header from "@/components/Header";
export default function Home() {


  return (

    <div className="bg-gray-100 dark:bg-gray-900 flex justify-center">

      <main className="max-w-8xl mx-auto p-7 ">
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
              {subject === "Stwórz Quiz za pomocą AI" ? (
                <Link href={`/Quized_by_AI`}>
                  <img
                    src={`/images/AI.png`}
                    alt={subject}
                    className="w-120 mx-auto rounded-lg"
                  />
                </Link>
              ) : (
                <Link href={`/that_quiz`}>
                  <img
                    src={`/images/${subject}.png`}
                    alt={subject}
                    className="w-120 mx-auto rounded-lg"
                  />
                </Link>
              )}
              <p className="text-center">{subject}</p>
            </div>
          ))}
        </section>

      </main>





    </div>
  );


}

Home.requireAuth = true
