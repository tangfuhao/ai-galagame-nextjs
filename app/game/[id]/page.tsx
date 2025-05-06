"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { GameInterface } from "@/components/game/game-interface";
import { AudioManagerProvider } from "@/lib/audio-manager-provider";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  return (
    <AudioManagerProvider>
      <div className="flex h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6  flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>


          </div>

          <div className="flex-1 w-full flex items-center justify-center bg-black">
            <GameInterface gameId={gameId} />
          </div>
        </main>
      </div>
    </AudioManagerProvider>
  );
}
