'use client';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { ReactNode, useState } from 'react';
import { AcceptDisclosure } from '@/app/_utils/disclosureUtils';
import { DisclosureAcceptRequest } from '@/app/_types/EnrollmentInfo';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
  disclosureId: number | undefined;
  disclosureType: number;
  disclosureName: string;
  disclosureGroup: string;
  mode: string;
  enrollmentId: number | undefined;
}

export default function MainDisclosureModal({
  children,
  disclosureId,
  disclosureType,
  disclosureName,
  disclosureGroup,
  mode,
  enrollmentId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();

  let innerText = `Accept ${disclosureName}`;
  if (mode == 'view') {
    innerText = `View ${disclosureName}`;
  }

  return (
    <>
      <Button sx={{ width: 400 }} variant="contained" onClick={handleOpen}>
        {innerText}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        fullWidth
        maxWidth="md"
        sx={{ '& .MuiDialog-paper': { height: '75vh' } }}
      >
        <DialogTitle id="dialog-title">{innerText}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          {mode == 'accept' && (
            <LoadingButton
              sx={{ width: 100 }}
              variant="contained"
              loading={isAccepting}
              onClick={async () => {
                try {
                  setIsAccepting(true);
                  const acceptRequest: DisclosureAcceptRequest = {
                    disclosureGroup: disclosureGroup,
                    disclosureId: disclosureId,
                    disclosureType: disclosureType,
                    isAccepted: true,
                  };

                  await AcceptDisclosure(enrollmentId!, acceptRequest);
                  router.refresh();
                  handleClose();
                } finally {
                  setIsAccepting(false);
                }
              }}
            >
              Accept
            </LoadingButton>
          )}
          {mode == 'view' && (
            <Button sx={{ width: 100 }} variant="contained" onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
