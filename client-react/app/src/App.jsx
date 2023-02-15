import "antd/dist/antd.css";
import ChartRenderer from "./components/chart-example.jsx";
import PieExample from "./components/pie-example.jsx";
import BotsYears from "./components/bots_years.jsx";
import Repos from "./components/repos.jsx";

function App() {
  return (
    <div>
      <div>
        <div style={{ height: "500px" }}>
          <Repos key={"repos"} />
        </div>
        <br />
        <BotsYears key={"bots-years"} />
        <br />
        <ChartRenderer key={"table-example"} />
        <div style={{ height: "500px" }}>
          <PieExample key={"pie-example"} />
        </div>
      </div>
    </div>
  );
}

export default App;
