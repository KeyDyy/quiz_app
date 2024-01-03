"use client"
import { useState, useEffect } from "react";
import { NextPage } from "next";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/../hooks/useUser";
import Button from "@/components/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import moment from 'moment';


interface CountdownTimerProps {
    startTime: string; // Timestamp in string format, e.g., "2024-01-03T14:23:21.823"
}

interface Answer {
    game_id: string;
    user_id: string;
    question_id: number;
    // ... other properties if applicable
}

// interface questionsJson {
//     question_id: number;
//     quiz_id: number;
//     question_text: string | null;
//     content: string | null;
//     correct_answer: string;
//     options: any[] | null; // Adjust the type as per your requirements
// }

const MultiplayerGame: NextPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [senderUsername, setSenderUsername] = useState("");
    const [senderAvatarUrl, setSenderAvatarUrl] = useState("");
    const [receiverUsername, setReceiverUsername] = useState("");
    const [receiverAvatarUrl, setReceiverAvatarUrl] = useState("");
    const [invitationStatus, setInvitationStatus] = useState("");



    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
        null
    );
    const [answered, setAnswered] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);


    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);

    const [receiverConnected, setReceiverConnected] = useState<boolean>(false);

    const [startTime, setStartTime] = useState<number | null>(null);

    const pathName = usePathname();

    const match = pathName.match(/\/multi\/([^/]+)/);
    const gameId = match ? match[1] : null;




    // useEffect(() => {
    //     if (!user) {
    //         // Open the authentication modal
    //         router.push("/");
    //         return;
    //     }
    // }
    // )

    useEffect(() => {
        const fetchGameData = async () => {

            // Fetch multiplayer game data
            const { data: multiplayerGameData, error: multiplayerGameError } =
                await supabase
                    .from("MultiplayerGame")
                    .select("game_id, quiz_id, invitation_id, start_time, winner_user_id")
                    .eq("game_id", gameId)
                    .single();

            if (multiplayerGameError) {
                console.error("Error fetching multiplayer game data:", multiplayerGameError);
                return;
            }



            // Fetch receiver's user information
            const invitationId = multiplayerGameData?.invitation_id;
            const { data: invitationData, error: invitationError } = await supabase
                .from("GameInvitations")
                .select("status, receiver_user_id, sender_user_id") // Add user_id to the selection
                .eq("invitation_id", invitationId)
                .single();

            if (invitationError) {
                console.error("Error fetching invitation data:", invitationError);
                return;
            }

            const senderUserId = invitationData?.sender_user_id; // adjust based on your Supabase schema
            const { data: senderUserData, error: senderUserError } = await supabase
                .from("users")
                .select("username, avatar_url")
                .eq("id", senderUserId)
                .single();

            if (senderUserError) {
                console.error("Error fetching sender user data:", senderUserError);
                return;
            }

            setSenderUsername(senderUserData?.username || "");
            setSenderAvatarUrl(senderUserData?.avatar_url || "");

            console.log(senderUsername)

            setInvitationStatus(invitationData?.status || "");

            if (invitationData?.status === "Accepted") {
                const receiverUserId = invitationData?.receiver_user_id || "";
                const { data: receiverUserData, error: receiverUserError } = await supabase
                    .from("users")
                    .select("username, avatar_url")
                    .eq("id", receiverUserId)
                    .single();

                const { data: multiplayerGameData, error: multiplayerGameError } =
                    await supabase
                        .from("MultiplayerGame")
                        .select("game_id, quiz_id, invitation_id, start_time, winner_user_id")
                        .eq("game_id", gameId)
                        .single();

                if (multiplayerGameError) {
                    console.error("Error fetching multiplayer game data:", multiplayerGameError);
                    return;
                }
                console.log(multiplayerGameData.start_time)

                // Receiver user has connected to the game
                setReceiverConnected(true);


                if (receiverUserError) {
                    console.error("Error fetching receiver user data:", receiverUserError);
                    return;
                }

                setReceiverUsername(receiverUserData?.username || "");
                setReceiverAvatarUrl(receiverUserData?.avatar_url || "");


                setStartTime(multiplayerGameData?.start_time || null);
            }

        };

        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'GameInvitations',
                },
                (payload) => {
                    fetchGameData();
                }
            )
            .subscribe()

        fetchGameData();

    }, [gameId]);



    const [questions, setQuestions] = useState<{
        question_id: number;
        question_text: string;
        content: string;
        correct_answer: string;
        options: any;
    }[]>([]);


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Fetch the quiz based on the subject
                const { data: multiplayerGameData, error: multiplayerGameError } =
                    await supabase
                        .from("MultiplayerGame")
                        .select("game_id, quiz_id, invitation_id, winner_user_id, questions")
                        .eq("game_id", gameId)
                        .single();

                if (multiplayerGameError) {
                    console.error("Error fetching multiplayer game data:", multiplayerGameError);
                    return;
                }

                if (multiplayerGameData) {
                    if (multiplayerGameData.questions) {
                        // If there is data in the questions column, use it directly
                        setQuestions(multiplayerGameData.questions);
                    } else {
                        // Fetch questions associated with the quiz_id
                        const { data: questionsData, error: questionsError } = await supabase
                            .from("random_questions")
                            .select("*")
                            .eq("quiz_id", multiplayerGameData.quiz_id)
                            .limit(5);

                        if (questionsError) {
                            throw questionsError;
                        }


                        if (questionsData) {
                            // Store the questions in a JSON structure
                            const questionsJson = questionsData.map((question) => ({
                                question_id: question.question_id,
                                question_text: question.question_text,
                                content: question.content,
                                correct_answer: question.correct_answer,
                                options: Array.isArray(question.options)
                                    ? question.options
                                    : JSON.parse(question.options || "[]"), // Default to an empty array if options is null
                            }));

                            // Insert the questions into the MultiplayerGame table only if questions column is null
                            await supabase
                                .from("MultiplayerGame")
                                .update({
                                    questions: questionsJson,
                                })
                                .eq("game_id", gameId);

                            setQuestions(questionsJson);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching and storing questions:", error);
            } finally {
                // Set loading to false when questions are fetched and stored
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [gameId]);

    const currentQuestion = questions[currentQuestionIndex];

    const [timeRemaining, setTimeRemaining] = useState<string>('');

    useEffect(() => {
        const targetTime = moment(startTime).add(3615, 'seconds');
        const intervalId = setInterval(() => {
            const now = moment();
            const duration = moment.duration(targetTime.diff(now));
            const formattedTime = `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;

            if (now.isBefore(targetTime)) {
                setTimeRemaining(formattedTime);
            } else {
                // Countdown reached, you may want to perform some action here
                setTimeRemaining('Countdown expired');
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    const [timer, setTimer] = useState<number>(30); // 10 seconds initially

    useEffect(() => {
        let timerInterval: NodeJS.Timeout;

        // Define a function to decrement the timer
        const decrementTimer = () => {
            setTimer((prevTimer) => prevTimer - 1);
        };

        // Start the timer when a new question is loaded and the first timer has expired
        if (currentQuestion && timeRemaining === 'Countdown expired') {
            setTimer(10); // Reset timer for each new question
            timerInterval = setInterval(decrementTimer, 1000); // Update timer every second
        }

        // Clean up the timer interval when component unmounts or question changes
        return () => {
            clearInterval(timerInterval);
        };
    }, [currentQuestion, timeRemaining]);

    // Check if time is up and move to the next question
    useEffect(() => {
        if (timer === 0) {
            handleSelectAnswer(""); // Consider the question as incorrectly answered
        }
    }, [timer]);


    const handleSelectAnswer = async (selectedAnswer: string) => {
        if (!answered) {
            const isCorrectAnswer = selectedAnswer === currentQuestion.correct_answer;

            // Update the state to reflect the answer
            setAnswered(true);

            // Insert the answer into the database
            await supabase
                .from("GameAnswers")
                .upsert([
                    {
                        game_id: gameId,
                        user_id: user?.id,
                        question_id: currentQuestion.question_id,
                        is_correct: [isCorrectAnswer],
                    },
                ]);

            const channel = supabase
                .channel('table-db-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'GameAnswers',
                    },
                    (payload) => {
                        hasBothPlayersAnswered().then((bothAnswered) => {
                            if (bothAnswered) {
                                handleNextQuestion();
                            }
                        });
                    }
                )
                .subscribe();


            // Check if both players have answered
            const bothAnswered = await hasBothPlayersAnswered();

            // If both players have answered, move to the next question
            if (bothAnswered) {
                handleNextQuestion();
            }
        }
    };

    const handleNextQuestion = async () => {
        const nextQuestionIndex = currentQuestionIndex + 1;

        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedAnswerIndex(null);
            setAnswered(false);
            setIsLastQuestion(nextQuestionIndex === questions.length - 1);
        } else {
            // Handle the end of the quiz, save the final scores, etc.
            setQuizCompleted(true);
        }
    };

    const hasBothPlayersAnswered = async () => {
        // Perform a real-time query on the database to check if both players have answered the current question
        const { data, error } = await supabase
            .from("GameAnswers")
            .select("user_id")
            .eq("game_id", gameId)
            .eq("question_id", currentQuestion.question_id);

        if (error) {
            console.error("Error checking if both players have answered:", error);
            return false;
        }

        // Check if both players have answered by comparing the number of distinct user IDs
        return data && new Set(data.map((answer) => answer.user_id)).size === 2;
    };


    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

    useEffect(() => {
        // Shuffle options when a new question is loaded
        if (currentQuestion) {
            const optionsCopy = currentQuestion.options
                ? [...currentQuestion.options]
                : [];
            const newShuffledOptions = optionsCopy.sort(() => Math.random() - 0.5);
            setShuffledOptions(newShuffledOptions);
        }
    }, [currentQuestion]);

    const handlePlayAgain = () => {
        // Refresh the page or perform any other logic
        router.push("/");
    };

    const renderQuestion = () => {

        if (!receiverConnected || startTime === null) {
            // Display loading screen while waiting for the receiver user to connect
            return (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-xl">Waiting for the receiver to connect...</p>
                </div>
            );
        }

        // Display countdown timer before starting the quiz
        if (timeRemaining != "Countdown expired") {
            return (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-xl">Get ready! Quiz will start in {timeRemaining} seconds...</p>
                </div>
            );
        } else {

            return (
                <div className="flex justify-center pb-12">
                    <div className="flex flex-col mt-16 m-6 h-max bg-gray-200 p-12 border-2 border-gray-600 rounded-2xl shadow-2xl">
                        <div className="center-content font-sans text-center">
                            {currentQuestion ? (
                                <>
                                    {/* Display user avatars and usernames here */}
                                    <div className="flex justify-between mb-4">
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={senderAvatarUrl}
                                                alt="Sender Avatar"
                                                className="w-12 h-12 rounded-full mb-2"
                                            />
                                            <div className="text-sm font-semibold">{senderUsername}</div>
                                        </div>
                                        {invitationStatus === "Accepted" && (
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={receiverAvatarUrl}
                                                    alt="Receiver Avatar"
                                                    className="w-12 h-12 rounded-full mb-2"
                                                />
                                                <div className="text-sm font-semibold">{receiverUsername}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-2xl font-bold mb-6 flex justify-center">
                                        {currentQuestion.question_text}
                                    </div>
                                    {currentQuestion.content && (
                                        <div className="question-image">
                                            {/* Display question content (image or video) here */}
                                            {currentQuestion.content.endsWith(".jpg") ||
                                                currentQuestion.content.endsWith(".png") ? (
                                                <img
                                                    src={currentQuestion.content}
                                                    alt="Question"
                                                    className="max-w-full h-auto"
                                                />
                                            ) : (
                                                <iframe
                                                    width="560"
                                                    height="315"
                                                    src={currentQuestion.content}
                                                    title="Question Video"
                                                    allowFullScreen
                                                    className="max-w-full"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Display answer options */}
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                        {shuffledOptions.map((option: any, index: number) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSelectAnswer(option)}
                                                className={`bg-white m-2 rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white 
                            ${selectedAnswerIndex === index ? "selected incorrect" : ""}
                          `}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <strong>{String.fromCharCode(65 + index)}</strong> - {option}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Display timer */}
                                    <div className="text-lg font-bold mb-2 text-center mt-4">
                                        Pozostały czas: {timer}
                                    </div>

                                    {/* Display progress bar */}
                                    <div className="relative pt-1">
                                        <div className="flex h-3 mb-4 m-1 m overflow-hidden border-2 border-gray-800 rounded-xl">
                                            <div
                                                className="w-full bg-black "
                                                style={{ width: `${(timer / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderResults = () => {
        return (
            <div className="flex justify-center mt-6">
                <Card className="flex flex-col mt-12 m-6 h-max lg:p-8 p-4 rounded-2xl border shadow-2xl border-gray-400">
                    <CardHeader>
                        <CardTitle>Quiz ukończony</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-black">
                            Poprawne odpowiedzi: {correctAnswers}
                        </CardDescription>
                        <CardDescription className="text-black">
                            Niepoprawne odpowiedzi: {incorrectAnswers}
                        </CardDescription>
                    </CardContent>

                    <Button className="bg-black text-white" onClick={handlePlayAgain}>
                        Zagraj jeszcze raz!
                    </Button>
                </Card>
            </div>
        );
    };

    return (
        <div>
            {loading ? "Loading..." : quizCompleted ? renderResults() : renderQuestion()}
        </div>
    );
};


export default MultiplayerGame;