import React from 'react';
import ProfileNavBarWrapper from '../_components/ProfileNavBar/profileNavBarWrapper';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
