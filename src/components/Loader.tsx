import React from "react";
import { motion } from "framer-motion";
import pokeballLoader from "../assets/pokeball-loader.gif";

// Fades in only after 200ms, so quick loads never flash a spinner.
function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.2 }}
    >
      <img src={pokeballLoader} alt="Loading" />
    </motion.div>
  );
}

export default Loader;
