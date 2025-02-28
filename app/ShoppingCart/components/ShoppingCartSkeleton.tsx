import React from 'react';
import { Box, Typography, Skeleton, Grid2 as Grid } from '@mui/material';

const ShoppingCartSkeleton: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ paddingX: '2em' }}>
        <Grid size={{ md: 6 }} offset={{md:3}}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Skeleton for Cart component */}
            <Skeleton variant="rectangular" height={300} />
          </Box>
        </Grid>
        <Grid size={6} offset={{ md: 3 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h2" component="h2" textTransform="uppercase" sx={{ paddingY: '1em' }}>
              <Skeleton width="60%" />
            </Typography>
            {/* Skeleton for ProductMenuHeader */}
            <Skeleton variant="rectangular" height={40} sx={{ marginBottom: 2 }} />
            {/* Skeleton for product list */}
            <Grid container spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Grid size={3} key={index}>
                <Skeleton variant="rounded" height={280} />
              </Grid>
            ))}
            </Grid>
          </Box>
          </Grid>
          <Grid size={{ md: 1 }} offset={{md:8}}>
              {/* Skeleton for ShoppingCartBack component */}
              <Box display="flex" justifyContent="self-end">
                  <Skeleton variant="rectangular" width={150} height={40} />
              </Box>
          </Grid>
    </Grid>
  );
};

export default ShoppingCartSkeleton;
