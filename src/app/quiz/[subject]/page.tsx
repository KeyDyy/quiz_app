// Importuj potrzebne moduły
"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getQuizzesData } from "@/lib/fetching";
import { useState } from "react";
import { useEffect } from "react";
import { useUserAuth } from "@/lib/userAuth";

// Importuj komponent FriendList
import FriendGameInvite from "@/components/FriendGameInvite"; // Upewnij się, że ścieżka jest prawidłowa

interface QuizData {
  logo: string;
  title: string;
}

export default function Home() {
  const router = useRouter();
  const pathName = usePathname();

  const [data, setData] = useState<QuizData[]>([]);
  const [showFriendList, setShowFriendList] = useState(false);

  const subject = pathName + "/sologame"; // Replace this with your actual dynamic value

  useUserAuth();

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
    if (path === "/wyzywaj") {
      // Jeśli kliknięto przycisk "Wyzwij znajomego"
      setShowFriendList(true);
    } else {
      // W przeciwnym razie, przekieruj na podaną ścieżkę
      router.push(path);
    }
  };

  const handleFriendListClose = () => {
    setShowFriendList(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex justify-center w-full p-2">
      <div className="flex flex-col">
        <div className="flex flex-col">
          {[
            { text: "Graj sam!", path: subject },
            { text: "Wyzwij znajomego!", path: "/wyzywaj" },
            { text: "Wybierz inny Quiz!", path: "/" },
            { text: "Dodaj pytanie do tego Quizu!", path: "/" },
          ].map((item, index) => (
            <Button
              onClick={() => handleButtonClick(item.path)}
              key={index}
              className="mr-4 ml-4 bg-white rounded-2xl border-2 border-b-4 border-r-4 border-black p-12 text-4xl transition-all hover:-translate-y-[2px] md:block dark-border-white my-4 hover:bg-white"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                zIndex: 0,
              }}
            >
              <span className="z-10 relative font-bold text-black">
                {item.text}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Display the friend list modal */}
      {showFriendList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-gray-100 p-12 rounded-2xl border border-gray-400 shadow-2xl items-center justify-center">
            <FriendGameInvite />
            <button
              onClick={handleFriendListClose}
              className="mt-4 p-2 px-4 bg-black text-white rounded-2xl font-bold text-lg "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
