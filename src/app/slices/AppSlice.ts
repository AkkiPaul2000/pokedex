import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTypeInitialState } from "../../utils/Types";
import { pokemonTabs } from "../../utils/Constant";

// The Shiny switch survives reloads (ShinyToggle saves it); storage can be blocked, so default quietly.
const savedShiny = () => {
  try {
    return localStorage.getItem("shiny") === "true";
  } catch {
    return false;
  }
};

const initialState: AppTypeInitialState = {
  isLoading: false,
  toasts: [],
  userInfo: null,
  currentPokemonTab: pokemonTabs.description,
  shiny: savedShiny(),
};

export const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToast: (state, action: PayloadAction<string>) => {
      state.toasts = [...state.toasts, action.payload];
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setUserStatus: (state, action: PayloadAction<{ email: string } | null>) => {
      state.userInfo = action.payload;
    },
    setPokemonTab: (state, action: PayloadAction<string>) => {
      state.currentPokemonTab = action.payload;
    },
    setShiny: (state, action: PayloadAction<boolean>) => {
      state.shiny = action.payload;
    },
  },
});

export const {
  setLoading,
  setToast,
  clearToasts,
  setUserStatus,
  setPokemonTab,
  setShiny,
} = AppSlice.actions;
