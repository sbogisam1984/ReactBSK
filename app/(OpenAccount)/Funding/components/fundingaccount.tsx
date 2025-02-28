'use client';
import { Alert, Button, InputAdornment, TextField } from '@mui/material';
import { ShoppingCartType } from '../../../_types/ShoppingCartType';
import classes from '../funding.module.css';
import { useState, SetStateAction } from 'react';
import { EnrollmentProductType, ProductFunding } from '../../../_types/ProductType';
import CreditCardForm from './creditCardForm';
import Link from '../../../_components/Plaid/Link';
import { CreateLinkToken } from '../../../_utils/plaidUtils';
import { getProductNameWithServicemark } from '@/app/_utils/productUtils';

export default function FundingAccount({
  products,
  enrollmentProducts,
}: {
  products: ShoppingCartType | undefined;
  enrollmentProducts: EnrollmentProductType[] | undefined;
}) {
  const [token, setToken] = useState<string | null>(null);
  const mapInitialState = (
    productId: number,
    shoppingCartItemId: number | undefined,
    accountNumber: string | undefined
  ): ProductFunding => {
    const existingEnrolledProduct = enrollmentProducts?.filter(
      x => x.product.productId == productId && x.accountNumber == accountNumber
    );

    let fundingAmount: number = 0;
    if (existingEnrolledProduct && existingEnrolledProduct.length === 1) {
      fundingAmount = existingEnrolledProduct[0].fundingAmount ?? 0;
    }

    return { shoppingCartItemId: shoppingCartItemId, fundingAmount: fundingAmount };
  };

  const initialState: ProductFunding[] | undefined = products?.shoppingCartItems?.map(x => {
    return mapInitialState(Number(x.product?.productId), x.shoppingCartItemId, x.accountNumber);
  });
  const [productFunding, setProductFunding] = useState<ProductFunding[] | undefined>(initialState);
  const [showPaymentSelection, setShowPaymentSelection] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [disableAmountInput, setDisableAmountInput] = useState<boolean>(false);
  const [showLink, setShowLink] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [linkValidationMessage, setlinkValidationMessage] = useState('');

  function fundingChange(shoppingCartItemId: number | undefined, fundingAmount: number) {
    const productsCopy = products?.shoppingCartItems?.map(x => {
      return {
        shoppingCartItemId: x.shoppingCartItemId,
        minDeposit: Number(x.product?.minDeposit),
        fundingAmount: 0,
      };
    });

    const copy = productFunding?.map(x => {
      productsCopy?.map(pc => {
        if (pc.shoppingCartItemId === x.shoppingCartItemId) {
          pc.fundingAmount = x.fundingAmount;
        }
        if (pc.shoppingCartItemId === shoppingCartItemId) {
          pc.fundingAmount = fundingAmount;
        }
      });

      if (x.shoppingCartItemId === shoppingCartItemId) {
        return { shoppingCartItemId: x.shoppingCartItemId, fundingAmount: fundingAmount };
      }

      return x;
    });

    console.log(productsCopy);
    if (productsCopy) {
      setShowPaymentSelection(productsCopy.every(x => x.fundingAmount >= x.minDeposit && x.fundingAmount <= 10000));
    }

    setProductFunding(copy);
    setShowAlert(false);
    setShowLink(false);
  }

  function resetHandler() {
    setDisableAmountInput(false);
    setShowPaymentSelection(false);
    productFunding?.forEach(x => (x.fundingAmount = 0));
  }

  async function initializePlaid() {
    const link_token = await CreateLinkToken();
    if (link_token) {
      setToken(link_token);
      setShowLink(true);
    }
  }

  const handlelinkValidationMessage = (data: SetStateAction<string>) => {
    setShowAlert(true);
    setlinkValidationMessage(data);
  };

  return (
    <>
      <div className={classes.detailContainer}>
        {products?.shoppingCartItems?.map((x, index) => (
          <div key={x.shoppingCartItemId} className={classes.fundingContainer}>
            <div className={classes.labelContainer}>
              <div>
                Fund your{' '}
                <span className="font-bold">
                  {getProductNameWithServicemark(x.product?.productName, x.product?.isServicemarkRequired)} x
                  {x.accountNumber?.slice(-4)}
                </span>{' '}
                account
              </div>
              <div>Deposit between ${x.product?.minDeposit} and $10,000</div>
            </div>
            <div className={classes.depositInput}>
              <TextField
                disabled={disableAmountInput}
                type="number"
                value={productFunding?.[index].fundingAmount}
                onChange={e => fundingChange(x.shoppingCartItemId, Number(e.target.value))}
                label="Enter deposit amount"
                required
                id={x.shoppingCartItemId?.toString() ?? ''}
                name={x.shoppingCartItemId?.toString() ?? ''}
                slotProps={{
                  input: {
                    inputProps: { step: 0.01 },
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                }}
              ></TextField>
            </div>
          </div>
        ))}
        {showAlert && linkValidationMessage && (
          <div className="flex justify-end">
            <Alert severity="error">{linkValidationMessage}</Alert>
          </div>
        )}
        {showPaymentSelection && (
          <div>
            <div>
              <p className="text-center pt-8 pb-4">Please select your payment method:</p>
              <div className="flex flex-row justify-center gap-12">
                <div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDisableAmountInput(false);
                      setPaymentMethod('plaid');
                      initializePlaid();
                    }}
                  >
                    Connect to your Bank
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setDisableAmountInput(true);
                      setPaymentMethod('creditcard');
                    }}
                  >
                    Credit Card
                  </Button>
                </div>
              </div>
            </div>
            <div className="pt-8">
              <div>
                {paymentMethod == 'plaid' && token !== null && (
                  <Link
                    token={token}
                    onDataChange={handlelinkValidationMessage}
                    productFunding={productFunding}
                    showLink={showLink}
                  ></Link>
                )}
              </div>
              <div>
                {paymentMethod == 'creditcard' && (
                  <CreditCardForm reset={resetHandler} productFunding={productFunding}></CreditCardForm>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
