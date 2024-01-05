// import { quizCreationSchemaAI } from "@/lib/formSchemaAI";
// import { PrismaClient } from "@prisma/client";
// import axios from "axios";
// import { useSession } from "@supabase/auth-helpers-react";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// export async function POST(req: Request, res: Response) {
//   try {
//     const session = await useSession();
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: "You must be logged in to create a game." },
//         {
//           status: 401,
//         }
//       );
//     }

//     const body = await req.json();
//     const { topic, type, amount } = quizCreationSchemaAI.parse(body);
//     const game = await PrismaClient.game.create({
//       data: {
//         gameType: type,
//         timeStarted: new Date(),
//         userId: session.user.id,
//         topic,
//       },
//     });

//     await PrismaClient.topic_count.upsert({
//       where: {
//         topic,
//       },
//       create: {
//         topic,
//         count: 1,
//       },
//       update: {
//         count: {
//           increment: 1,
//         },
//       },
//     });

//     const { data } = await axios.post(
//       `${process.env.API_URL as string}/api/questions`,
//       {
//         amount,
//         topic,
//         type,
//       },
//     );

//     if (type === "mcq") {
//       type mcqQuestion = {
//         question: string;
//         answer: string;
//         option1: string;
//         option2: string;
//         option3: string;
//       };

//       const manyData = data.questions.map((question: mcqQuestion) => {
//         const options = [
//           question.option1,
//           question.option2,
//           question.option3,
//           question.answer,
//         ].sort(() => Math.random() - 0.5);
//         return {
//           question: question.question,
//           answer: question.answer,
//           options: JSON.stringify(options),
//           gameId: game.id,
//           questionType: "mcq",
//         };
//       });


//       await PrismaClient.question.createMany({
//         data: manyData,
//       });
//     }

//     return NextResponse.json({ gameId: game.id }, { status: 200 });
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       const { status, data } = error.response;
//       return NextResponse.json(
//         { error: `API Error: ${status} - ${data}` },
//         { status }
//       );
//     } else if (error instanceof z.ZodError) {
//       // Handle Zod validation errors
//       return NextResponse.json({ error: error.issues }, { status: 400 });
//     } else {
//       // Handle other unexpected errors
//       console.error(error); // Log the error for debugging purposes
//       return NextResponse.json(
//         { error: "An unexpected error occurred." },
//         { status: 500 }
//       );
//     }
//   }
// }
// export async function GET(req: Request, res: Response) {
//   try {
//     const session = await useSession();
//     if (!session?.user) {
//       return NextResponse.json(
//         { error: "You must be logged in to create a game." },
//         {
//           status: 401,
//         }
//       );
//     }

//     const url = new URL(req.url);
//     const gameId = url.searchParams.get("gameId");
//     if (!gameId) {
//       return NextResponse.json(
//         { error: "You must provide a game id." },
//         {
//           status: 400,
//         }
//       );
//     }

//     const supabaseApiKey = process.env.KURWA_TWO;

//     const game = await PrismaClient.game.findUnique({
//       where: {
//         id: gameId,
//       },
//       include: {
//         questions: true,
//       },
//       headers: {
//         Authorization: `Bearer ${supabaseApiKey}`,
//       },
//     });

//     if (!game) {
//       return NextResponse.json(
//         { error: "Game not found." },
//         {
//           status: 404,
//         }
//       );
//     }

//     return NextResponse.json(
//       { game },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "An unexpected error occurred." },
//       {
//         status: 500,
//       }
//     );
//   }
// }
