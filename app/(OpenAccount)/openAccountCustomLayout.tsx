import React from 'react';
import { Box, Container } from '@mui/material';

type Props = {
  activeStepIndex: number;
  children: React.ReactNode;
};

const OpenAccountCustomLayout = ({ children, activeStepIndex }: Props) => {
  return (
    <Container className="pt-[1em] gap-[20px]">
      <Box>{children}</Box>
    </Container>
  );
};

export default OpenAccountCustomLayout;
