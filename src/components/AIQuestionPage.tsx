import React, { useEffect, useState } from "react";
import { getStoredData } from "@/components/apiService";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "./Button";

const AIQuestionsPage = () => {
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedData = getStoredData();
    if (storedData && storedData.questions) {
      setQuestionsData(storedData.questions);
    }
  }, []);

  const shuffleOptions = (options: string[]) => {
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [
        shuffledOptions[j],
        shuffledOptions[i],
      ];
    }
    return shuffledOptions;
  };

  const checkAnswer = (userAnswer: string, correctAnswer: string) => {
    if (userAnswer === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setIncorrectAnswers((prev) => prev + 1);
    }
  };

  const handlePlayAgain = () => {
    router.push("/Quized_by_AI");
  };

  const handleOptionClick = (userAnswer: string, correctAnswer: string) => {
    setUserAnswers([...userAnswers, userAnswer]);
    checkAnswer(userAnswer, correctAnswer);

    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const renderQuestion = () => {
    const question = questionsData[currentQuestionIndex];

    if (!question) {
      return <p>Question not available</p>;
    }

    const shuffledOptions = shuffleOptions([
      question.option1,
      question.option2,
      question.option3,
      question.answer,
    ]);

    return (
      <div className="flex justify-center">
        <div className="flex flex-col mt-12 m-6 h-max">
          <Card className="flex flex-col mt-12 m-6 h-max lg:p-8 p-4 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-6 flex justify-center" >
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {shuffledOptions.map((option, index) => (
                <div key={index}>
                  <Button
                    className="bg-white m-2 rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white"
                    onClick={() => handleOptionClick(option, question.answer)}
                  >
                    {option}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="flex justify-center mt-6" >
        <Card className="gb -flex flex-col mt-12 m-6 h-max lg:p-8 p-4 rounded-2xl">
          <CardHeader>
            <CardTitle>Quiz ukończony</CardTitle>
          </CardHeader>
          <CardContent >
            <CardDescription className="text-black">
              Poprawne odpowiedzi: {correctAnswers}
            </CardDescription >
            <CardDescription className="text-black">
              Niepoprawne odpowiedzi: {incorrectAnswers}
            </CardDescription>
          </CardContent>

          <Button className = "bg-black text-white"
          onClick={handlePlayAgain}>Zagraj jeszcze raz!</Button>
        </Card>
      </div>
    );
  };

  return <div>{quizCompleted ? renderResults() : renderQuestion()}</div>;
};

export default AIQuestionsPage;
