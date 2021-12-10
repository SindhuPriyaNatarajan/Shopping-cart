import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import ItemsDashboard from "./component/itemsDashboard";
import ItemEdit from './component/itemEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<ItemsDashboard />}>
        </Route>
        <Route path="/add" element={<ItemEdit />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
