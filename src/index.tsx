import { render } from "preact";
import { useEffect } from "preact/hooks";
import { LocationProvider, Router, Route } from "preact-iso";
import { Header } from "./components/Header.tsx";
import { Home } from "./pages/Home/index.tsx";
import { NotFound } from "./pages/_404.tsx";
import "./styles.css";

export function App() {
  // Connect to deno websocket server
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/websocket");

    ws.onopen = (evt) => {
      console.log("Connection opened", evt);
    };

    ws.onerror = (e) => {
      console.log("Connection error", e);
    };
  }, []);

  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

// @ts-ignore: null
render(<App />, document.getElementById("app"));
