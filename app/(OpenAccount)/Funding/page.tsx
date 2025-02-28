import FundingAccount from './components/fundingaccount';
import { GetShoppingCartByEnrollmentId } from '../../_utils/shoppingCartUtils';
import { ShoppingCartType } from '../../_types/ShoppingCartType';
import classes from './funding.module.css';
import { EnrollmentPageEnum } from '../../_types/EnrollmentInfo';
import { GetEnrollment } from '../../_utils/enrollmentUtils';
import { EnrollmentProductType } from '../../_types/ProductType';
import { updateLastCompletedStep } from '@/app/_utils/lastCompletedStepUtils';
import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import { setCurrentPage } from '@/app/_utils/pageUtils';

export default async function Funding() {
  const enrollment = await GetEnrollment();

  if (enrollment) {
    const enrollmentProducts: EnrollmentProductType[] | undefined = enrollment?.data.productInfos;
    const currentProducts: ShoppingCartType | undefined = await GetShoppingCartByEnrollmentId(
      enrollment.data.enrollmentId
    );

    const currentPage = EnrollmentPageEnum.Funding;
    await updateLastCompletedStep({
      currentPage: currentPage,
      lastCompletedStep: enrollment.data.lastCompletedStep,
    });
    await setCurrentPage(currentPage);

    return (
      <div>
        <ProfileNavBarWrapper currentPage={currentPage}>
          <div className={classes.pageContainer}>
            <h2 className="text-3xl mb-4">
              {(currentProducts?.shoppingCartItems?.length ?? 0) > 1 ? 'Fund your accounts' : 'Fund your account'}
            </h2>
            <p className="text-lg">
              No funds will be transferred until your account is open and your identity verified.
            </p>
            <FundingAccount products={currentProducts} enrollmentProducts={enrollmentProducts} />
          </div>
        </ProfileNavBarWrapper>
      </div>
    );
  }
}
