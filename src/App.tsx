import React, { Suspense, useEffect } from 'react';
import logo from './logo.svg';
import Background from './components/Background';
import './App.css';
import Wrapper from './sections/Wrapper';
import './scss/index.scss'
import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import Search from './pages/Search';
import { ToastContainer,ToastOptions,toast } from 'react-toastify';
import About from './pages/About';
import List from './pages/List';
import Compare from './pages/Compare';
import Pokemon from './pages/Pokemon';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { clearToasts, setUserStatus } from './app/slices/AppSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './utils/FirebaseConfig';
import Loader from './components/Loader';

function App() {
  const { toasts } = useAppSelector(({ app }) => app);
  const dispatch = useAppDispatch();
  useEffect(()=>{
    onAuthStateChanged(firebaseAuth,(currentUser)=>{
      if(currentUser){
        dispatch(setUserStatus({email:currentUser.email}))
      }
    })
  },[dispatch])
  useEffect(() => {
    if (toasts.length) {
      const toastOptions: ToastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };
      toasts.forEach((message: string) => {
        toast(message, toastOptions);
      });
      dispatch(clearToasts());
    }
  }, [toasts, dispatch]);
  return (
    <div className='main-container'>
      <Background/>
      <BrowserRouter>
      <Suspense fallback={<Loader />}>
      <div className='app'>
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
        <ToastContainer/>
      </div>
      </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
