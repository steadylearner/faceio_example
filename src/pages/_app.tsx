import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AuthenticationProvider } from "../contexts/authentication";
import Toastify from "../components/Toastify";

import 'react-toastify/dist/ReactToastify.css';
import '../../globals.css';

const THEME = createTheme({});

const Providers = ({ children }) => {
  return (
    <ThemeProvider theme={THEME}>
      <AuthenticationProvider>
        {children}
      </AuthenticationProvider>
    </ThemeProvider>
  );
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
      <>
        <Toastify />
      </>
    </Providers>
  );
}