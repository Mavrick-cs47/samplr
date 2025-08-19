import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import BuyCredit from './pages/BuyCredit';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#EDE8F5] to-[#7091E6]'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} /> {/* Route for the home page */}
        <Route path='/result' element={<Result />} /> {/* Route for the result page */}
        <Route path='/buy' element={<BuyCredit />} /> {/* Route for the buy credit page */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
