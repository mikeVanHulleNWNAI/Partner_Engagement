import UserInterface from './UserInterface';
import { BODY_COLOR } from "./Utils/Constants";
import { adjustColorHSL } from "./Utils/adjustColor";

function App() {

  document.body.style.background = `linear-gradient(180deg, ${adjustColorHSL(BODY_COLOR, +30)}, ${adjustColorHSL(BODY_COLOR, +60)}`;

  return (
    <div className="App">
      <UserInterface />
    </div>
  );
}

export default App;
