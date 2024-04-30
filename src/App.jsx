import { useState } from "react";
import { TransitionGroup } from "react-transition-group";
import BackgroundImg from "./components/BackgroundImg";
import Exchange from "./components/Exchange";
import Travel from "./components/Travel";

import "./App.css";

function App() {
  const [change, setChange] = useState(true);
  
  return (
    <div className="app-container">
      <BackgroundImg />
       <TransitionGroup>
          {change ? <Exchange  changeState={{change,setChange}}/> : <Travel changeState={change}/>}
       </TransitionGroup>
    </div>
  );
}

export default App;
