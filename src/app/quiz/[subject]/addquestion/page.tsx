'use client'
import { useState } from 'react';
import { usePathname } from "next/navigation";
import { supabase } from '../../../../lib/supabase';
import router from 'next/router';

const AddQuestionPage = () => {


    const pathName = usePathname();
    const match = pathName.match(/\/quiz\/([^/]+)\/addquestion/);
    const subject = match ? match[1] : null;

    const [questionText, setQuestionText] = useState('');
    const [content, setContent] = useState('');
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctOptionIndex, setCorrectOptionIndex] = useState(-1);

    const handleSubmit = async (e) => {
        e.preventDefault();


        const quizId = 5;

        try {

            const optionsJSON = JSON.stringify(options.filter(option => option.trim() !== ''));

            // Add the question to the Supabase table
            const { data, error } = await supabase.from('Questions').insert([
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
            console.error('Error adding question:', error);
            // Handle error, show a message, etc.
        }
    };

    return (
        <div className="relative flex bg-gray-100 dark:bg-gray-900">
            <div className="flex-1">
                <div className="flex-1 overflow-y-auto">
                    <div className="mt-5 font-bold text-xl">
                        <p className="pb-2"> Add Question </p>
                        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg">
                            <label className="block mb-2">
                                Question Text:
                                <input
                                    type="text"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    className="border border-gray-400 p-2 w-full rounded-md"
                                />
                            </label>
                            <label className="block mb-2">
                                Content:
                                <input
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="border border-gray-400 p-2 w-full rounded-md"
                                />
                            </label>
                            <label className="block mb-2">
                                Options:
                                {options.map((option, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                                const updatedOptions = [...options];
                                                updatedOptions[index] = e.target.value;
                                                setOptions(updatedOptions);
                                            }}
                                            className="border border-gray-400 p-2 w-full rounded-md"
                                        />
                                    </div>
                                ))}
                            </label>
                            <label className="block mb-2">
                                Correct Option:
                                <select
                                    value={correctOptionIndex}
                                    onChange={(e) => setCorrectOptionIndex(parseInt(e.target.value, 10))}
                                    className="border border-gray-400 p-2 w-full rounded-md"
                                >
                                    <option value={-1}>Select correct option</option>
                                    {options.map((_, index) => (
                                        <option key={index} value={index}>
                                            Option {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit" className="bg-black text-white p-2 rounded-md">
                                Add Question
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionPage;