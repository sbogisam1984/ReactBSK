import {
    Typography,
} from '@mui/material';
import { ProductType } from '@/app/_types/ProductType';
import React from 'react';

export default function ProductFeatuesRate({ product }: { product: ProductType }) {
    return (
        <React.Fragment>      
            {(product.productType === 'Certificate of Deposit' || product.productType === 'Money Market') && 
                <Typography textAlign='left' color='secondary' sx={{ paddingY: '4px' }}>
                    Current Rate: {product.rate ?? 'unknown'}
                </Typography>
            }
        </React.Fragment>
    )
}
