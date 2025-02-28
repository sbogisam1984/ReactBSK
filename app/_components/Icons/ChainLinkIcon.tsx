'use client';
import React from 'react';
import { useTheme, Theme } from '@mui/material/styles';

type ThemePaletteColor = keyof Omit<
  Theme['palette'],
  'mode' | 'contrastThreshold' | 'tonalOffset' | 'common' | 'grey' | 'text' | 'divider' | 'action' | 'background'
>;

type ChainLinkIconProps = {
  color?: ThemePaletteColor | string;
  width?: number | string;
  height?: number | string;
};

const ChainLinkIcon: React.FC<ChainLinkIconProps> = ({ color = 'primary', width = 20, height = 20 }) => {
  const theme = useTheme();

  const getColor = (colorInput: ThemePaletteColor | string): string => {
    if (colorInput in theme.palette && typeof theme.palette[colorInput as ThemePaletteColor] === 'object') {
      return (theme.palette[colorInput as ThemePaletteColor] as { main: string }).main;
    }
    return colorInput as string;
  };

  const iconColor = getColor(color);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 36.18" width={width} height={height}>
      <g data-name="Layer 2">
        <path
          fill={iconColor}
          d="M26.35 8.82l2.3 2.29a6.27 6.27 0 0 1 0 8.84l-9.1 9.1a6.25 6.25 0 0 1-8.84 0l-3.36-3.36L9.07 24l3.34 3.36a3.82 3.82 0 0 0 5.4 0l9.1-9.1a3.84 3.84 0 0 0 0-5.4l-2.28-2.24ZM1.59 19.94l2.33 2.32 1.72-1.67-2.33-2.37a3.84 3.84 0 0 1 0-5.4l9.1-9.1a3.82 3.82 0 0 1 5.4 0l3.36 3.36 1.72-1.72L19.53 2a6.25 6.25 0 0 0-8.84 0l-9.1 9.1c-2.21 2.4-2.03 6.27 0 8.84m40.3-9.41 2.32 2.32a3.82 3.82 0 0 1 0 5.4l-9.1 9.1a3.84 3.84 0 0 1-5.4 0L26.35 24l-1.72 1.72L28 29.07a6.25 6.25 0 0 0 8.84 0l9.1-9.1a6.25 6.25 0 0 0 0-8.84L43.61 8.8Zm-23 9.47 2.29 2.3 1.72-1.72-2.29-2.3a3.82 3.82 0 0 1 0-5.4l9.1-9.09a3.82 3.82 0 0 1 5.4 0l3.3 3.33 1.72-1.72L36.8 2A6.25 6.25 0 0 0 28 2l-9.1 9.09a6.24 6.24 0 0 0 0 8.84ZM7.41 10.49l2.21 2.21a4 4 0 0 1 0 5.66l-7.69 7.69a1.22 1.22 0 0 0 1.73 1.72l7.68-7.69a6.44 6.44 0 0 0 0-9.1L9.13 8.77ZM1.93 5l2 2 1.72-1.7-2-2A1.22 1.22 0 1 0 1.89 5Zm38.24 15.59L38 18.4a4 4 0 0 1 0-5.66l7.68-7.69a1.2 1.2 0 0 0 0-1.71 1.23 1.23 0 0 0-1.72 0L36.26 11a6.44 6.44 0 0 0 0 9.1l2.15 2.15Zm5.5 5.5-2-2-1.73 1.72 2 2a1.22 1.22 0 0 0 1.72-1.72Z"
          data-name="Layer 1"
        />
      </g>
    </svg>
  );
};

export default ChainLinkIcon;
