"use client";

// Importowanie potrzebnych modułów i komponentów
import React from "react";
import { Button } from "@/components/ui/button";
import { quizCreationSchemaAI } from "@/lib/formSchemaAI";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setStoredData } from "@/components/apiService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Definicja typu dla danych wejściowych formularza
type Input = z.infer<typeof quizCreationSchemaAI>;

// Komponent strony
export default function Home() {
  const router = useRouter();

  // Hook do obsługi mutacji (wysyłania żądania)
  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      // Wysłanie żądania POST do endpointu /api/questions
      const response = await axios.post("/api/questions", {
        amount,
        topic,
        type,
      });

      console.log("Response.data");
      console.log(response.data);

      // Ustawienie danych w localStorage (lub innym miejscu, w zależności od potrzeb)
      setStoredData(response.data);

      // Przejście do strony z wynikami quizu
      router.push("/AI_Questions");
    },
  });

  // Konfiguracja hooka do obsługi formularza
  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchemaAI),
    defaultValues: {
      amount: 2,
      topic: "",
      type: "mcq",
    },
  });

  // Obsługa zdarzenia onSubmit formularza
  function onSubmit(input: Input) {
    getQuestions({
      amount: input.amount,
      topic: input.topic,
      type: input.type,
    });
  }

  // Renderowanie komponentu
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="flex flex-col mt-12 m-6 h-max">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
            <CardDescription>Choose a topic</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a topic" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please provide any topic you would like to be quizzed on
                        here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isPending} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
