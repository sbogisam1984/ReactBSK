'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  AlertColor,
  Button,
} from '@mui/material';
import { ProductType } from '@/app/_types/ProductType';
import { ShoppingCartDetailType, ShoppingCartType } from '@/app/_types/ShoppingCartType';
import { AddAdditionalServices, AddShoppingCartItem, RemoveAdditionalServices } from '@/app/_utils/shoppingCartUtils';
import ProductFeaturesModal from './productFeaturesModal';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import { getProductNameWithServicemark } from '@/app/_utils/productUtils';
import AdditionalServicesModal from './AdditionalServicesModal';

interface ProductMenuItemsProps {
  products: ProductType[];
  shoppingCart?: ShoppingCartType;
}

export interface ServiceState {
  serviceId: number;
  shoppingCartItemServiceInfoId?: number;
  isActive: boolean;
}

export interface ServiceStateMap {
  [key: string]: ServiceState; // key will be `${serviceId}-${shoppingCartItemId}`
}

// Helper function to generate a unique key for service states
export const getServiceStateKey = (serviceId: number, shoppingCartItemId?: number) =>
  `${serviceId}-${shoppingCartItemId}`;

export default function ProductMenuItems({ products, shoppingCart }: ProductMenuItemsProps) {
  const [serviceStates, setServiceStates] = useState<ServiceStateMap>({});
  const [serviceLoadingStates, setServiceLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [additionalServicesModalOpen, setAdditionalServicesModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedShoppingCartItem, setSelectedShoppingCartItem] = useState<ShoppingCartDetailType>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  useEffect(() => {
    const initialStates: ServiceStateMap = {};
    shoppingCart?.shoppingCartItems?.forEach(item => {
      item.shoppingCartServices?.forEach(cartService => {
        if (cartService.additionalServicesInfo?.id) {
          const key = getServiceStateKey(cartService.additionalServicesInfo.id, item.shoppingCartItemId);
          initialStates[key] = {
            serviceId: cartService.additionalServicesInfo.id,
            shoppingCartItemServiceInfoId: cartService.shoppingCartItemServiceInfoId,
            isActive: true,
          };
        }
      });
    });
    setServiceStates(initialStates);
  }, [shoppingCart?.shoppingCartItems]);

  const handleServiceAction = async (shoppingCartItemId: number | undefined, serviceId: number, isAdding: boolean) => {
    const stateKey = getServiceStateKey(serviceId, shoppingCartItemId);
    setServiceLoadingStates(prev => ({ ...prev, [stateKey]: true }));

    try {
      if (isAdding) {
        const response = await AddAdditionalServices(shoppingCartItemId, serviceId);
        if (response) {
          setServiceStates(prev => ({
            ...prev,
            [stateKey]: {
              serviceId,
              shoppingCartItemServiceInfoId: response.shoppingCartServices?.[0]?.shoppingCartItemServiceInfoId,
              isActive: true,
            },
          }));

          setSelectedShoppingCartItem(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              totalItemCost: response.totalItemCost,
              shoppingCartServices: response.shoppingCartServices,
            };
          });
        }
      } else {
        const currentState = serviceStates[stateKey];
        const response = await RemoveAdditionalServices(shoppingCartItemId, currentState.serviceId);
        if (response) {
          setServiceStates(prev => ({
            ...prev,
            [stateKey]: {
              serviceId,
              shoppingCartItemServiceInfoId: undefined,
              isActive: false,
            },
          }));

          setSelectedShoppingCartItem(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              totalItemCost: response.totalItemCost,
              shoppingCartServices: response.shoppingCartServices,
            };
          });
        }
      }

      setSnackbar({
        open: true,
        message: `Service ${isAdding ? 'added to' : 'removed from'} cart`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${isAdding ? 'add' : 'remove'} service`,
        severity: 'error',
      });
    } finally {
      setServiceLoadingStates(prev => ({ ...prev, [stateKey]: false }));
      router.refresh();
    }
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  async function cartClick(product: ProductType) {
    setLoadingStates(prev => ({ ...prev, [product.productId]: true }));

    const shoppingCartItem = {
      product: {
        productId: product.productId,
        productName: product.productName,
        productType: product.productType,
      },
      quantity: 1,
    };

    try {
      if (shoppingCart?.shoppingCartId) {
        const addCartResponse = await AddShoppingCartItem(shoppingCart.shoppingCartId, shoppingCartItem);
        const addedItem = addCartResponse?.shoppingCartItems?.sort(
          (a, b) => (b.shoppingCartItemId ?? 0) - (a.shoppingCartItemId ?? 0)
        )[0];
        setSnackbar({
          open: true,
          message: 'Product added to cart',
          severity: 'success',
        });
        // Show additional services modal
        setSelectedProduct(product);
        setSelectedShoppingCartItem(addedItem);
        setAdditionalServicesModalOpen(true);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add product to cart',
        severity: 'error',
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.productId]: false }));
      router.refresh();
    }
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container spacing={2}>
        {products?.map(product => {
          const isLoading = loadingStates[product.productId] || false;
          const anyProductLoading = Object.values(loadingStates).some(state => state);

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.productId}>
              <Paper
                elevation={3}
                sx={{
                  height: '100%',
                  minHeight: '225px',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2,
                }}
              >
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="h3" fontWeight="600" gutterBottom>
                  {getProductNameWithServicemark(product.productName, product.isServicemarkRequired)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    flexGrow: 1,
                    mb: 2,
                  }}
                >
                  {product.productDescription}
                </Typography>

                {product.freeGiftDescription && (
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {product.freeGiftDescription}
                  </Typography>
                )}

                {selectedProduct && selectedProduct === product && (
                  <AdditionalServicesModal
                    open={additionalServicesModalOpen}
                    onClose={() => {
                      setAdditionalServicesModalOpen(false);
                      setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    shoppingCartItem={selectedShoppingCartItem}
                    enrollmentId={shoppingCart?.enrollmentId}
                    serviceStates={serviceStates}
                    serviceLoadingStates={serviceLoadingStates}
                    servicesForProduct={selectedShoppingCartItem?.shoppingCartServices || []}
                    onServiceAction={handleServiceAction}
                  />
                )}

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    mt: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <ProductFeaturesModal product={product} onAddToCart={cartClick} isLoading={isLoading} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={() => cartClick(product)}
                      disabled={anyProductLoading}
                      startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
                    >
                      {isLoading ? '... Adding' : 'Add to Cart'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity as AlertColor} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
