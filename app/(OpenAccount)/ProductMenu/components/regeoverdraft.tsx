import { ReactNode, useState } from 'react';
import { Box, Button, Modal, CircularProgress } from '@mui/material';
import { AcceptDisclosure } from '@/app/_utils/disclosureUtils';
import { AddAdditionalServices } from '@/app/_utils/shoppingCartUtils';
import { DisclosureAcceptRequest } from '@/app/_types/EnrollmentInfo';

export default function RegEOverdraftProtectionModal({
  children,
  disclosureType,
  mode,
  enrollmentId,
  shoppingCartItemId,
  additionalServicesId,
  onServiceChange,
}: {
  children: ReactNode;
  disclosureType: number;
  mode: string;
  enrollmentId: number | undefined;
  shoppingCartItemId: number | undefined;
  additionalServicesId: number;
  onServiceChange: (isAdding: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setAddLoading(true);
    // Simulate loading time for opening the modal
  };

  const handleClose = () => {
    setOpen(false);
    setAddLoading(false);
    setAcceptLoading(false);
  };

  const handleAccept = async () => {
    setAcceptLoading(true);
    try {
      const disclosureAcceptRequest: DisclosureAcceptRequest = { disclosureType };
      //   await AddAdditionalServices(shoppingCartItemId, additionalServicesId);
      await AcceptDisclosure(enrollmentId!, disclosureAcceptRequest);
      onServiceChange(true);
      handleClose();
    } catch (error) {
      console.error('Error during acceptance:', error);
      // Handle error appropriately
    } finally {
      setAcceptLoading(false);
    }
  };

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Button variant="contained" sx={{ width: 100 }} onClick={handleOpen} disabled={addLoading}>
        {addLoading ? <CircularProgress size={24} /> : 'Add'}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {children}
          {mode === 'accept' && (
            <Button variant="contained" onClick={handleAccept} disabled={acceptLoading}>
              {acceptLoading ? <CircularProgress size={24} /> : 'Accept'}
            </Button>
          )}
          {mode === 'view' && (
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          )}
        </Box>
      </Modal>
    </>
  );
}
