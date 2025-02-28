'use client';
import React, { memo, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdditionalServicesType, ProductType } from '@/app/_types/ProductType';
import { AdditionalServicesOptionTypeEnum, AdditionalServicesTypeEnum } from '@/app/_types/ProductType';
import { getProductNameWithServicemark } from '@/app/_utils/productUtils';
import RegEOverdraftProtectionModal from './regeoverdraft';
import { ShoppingCartDetailServiceType, ShoppingCartDetailType } from '@/app/_types/ShoppingCartType';
import { getServiceStateKey, ServiceStateMap } from './productMenuItems';
import ServiceItem from './ServiceItem';

interface AdditionalServicesModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductType;
  enrollmentId?: number;
  shoppingCartItem?: ShoppingCartDetailType;
  servicesForProduct: ShoppingCartDetailServiceType[];
  serviceStates: ServiceStateMap;
  serviceLoadingStates: { [key: string]: boolean };
  onServiceAction: (shoppingCartItemId: number | undefined, serviceId: number, isAdding: boolean) => Promise<void>;
}

function AdditionalServicesModal({
  open,
  onClose,
  product,
  shoppingCartItem,
  serviceStates,
  serviceLoadingStates,
  servicesForProduct,
  enrollmentId,
  onServiceAction,
}: AdditionalServicesModalProps) {
  const additionalServices = useMemo(
    () =>
      product.additionalServices?.filter(
        x =>
          x.additionalServicesOptionType === AdditionalServicesOptionTypeEnum.Optional ||
          x.additionalServicesOptionType === AdditionalServicesOptionTypeEnum.PreSelected
      ),
    [product.additionalServices]
  );

  const standardServices = useMemo(
    () => additionalServices?.filter(x => x.additionalServicesType !== AdditionalServicesTypeEnum.OverdraftProtection),
    [additionalServices]
  );

  const regEServices = useMemo(
    () => additionalServices?.filter(x => x.additionalServicesType === AdditionalServicesTypeEnum.OverdraftProtection),
    [additionalServices]
  );

  if (!additionalServices?.length) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)' } } }}
    >
      <DialogTitle>
        Additional Services for {getProductNameWithServicemark(product.productName, product.isServicemarkRequired)} x
        {shoppingCartItem?.accountNumber?.slice(-4)}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Would you like to add any of these services to your account?
        </Typography>
        {standardServices?.map(service => (
          <ServiceItem
            key={service.id}
            service={service}
            isRegE={false}
            shoppingCartItem={shoppingCartItem}
            serviceStates={serviceStates}
            serviceLoadingStates={serviceLoadingStates}
            servicesForProduct={servicesForProduct}
            enrollmentId={enrollmentId}
            onServiceAction={onServiceAction}
          />
        ))}
        {regEServices?.map(service => (
          <ServiceItem
            key={service.id}
            service={service}
            isRegE={true}
            shoppingCartItem={shoppingCartItem}
            serviceStates={serviceStates}
            serviceLoadingStates={serviceLoadingStates}
            servicesForProduct={servicesForProduct}
            enrollmentId={enrollmentId}
            onServiceAction={onServiceAction}
          />
        ))}
        <Typography sx={{ padding: 2, textAlign: 'end' }} variant="body2">
          <strong>{getProductNameWithServicemark(product.productName, product.isServicemarkRequired)} total: </strong>$
          {shoppingCartItem?.totalItemCost ?? 0}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}

// Custom comparison function to control re-renders
const arePropsEqual = (prevProps: AdditionalServicesModalProps, nextProps: AdditionalServicesModalProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.product.productId === nextProps.product.productId &&
    prevProps.shoppingCartItem?.shoppingCartItemId === nextProps.shoppingCartItem?.shoppingCartItemId &&
    prevProps.shoppingCartItem?.totalItemCost === nextProps.shoppingCartItem?.totalItemCost &&
    JSON.stringify(prevProps.serviceStates) === JSON.stringify(nextProps.serviceStates) &&
    JSON.stringify(prevProps.serviceLoadingStates) === JSON.stringify(nextProps.serviceLoadingStates)
  );
};

export default memo(AdditionalServicesModal, arePropsEqual);
