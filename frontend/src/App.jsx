import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SalesOrderPage from './pages/SalesOrderPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/order" element={<SalesOrderPage />} />
                <Route path="/order/:id" element={<SalesOrderPage />} />
            </Routes>
        </Router>
    );
}

export default App;
