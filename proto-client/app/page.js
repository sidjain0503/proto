import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Input placeholder="Enter prompt here"></Input>
      <Button size={"xl"} variant={"outline"}>
        Siddharth
      </Button>
    </div>
  );
}
