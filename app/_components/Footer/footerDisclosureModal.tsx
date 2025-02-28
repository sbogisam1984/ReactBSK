"use client";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ReactNode, useState } from 'react';

export default function FooterDisclosureModal({ children, disclosureName }: { children: ReactNode, disclosureName: string }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
    }

    const style = {
        width: '100%',
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        height: '90%',
        p: 2,
    };

    return (
        <>
            <Button variant="text" style={{ color: 'black'}} onClick={handleOpen}>{disclosureName}</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {children}
                    <Button sx={{ width: 100 }} variant="contained" onClick={async () => {
                        handleClose()
                    }}>Close</Button>
                </Box>
            </Modal>
        </>
    )
}
