import { Button } from "@/components/ui/button";
import "./index.css";


export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center w-full p-2">
      <div className="flex flex-col">
        <div className="flex flex-col">
          {[
            "Graj sam!",
            "Wyzwij znajomego!",
            "Wybierz inny Quiz!",
            "Dodaj pytanie do tego Quizu!",
          ].map((text, index) => (
            <Button
              key={index}
              className="mr-4 ml-4 bg-gray-800 rounded-lg border-2 border-b-4 border-r-4 border-black p-16 text-4xl transition-all hover:-translate-y-[2px] md:block dark:border-white my-4"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                zIndex: 0,
              }}
            >
              <span
                className="z-10 relative font-bold font-sans text-gray-200"
                style={{
                  WebkitTextStroke: "1px black",
                }}
              >
                {text}
              </span>
              <span
                className="absolute top-0 left-0 w-full h-full z-0"
                style={{
                  backgroundImage: `url('/images/AI.png')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  WebkitFilter: "blur(2px)",
                }}
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
    
  );
}
