import { FlipWords } from "../ui/flip-words";
import { Button } from "./button";

export function FlipWordsPage() {
  const words = ["Collaborate", "Create", "Connect"];
  return (
    <div className="h-[40rem] flex justify-center items-center px-4 lg:text-xl">
      <div className="text-4xl mx-auto font-normal">
        <FlipWords words={words}/>
        on Creatorverse
      </div>
    </div>
  );
}