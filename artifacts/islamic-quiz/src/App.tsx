import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Pages
import Home from "@/pages/Home";
import SoloSetup from "@/pages/SoloSetup";
import FriendMode from "@/pages/FriendMode";
import LocalSetup from "@/pages/LocalSetup";
import OnlineMode from "@/pages/OnlineMode";
import OnlineHost from "@/pages/OnlineHost";
import OnlineJoin from "@/pages/OnlineJoin";
import Matchmaking from "@/pages/Matchmaking";
import GameScreen from "@/pages/GameScreen";
import ResultsScreen from "@/pages/ResultsScreen";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/solo" component={SoloSetup} />
      <Route path="/friend" component={FriendMode} />
      <Route path="/local" component={LocalSetup} />
      <Route path="/online" component={OnlineMode} />
      <Route path="/online/host" component={OnlineHost} />
      <Route path="/online/join" component={OnlineJoin} />
      <Route path="/online/matchmaking" component={Matchmaking} />
      <Route path="/game" component={GameScreen} />
      <Route path="/results" component={ResultsScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(import.meta.env.BASE_URL + "bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().then(() => setStarted(true)).catch(() => {});
    };

    tryPlay();
    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true });

    return () => {
      audio.pause();
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (muted) {
      audioRef.current.volume = 0.35;
      if (!started) {
        audioRef.current.play().then(() => setStarted(true)).catch(() => {});
      }
    } else {
      audioRef.current.volume = 0;
    }
    setMuted(prev => !prev);
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "تشغيل الموسيقى" : "كتم الموسيقى"}
      className="fixed bottom-5 left-5 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
      style={{
        background: "rgba(212,168,71,0.18)",
        border: "1.5px solid rgba(212,168,71,0.45)",
        backdropFilter: "blur(8px)",
        color: muted ? "rgba(255,255,255,0.35)" : "rgba(212,168,71,0.9)",
      }}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div dir="rtl" className="font-body text-foreground">
            <Router />
            <BackgroundMusic />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
