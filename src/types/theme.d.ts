import '@mui/material/styles';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    spacing: (value1: number, value2?: number) => string | number;
  }
  interface ThemeOptions {
    // Add custom theme options here if needed
  }
} 