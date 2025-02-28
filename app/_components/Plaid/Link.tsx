import React from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { ProductFunding } from '../../_types/ProductType';
import { HandleOnSuccess } from '../../_utils/plaidUtils';

interface Props {
  onDataChange(message: any): unknown;
  token: string;
  productFunding: ProductFunding[] | undefined;
  showLink: boolean;
}

const Link: React.FC<Props> = (props: Props) => {
  const { open, ready, exit } = usePlaidLink({
    token: props.token,
    onSuccess: async (publicToken, metadata) => {
      // Handle success
      console.log('success called');
      //TODO send amount and implement transactions
      const message = await HandleOnSuccess(metadata, publicToken, props.productFunding);
      props.onDataChange(message);
    },
    onExit: (error, metadata) => {
      // Handle exit, optionally with error and metadata
      console.log('exit called');
    },
  });

  const handleExit = () => {
    exit();
  };

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    console.log('showLink:', props.showLink);
    props.showLink && open();
  }, [ready, open, props.showLink]);

  return <></>;
};

Link.displayName = 'Link';

export default Link;
