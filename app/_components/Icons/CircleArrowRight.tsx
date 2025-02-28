'use client';
import React from 'react';
import { useTheme, Theme } from '@mui/material/styles';

type ThemePaletteColor = keyof Omit<
  Theme['palette'],
  'mode' | 'contrastThreshold' | 'tonalOffset' | 'common' | 'grey' | 'text' | 'divider' | 'action' | 'background'
>;

interface ArrowProps {
  color?: ThemePaletteColor | string;
}

const ArrowRight: React.FC<ArrowProps> = ({ color = 'primary' }) => {
  const theme = useTheme();

  const getColor = (colorInput: ThemePaletteColor | string): string => {
    if (colorInput in theme.palette && typeof theme.palette[colorInput as ThemePaletteColor] === 'object') {
      return (theme.palette[colorInput as ThemePaletteColor] as { main: string }).main;
    }
    return colorInput as string;
  };

  const iconColor = getColor(color);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke={iconColor} strokeWidth="2" />
      <path d="M11 8L15 12L11 16" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default ArrowRight;
