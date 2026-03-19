import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div dir="rtl" className="font-body text-foreground">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
