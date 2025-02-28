import React from 'react';
import {
  ApplicationDisclosureInfo,
  DisclosureInfo,
  EnrollmentPageEnum,
  EnrollmentProductInfo,
  ProductDisclosureItem,
  TransactionTypeEnum,
} from '@/app/_types/EnrollmentInfo';
import { updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import { GetDisclosuresForEnrollment, GetEnrollment } from '@/app/_utils/enrollmentUtils';
import { setCurrentPage } from '@/app/_utils/pageUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import MainDisclosureModal from '@/app/(OpenAccount)/Disclosures/components/mainDisclosureModal';
import classes from './disclosures.module.css';
import { Log } from '../../_utils/logUtils';
import DisclosuresNext from './components/disclosureNext';
import { GetShoppingCartByEnrollmentId } from '@/app/_utils/shoppingCartUtils';
import { getProductNameWithServicemark } from '@/app/_utils/productUtils';
import PDFViewer from './components/pdfViewer';
import { Typography } from '@mui/material';

export default async function Disclosures() {
  const currentPage = EnrollmentPageEnum.Disclosures;
  const enrollment = await GetEnrollment();

  if (enrollment) {
    await Log(TransactionTypeEnum.PageLoad, JSON.stringify({ page: 'Disclosures' }));

    await updateLastCompletedStep({
      currentPage: currentPage,
      lastCompletedStep: enrollment.data.lastCompletedStep,
    });

    await setCurrentPage(currentPage);

    const disclosures: DisclosureInfo | undefined = await GetDisclosuresForEnrollment();
    const applicationDisclosures: ApplicationDisclosureInfo[] = disclosures?.applicationDisclosures ?? [];
    const enrollmentProducts: EnrollmentProductInfo[] = disclosures?.enrollmentProducts ?? [];
    const shoppingCart = await GetShoppingCartByEnrollmentId(enrollment.data.enrollmentId);
    const shoppingCartItems = shoppingCart?.shoppingCartItems;

    const isComplete: boolean =
      applicationDisclosures?.filter(x => x.isAccepted === false).length === 0 &&
      enrollmentProducts?.filter(x => x.disclosureItems?.find(i => i.isAccepted === false)).length === 0;

      return (
          <ProfileNavBarWrapper currentPage={currentPage}>
        <Typography variant="h2">Disclosures</Typography>
        <Typography variant="h6" align="center" style={{ fontWeight: 'bold' }}>
          Please Review and Accept the Following Disclosures
        </Typography>
        <Typography variant="h6" align="center">
          You may save or print these documents for your records.
        </Typography>
        <Typography variant="h6" align="center">
          Viewing them constitutes agreement.
        </Typography>
        <div className={classes.disclosuresContainer}>
          <div className={classes.applicationContainer}>
            {applicationDisclosures?.map((x: ApplicationDisclosureInfo, index: number) => {
              const mode: string = x.isAccepted ? 'view' : 'accept';

              return (
                <div key={index} className={classes.applicationItem}>
                  <MainDisclosureModal
                    disclosureId={x.disclosureId}
                    disclosureType={x.disclosureType ?? 0}
                    disclosureName={x.disclosureName ?? ''}
                    disclosureGroup="Application"
                    mode={mode}
                    enrollmentId={enrollment.data.enrollmentId}
                  >
                    {(x.disclosureUrl?.length ?? 0) > 0 && (
                      <object height="95%" width="100%" data={x.disclosureUrl} type="application/pdf"></object>
                    )}
                    {(x.disclosureUrl?.length ?? 0) === 0 && <p>File not found</p>}
                  </MainDisclosureModal>
                </div>
              );
            })}
          </div>
          <div className={classes.productContainer}>
            {enrollmentProducts?.map(
              (p: EnrollmentProductInfo) =>
                (p.disclosureItems?.length ?? 0) > 0 && (
                  <div key={p.product?.productId}>
                    <div className={classes.productHeading}>
                      View Disclosures for{' '}
                      <b>
                        {getProductNameWithServicemark(p.product?.productName, p.product?.isServicemarkRequired)}{' '}
                        {p.accountNumber?.slice(-4)}
                      </b>
                    </div>
                    <div className={classes.productContainer}>
                      {p.disclosureItems?.map((i: ProductDisclosureItem, index2: number) => {
                        const mode: string = i.isAccepted ? 'view' : 'accept';

                        return (
                          <div key={index2} className={classes.productItem}>
                            <MainDisclosureModal
                              disclosureId={i.disclosureId}
                              disclosureType={i.disclosureType ?? 0}
                              disclosureName={i.displayName ?? ''}
                              disclosureGroup="Product"
                              mode={mode}
                              enrollmentId={enrollment.data.enrollmentId}
                            >
                              {i.isESign && (
                                <iframe
                                  title="Docusign"
                                  height="95%"
                                  width="100%"
                                  src={`/DigitalUnity/Disclosures/DocuSign/${enrollment.data.meridianLinkApplicationNumber}/${i.documentTitle}`}
                                ></iframe>
                              )}
                              {!i.isESign && (
                                <PDFViewer
                                  searchParams={{
                                    loanId: enrollment.data.meridianLinkApplicationNumber?.toString(),
                                    pdfCode: i.pdfCode,
                                  }}
                                />
                              )}
                            </MainDisclosureModal>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
        {isComplete && <DisclosuresNext></DisclosuresNext>}
      </ProfileNavBarWrapper>
    );
  }
}
