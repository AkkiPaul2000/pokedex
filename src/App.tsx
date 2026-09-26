import React, { useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Background from './components/Background';
import './App.css';
import './scss/index.scss';
import Navbar from './sections/Navbar';
import Footer from './sections/Footer';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Search from './pages/Search';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import About from './pages/About';
import List from './pages/List';
import Compare from './pages/Compare';
import Pokemon from './pages/Pokemon';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { clearToasts, setUserStatus } from './app/slices/AppSlice';
import { getUserPokemons } from './app/reducers/getUserPokemons';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './utils/FirebaseConfig';

const toastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

function App() {
  const toasts = useAppSelector(({ app }) => app.toasts);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      dispatch(setUserStatus(currentUser ? { email: currentUser.email ?? '' } : null));
      // Loaded once per sign-in, so every "Add" can see what's already saved.
      dispatch(getUserPokemons());
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (toasts.length) {
      toasts.forEach((message: string) => {
        toast(message, toastOptions);
      });
      dispatch(clearToasts());
    }
  }, [toasts, dispatch]);

  return (
    // reducedMotion="user": every framer animation honours the OS "reduce motion" setting.
    <MotionConfig reducedMotion="user">
      <div className='main-container'>
        <Background />
        <div className='app'>
          <Navbar />
          {/* Keyed by path so each page (and each Pokémon) animates out before the next animates in. */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route element={<Search />} path='/search' />
              <Route element={<About />} path='/about' />
              <Route element={<List />} path='/list' />
              <Route element={<Compare />} path='/compare' />
              <Route element={<Pokemon />} path='/pokemon/:id' />
              <Route element={<Navigate to="/pokemon/1" />} path='*' />
            </Routes>
          </AnimatePresence>
          <Footer />
          <ToastContainer />
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
