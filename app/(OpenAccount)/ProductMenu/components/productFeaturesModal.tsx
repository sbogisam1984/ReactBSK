'use client';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { ProductFeatureType, ProductType } from '@/app/_types/ProductType';
import CloseIcon from '@mui/icons-material/Close';
import ProductFeaturesRate from './productFeaturesRate';
import { Circle } from '@mui/icons-material';

interface ProductFeaturesModalProps {
  product: ProductType;
  onAddToCart: (product: ProductType) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductFeaturesModal({ product, onAddToCart, isLoading }: ProductFeaturesModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (val: boolean) => setOpen(val);

  const handleAddToCartAndClose = async () => {
    await onAddToCart(product);
    handleOpen(false);
  };

  return (
    <>
      <Button
        sx={{
          justifyContent: 'flex-start',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
        onClick={() => handleOpen(true)}
      >
        <Typography padding=".5em" textTransform="capitalize" justifyContent="flex-start">
          + Account features
        </Typography>
      </Button>

      <Dialog
        open={open}
        onClose={() => handleOpen(false)}
        fullWidth
        maxWidth={isMobile ? 'xl' : 'md'}
        PaperProps={{
          sx: {
            m: isMobile ? 2 : 4,
            width: isMobile ? 'calc(100% - 32px)' : '75%',
            height: isMobile ? 'auto' : undefined,
            maxHeight: isMobile ? 'calc(100% - 32px)' : undefined,
          },
        }}
      >
        <DialogActions sx={{ justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => handleOpen(false)} size="small" edge="end" aria-label="close">
            <CloseIcon color="primary" />
          </IconButton>
        </DialogActions>

        <DialogTitle
          color="primary"
          sx={{
            px: { xs: 2, sm: 4 },
            py: 1.5,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Account features of {product.productName}
          <ProductFeaturesRate product={product}></ProductFeaturesRate>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
          <Box sx={{ pb: 3 }}>
            <List disablePadding>
              {product.features?.map((cardItem: ProductFeatureType) => (
                <ListItem
                  key={cardItem.id}
                  disableGutters
                  sx={{
                    px: 0,
                    py: 0.75,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'flex-start',
                      mr: 1.5,
                      pt: '6px',
                    }}
                  >
                    <Circle
                      color="primary"
                      sx={{
                        fontSize: '0.5rem',
                      }}
                    />
                  </Box>
                  <Typography variant="body1">{cardItem.feature}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            onClick={handleAddToCartAndClose}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
