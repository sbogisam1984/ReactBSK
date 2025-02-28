import { Link, Typography, Grid2 as Grid, Box } from '@mui/material';
import { AdditionalServicesOptionTypeEnum } from '../../_types/ProductType';
import { ShoppingCartDetailType } from '../../_types/ShoppingCartType';
import { RemoveAdditionalServices } from '../../_utils/shoppingCartUtils';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ShoppingCartAdditionalServices({ item }: { item: ShoppingCartDetailType }) {
  const router = useRouter();

  return (
    <>
      {item.shoppingCartServices?.map((p, index) => (
        <React.Fragment key={p.additionalServicesInfo?.id ?? index}>
          <Grid size={{ md: 5 }} offset={{ md: 1 }} className="px-[0.375rem]">
            {p.additionalServicesInfo?.additionalServicesOptionType !== AdditionalServicesOptionTypeEnum.Required && (
              <Link
                href=""
                color="primary"
                underline="none"
                onClick={async () => {
                  await RemoveAdditionalServices(item.shoppingCartItemId, p.additionalServicesInfo?.id ?? 0);
                  router.refresh()
                }}
              >
                (-) {p.additionalServicesInfo?.additionalServiceName}
              </Link>
            )}
            {p.additionalServicesInfo?.additionalServicesOptionType === AdditionalServicesOptionTypeEnum.Required && (
              <Typography>{p.additionalServicesInfo?.additionalServiceName}</Typography>
            )}
          </Grid>
          <Grid size={{ md:  1}} offset={{ md: 0 }}>
            {(p.cost ?? 0) > 0 ? (
              <Typography textAlign="right">
                {p.cost?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
            ) : (
              <Typography textAlign="right">--</Typography>
            )}
          </Grid>
          <Grid size={{md:5}}></Grid>
        </React.Fragment>
      ))}
    </>
  );
}
