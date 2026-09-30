import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import PokedexLid from './components/PokedexLid';
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

// Pokémon pages open and close under the Pokédex lid; other page changes just fade.
const onDex = (path: string) => path.startsWith('/pokemon');

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
  const { pathname } = location;
  // The page on screen: lags `pathname` while the previous page animates out.
  const [shown, setShown] = useState(pathname);
  const dexId = onDex(pathname) ? pathname.split('/')[2] : undefined;
  const loadedId = useAppSelector(({ pokemon }) => pokemon.currentPokemon?.id);
  const dex = onDex(pathname) || onDex(shown);
  // Shut while swapping to or from a Pokémon, and until that Pokémon's data is in.
  const closed = (dex && shown !== pathname) || (onDex(pathname) && String(loadedId) !== dexId);

  // A type's colour belongs to its Pokémon's page (which sets it); other pages go back to the app's
  // yellow. Waits for `shown`, so the switch happens under the shut lid.
  useEffect(() => {
    if (!onDex(shown)) delete document.documentElement.dataset.type;
  }, [shown]);

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
        <div className='app'>
          <Navbar />
          <div className='stage'>
            {/* Keyed by path so each page (and each Pokémon) animates out before the next animates in.
                `custom` tells the leaving page to wait under the lid. The exit callback is captured when
                the exit starts, so it reads the URL rather than a possibly stale `pathname`. */}
            <AnimatePresence mode="wait" custom={dex} onExitComplete={() => setShown(window.location.pathname)}>
              <Routes location={location} key={pathname}>
                <Route element={<Search />} path='/search' />
                <Route element={<About />} path='/about' />
                <Route element={<List />} path='/list' />
                <Route element={<Compare />} path='/compare' />
                <Route element={<Pokemon />} path='/pokemon/:id' />
                <Route element={<Navigate to="/pokemon/1" />} path='*' />
              </Routes>
            </AnimatePresence>
            <PokedexLid closed={closed} label={dexId && `No. ${dexId.padStart(3, '0')}`} />
          </div>
          <Footer />
          <ToastContainer />
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
