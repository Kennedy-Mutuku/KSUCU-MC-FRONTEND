import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leadership from "./components/Leadership";
import OtherCommittees from "./components/OtherCommittees";
import Admin from "./components/admin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Leadership />} />
        <Route path="/other-committees" element={<OtherCommittees />} />
      </Routes>
    </Router>
  );
}

export default App;
