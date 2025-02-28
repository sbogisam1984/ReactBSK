import React from 'react';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';

export default function SelectVerificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
