import React from 'react';
import logo from './logo.svg';
import Background from './components/Background';
import './App.css';
import Wrapper from './sections/Wrapper';
import './scss/index.scss'
import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import About from './pages/About';
import List from './pages/List';
import Compare from './pages/Compare';
import Pokemon from './pages/Pokemon';

function App() {
  return (
    <div className='main-container'>
      <Background/>
      <BrowserRouter>
      <div className='app' >
        <Navbar/>
        <Routes>
          <Route element={<Search/>} path='/search'></Route>
          <Route element={<About/>} path='/about'></Route>
          <Route element={<List/>} path='/list'></Route>
          <Route element={<Compare/>} path='/compare'></Route>
          <Route element={<Pokemon/>} path='/pokemon/:id'></Route>
          <Route element={<Navigate to="/pokemon/1"/>} path='*'></Route>
        </Routes>
        <Footer/>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
