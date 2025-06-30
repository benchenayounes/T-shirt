import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DesignEditor from './components/DesignEditor';
import Preview from './components/Preview';
import ShippingForm from './components/ShippingForm';
import ThankYou from './components/ThankYou';
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design" element={<DesignEditor />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/shipping" element={<ShippingForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;