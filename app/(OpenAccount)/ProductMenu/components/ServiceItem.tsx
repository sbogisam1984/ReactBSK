import RegEOverdraftProtectionModal from '@/app/(OpenAccount)/ProductMenu/components/regeoverdraft';
import { AdditionalServicesType, AdditionalServicesTypeEnum } from '@/app/_types/ProductType';
import { ShoppingCartDetailServiceType, ShoppingCartDetailType } from '@/app/_types/ShoppingCartType';
import { Box, Grid2 as Grid, Typography, Button, CircularProgress } from '@mui/material';
import { getServiceStateKey, ServiceState } from './productMenuItems';

interface ServiceItemProps {
  service: AdditionalServicesType;
  isRegE: boolean;
  shoppingCartItem?: ShoppingCartDetailType;
  serviceStates: Record<string, ServiceState>;
  serviceLoadingStates: Record<string, boolean>;
  servicesForProduct: ShoppingCartDetailServiceType[];
  enrollmentId?: number;
  onServiceAction: (shoppingCartItemId: number | undefined, serviceId: number, isAdding: boolean) => void;
}

const ServiceItem = ({
  service,
  isRegE,
  shoppingCartItem,
  serviceStates,
  serviceLoadingStates,
  servicesForProduct,
  enrollmentId,
  onServiceAction,
}: ServiceItemProps) => {
  const stateKey = getServiceStateKey(service.id, shoppingCartItem?.shoppingCartItemId);
  const serviceState = serviceStates[stateKey];
  const isLoading = serviceLoadingStates[stateKey] || false;
  const isAdded = serviceState?.isActive || servicesForProduct.some(s => s.additionalServicesInfo?.id === service.id);

  return (
    <Box sx={{ py: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {service.additionalServiceName}
            {service.additionalServicesType === AdditionalServicesTypeEnum.Checks && (
              <Box component="span" sx={{ ml: 1, fontWeight: 'normal' }}>
                ${service.cost} for {service.quantity} checks
              </Box>
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {service.additionalServiceDescription}
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 1, md: 0 } }}
        >
          {isRegE ? (
            isAdded ? (
              <Button
                variant="outlined"
                sx={{ width: 100 }}
                onClick={() => onServiceAction(shoppingCartItem?.shoppingCartItemId, service.id, false)}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Remove'}
              </Button>
            ) : (
              <RegEOverdraftProtectionModal
                key={service.id}
                disclosureType={3}
                enrollmentId={enrollmentId}
                mode={'accept'}
                shoppingCartItemId={shoppingCartItem?.shoppingCartItemId}
                additionalServicesId={service.id}
                onServiceChange={isAdding =>
                  onServiceAction(shoppingCartItem?.shoppingCartItemId, service.id, isAdding)
                }
              >
                <div>Placeholder text</div>
              </RegEOverdraftProtectionModal>
            )
          ) : (
            <Button
              variant={isAdded ? 'outlined' : 'contained'}
              sx={{ width: 100 }}
              onClick={() => onServiceAction(shoppingCartItem?.shoppingCartItemId, service.id, !isAdded)}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : isAdded ? 'Remove' : 'Add'}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServiceItem;
