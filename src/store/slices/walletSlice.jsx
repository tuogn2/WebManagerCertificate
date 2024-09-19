// src/store/slices/walletSlice.js
import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    address: '',
    balance: null,
  },
  reducers: {
    setWalletAddress: (state, action) => {
      state.address = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearWallet: (state) => {
      state.address = '';
      state.balance = null;
    },
  },
});

export const { setWalletAddress, setBalance, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
