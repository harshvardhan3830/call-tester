import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CallTester from "./components/CallTester";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <CallTester />
    </div>
  );
}

export default App;
