import React from "react";
import { Button } from "./button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/card";
import { Input } from "@nextui-org/input";

type Props = {};

const AIQuizBuilder = (props: Props) => {
  return (
    <div className="flex flex-col mt-12 m-6">
      <Card className="border p-16 bg-gray-200 rounded-3xl shadow-lg">
        <CardHeader>
          <div>
            <p className="font-bold text-2xl text-center">Stwórz Quiz za pomocą AI</p>
            <p><br /></p>
          </div>
        </CardHeader>

        <CardBody>
          <div className="p-4 rounded-3xl text-white">
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
                  "shadow-xl",
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
            />
          </div>
        </CardBody>
        <CardFooter>
          <Button className="rounded-2xl">Stwórz Quiz</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIQuizBuilder;
