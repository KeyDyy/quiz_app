"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getQuizzesData } from "@/lib/fetching";
import { useState } from "react";
import { useEffect } from "react";
import "./index.css";

interface QuizData {
  logo: string;
  title: string;
}

export default function Home() {
  const router = useRouter();
  const pathName = usePathname();
  const quizPathName = pathName.split("/").pop();

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

  const handleButtonClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-gray-100 dark-bg-gray-900 flex justify-center w-full p-2">
      <div className="flex flex-col">
        <div className="flex flex-col">
          {[
            { text: "Graj sam!", path: "/" },
            { text: "Wyzwij znajomego!", path: "/" },
            { text: "Wybierz inny Quiz!", path: "/" },
            { text: "Dodaj pytanie do tego Quizu!", path: "/" },
          ].map((item, index) => (
            <Button
              onClick={() => handleButtonClick(item.path)}
              key={index}
              className="mr-4 ml-4 bg-gray-800 rounded-lg border-2 border-b-4 border-r-4 border-black p-16 text-4xl transition-all hover:-translate-y-[2px] md:block dark-border-white my-4"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                zIndex: 0,
              }}
            >
              <span
                className="z-10 relative font-bold font-sans text-gray-100"
                style={{
                  WebkitTextStroke: "1px black",
                }}
              >
                {item.text}
              </span>
              <span
                className="absolute top-0 left-0 w-full h-full z-0"
                style={{
                  backgroundImage: `url('/images/${quizPathName}.png')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  WebkitFilter: "blur(2px)",
                }}
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
