import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AnalyzeNews from "./pages/AnalyzeNews";
import ScenarioEngine from "./pages/ScenarioEngine";
import DecisionEngine from "./pages/DecisionEngine";
import Simulation from "./pages/Simulation";
import Portfolio from "./pages/Portfolio";
import History from "./pages/History";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  // Authentication check is handled inside Layout
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/analyze-news">
        {() => <ProtectedRoute component={AnalyzeNews} />}
      </Route>
      <Route path="/scenario">
        {() => <ProtectedRoute component={ScenarioEngine} />}
      </Route>
      <Route path="/decision">
        {() => <ProtectedRoute component={DecisionEngine} />}
      </Route>
      <Route path="/simulate">
        {() => <ProtectedRoute component={Simulation} />}
      </Route>
      <Route path="/portfolio">
        {() => <ProtectedRoute component={Portfolio} />}
      </Route>
      <Route path="/history">
        {() => <ProtectedRoute component={History} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
