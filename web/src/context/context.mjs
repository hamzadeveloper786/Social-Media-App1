import React, { createContext, useReducer } from 'react';
import { reducer } from './reducer.mjs';
export const GlobalContext = createContext("Initial Value");
let data = {
  user: {},
  role: null,
  isLogin: null
}
export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}