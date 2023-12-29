"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import router from "next/router";
import Button from "@/components/Button";

const AddQuestionPage = () => {
  const pathName = usePathname();
  const match = pathName.match(/\/quiz\/([^/]+)\/addquestion/);
  const subject = match ? match[1] : null;

  const [questionText, setQuestionText] = useState("");
  const [content, setContent] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(-1);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const quizId = 5;

    try {
      const optionsJSON = JSON.stringify(
        options.filter((option) => option.trim() !== "")
      );

      // Add the question to the Supabase table
      const { data, error } = await supabase.from("Questions").insert([
        {
          quiz_id: quizId,
          question_text: questionText,
          content: content,
          correct_answer: options[correctOptionIndex],
          options: optionsJSON,
          approved: true,
        },
      ]);

      if (error) {
        throw error;
      }

      // Redirect to a success page or do any other necessary actions
      router.push(`/quiz/${subject}`);
    } catch (error) {
      console.error("Error adding question:", error);
      // Handle error, show a message, etc.
    }
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900  px-8 sm:px-12  md:px-36 lg:px-80 2xl:px-96 py-2 sm:py-8 md:py-4 pb-12">
      <div className="flex-1 ">
        <div className="">
          <div className="mt-5 font-bold text-xl ">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-200 rounded-2xl px-12 pt-8 pb-8 border border-gray-600  shadow-md sm:shadow-2xl"
            >
              <label className="block mb-2 ">
                <p className="mb-1"> Treść pytania: </p>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="border border-gray-400 p-2 w-full rounded-md font-normal bg-gray-100"
                  style={{
                    outline: "none",
                    boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </label>
              <label className="block mb-2">
                <p className="mb-1"> Obrazek (opcjonalnie): </p>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border border-gray-400 p-2 w-full rounded-md font-normal bg-gray-100"
                  style={{
                    outline: "none",
                    boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </label>
              <label className="block mb-2">
                <p className="mb-1"> Opcje: </p>

                {options.map((option, index) => (
                  <div key={index} className="mb-2 font-normal">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...options];
                        updatedOptions[index] = e.target.value;
                        setOptions(updatedOptions);
                      }}
                      className="border border-gray-400 p-2 w-full rounded-md bg-gray-100"
                      style={{
                        outline: "none",
                        boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
                      }}
                    />
                  </div>
                ))}
              </label>
              <label className="block mb-2 my-2">
                <p className="mb-1"> Poprawna odpowiedź </p>

                <select
                  value={correctOptionIndex}
                  onChange={(e) =>
                    setCorrectOptionIndex(parseInt(e.target.value, 10))
                  }
                  className="border border-gray-400 p-2 w-full rounded-md font-normal bg-gray-100"
                  style={{
                    outline: "none",
                    boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <option value={-1} className="">
                    Wybierz poprawną odpowiedź
                  </option>
                  {options.map((_, index) => (
                    <option key={index} value={index} className="font-bold">
                      Opcja {index + 1}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                type="submit"
                className="bg-black text-gray-100 p-2 px-8 rounded-xl mt-4 w-auto"
              >
                Dodaj pytanie
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPage;
