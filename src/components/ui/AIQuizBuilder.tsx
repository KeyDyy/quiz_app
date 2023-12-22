"use client";

import React from "react";
import { Button } from "./button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useUserAuth } from "@/lib/userAuth";
import { quizCreationSchemaAI } from "@/lib/formSchemaAI";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {};
type Input = z.infer<typeof quizCreationSchemaAI>;

const AIQuizBuilder = (props: Props) => {
  useUserAuth();

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchemaAI),
    defaultValues: {
      amount: 6,
      topic: "",
      type: "mcq",
    },
  });

  function onSubmit(input: Input) {
    alert(JSON.stringify(input, null, 2));
  }

  return (
    <div className="flex flex-col mt-12 m-6 h-max">
      <Card className="border p-16 bg-gray-200 rounded-3xl shadow-lg">
        <CardHeader>
          <div>
            <p className="font-bold text-2xl text-center pb-4">
              Stwórz Quiz za pomocą AI
            </p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="p-4 rounded-3xl text-white"></div>
        </CardBody>
        <CardFooter className="justify-center pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Wpisz temat"
                        radius="lg"
                        classNames={{
                          label: "text-black dark:text-white/90",
                          input: [
                            "bg-transparent",
                            "text-black/90 dark:text-white/90",
                            "placeholder:text-gray border dark:placeholder:text-white/60",
                          ],
                          innerWrapper: "bg-transparent",
                          inputWrapper: [
                            "shadow-md",
                            "rounded-2xl",
                            "dark:bg-default/60",
                            "backdrop-blur-xl",
                            "bg-gray-100",
                            "hover:bg-default-200/70",
                            "dark:hover:bg-default/70",
                            "group-data-[focused=true]:bg-default-200/50",
                            "dark:group-data-[focused=true]:bg-default/60",
                            "!cursor-text",
                          ],
                        }}
                        placeholder="Twój temat"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Proszę wpisać temat
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIQuizBuilder;
