import ProfileNavBarWrapper from '@/app/_components/ProfileNavBar/profileNavBarWrapper';
import ProductMenuSkeleton from './components/ProductMenuSkeleton';
import { EnrollmentPageEnum } from '@/app/_types/EnrollmentInfo';

export default function ProductMenuLoadingPage() {
  const currentPage = EnrollmentPageEnum.ProductMenu;
  return (
    <ProfileNavBarWrapper currentPage={currentPage}>
      <ProductMenuSkeleton />
    </ProfileNavBarWrapper>
  );
}
