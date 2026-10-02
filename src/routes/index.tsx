import { createFileRoute } from "@tanstack/react-router";
import { DataHunterApp } from "@/components/game/DataHunterApp";

export const Route = createFileRoute("/")({ ssr: false, component: Home });

function Home() {
  return <DataHunterApp />;
}
