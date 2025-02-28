import React from 'react';
import { Container, Typography, Skeleton, Box, Grid2 as Grid, Stack } from '@mui/material';

const ProductMenuSkeleton: React.FC = () => {
  return (
    <Container>
      <Typography textTransform="uppercase" variant="h2" component="h2" paddingY=".5em">
        <Skeleton sx={{ width: { xs: '100%', md: '30%' }, height: '3rem' }} />
      </Typography>

      {/* Skeleton for ProductMenuHeader */}
      <Box sx={{ marginBottom: 2 }}>
        <Skeleton variant="rectangular" height={40} />
      </Box>

      {/* Skeleton for product list */}
      <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }} marginBottom={2}>
        {[...Array(4)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, md: 3 }}>
            <Skeleton variant="rounded" height={280} />
          </Grid>
        ))}
      </Grid>

      {/* Skeleton for buttons */}
      <Grid container padding={1} justifyContent={'flex-end'}>
        <Stack spacing={0.5}>
          <Skeleton variant="rectangular" height={40} width={120} />
          <Skeleton variant="rectangular" height={40} width={120} />
        </Stack>
      </Grid>
    </Container>
  );
};

export default ProductMenuSkeleton;
