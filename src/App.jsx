import { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import BackgroundImg from "./components/BackgroundImg";
import Exchange from "./components/Exchange";
import Travel from "./components/Travel";

import "./App.css";

function App() {
  const [change, setChange] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("JPY(100)");
 

  return (
    <div className="app-container">
      <BackgroundImg />
      <TransitionGroup>
        {change ? (
          <Exchange changeState={{ change, setChange, selectedCurrency, setSelectedCurrency }} />
        ) : (
          <Travel changeState={change} getSelect={selectedCurrency} />
        )}
      </TransitionGroup>
    </div>
  );
}

export default App;
