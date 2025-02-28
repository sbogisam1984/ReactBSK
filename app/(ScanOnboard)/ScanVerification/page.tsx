import ScanDialog from './scanDialog';
import { HandleScanDocument } from '@/app/_utils/verificationUtils';
import { ScanDetails } from '@/app/_types/ScanDetailType';

export default async function ScanVerificationPage() {
  const scanDetails: ScanDetails | undefined = await HandleScanDocument();

  return (
    <>
      <ScanDialog scanDetails={scanDetails}></ScanDialog>
    </>
  );
}
