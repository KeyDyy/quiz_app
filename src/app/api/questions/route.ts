import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { strict_output } from "@/lib/openAi";
import { quizCreationSchemaAI } from "@/lib/formSchemaAI";

export const runtime = "nodejs";
export const maxDuration = 10;
//export const maxDuration = 50000;

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { amount, topic, type } = quizCreationSchemaAI.parse(body);
    let questions: any;
    if (type === "mcq") {
      questions = await strict_output(
        "Jesteś pomocną sztuczną inteligencją, która jest w stanie generować pytania i odpowiedzi mcq, długość każdej odpowiedzi nie powinna przekraczać 15 słów, przechowywać wszystkie odpowiedzi, pytania i opcje w tablicy JSON",
        new Array(amount).fill(
          `Masz wygenerować losowe trudne pytanie wielokrotnego wyboru (MCQ) na temat ${topic}`
        ),
        {
          question: "Pytanie",
          answer: "odpowiedź na max 15 wyrazów",
          option1: "opcja1 na max 15 wyrazów",
          option2: "opcja2 na max 15 wyrazów",
          option3: "opcja3 na max 15 wyrazów",
        }
      );
    }

    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("elle gpt error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
