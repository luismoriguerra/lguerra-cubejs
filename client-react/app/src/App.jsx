import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import './App.css'
import "antd/dist/antd.css";
import ChartRenderer from "./components/chart-example.jsx";
import PieExample from "./components/pie-example.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="">
      <p>react client 3</p>
      <div>
        <ChartRenderer key={'table-example'} />
        <div style={{height: '500px'}}>
          <PieExample key={'pie-example'} />
        </div>
      </div>
    </div>
  );
}

export default App;