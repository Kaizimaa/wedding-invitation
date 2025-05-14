import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import 'aos/dist/aos.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C8A2C8', // Soft lavender
    },
    secondary: {
      main: '#FFD700', // Gold
    },
    background: {
      default: '#FFF8F3', // Soft cream
    },
  },
  typography: {
    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
  },
});

function App() {
  React.useEffect(() => {
    const AOS = require('aos');
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
