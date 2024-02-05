import React from 'react';
import logo from './logo.svg';
import Background from './components/Background';
import './App.css';
import Wrapper from './sections/Wrapper';
import './scss/index.scss'
import Navbar from './sections/Navbar';
import Footer from './sections/Footer';

function App() {
  return (
    <div className='main-container'>
      <Background/>
      <div className='app' >
        <Navbar/>
        <Wrapper/>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
