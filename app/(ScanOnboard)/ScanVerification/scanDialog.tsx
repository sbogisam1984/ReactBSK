'use client';

import { Button, Dialog, DialogTitle } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { ScanDetails } from '@/app/_types/ScanDetailType';
import { ApplicantTypeEnum } from '../../_types/EnrollmentInfo';
import { HandleScanResult } from '../../_utils/verificationUtils';

export default function ScanDialog({ scanDetails }: { scanDetails: ScanDetails | undefined }) {
  const [openDialog, setOpenDialog] = useState(true);

  return (
    <Dialog fullScreen open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>
        {scanDetails?.isPrimary ? 'Verification for Primary Applicant' : 'Verfication for Secondary Applicant'}
      </DialogTitle>
      <h3>Please verify</h3>
      <iframe title="ID Scan" className="h-full" src={scanDetails?.idScanUrl}></iframe>
      <div className="flex flex-row justify-center my-4">
        <Button
          variant="contained"
          onClick={async () => {
            await HandleScanResult(scanDetails);
          }}
        >
          Next
        </Button>
      </div>
    </Dialog>
  );
}
