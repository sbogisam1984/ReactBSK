import Link from "next/link"
import InfoCardType from "../_types/InfoCardType"

export const APPLICANT_ID = 'applicantId'
export const ENROLLMENT_ID = 'enrollmentid'
export const CART_ITEMS = 'cartItems'
export const CURRENT_CART_ITEM = 'currentCartItem'
export const ApplicantData = 'applicantData'
export const ENROLLMENT_COOKIE = "enrollment"

export const faqCardData: InfoCardType = {
    title: 'Product FAQs:',
    items: [
        <span key="faq">
            Click{' '}
            <Link className="link" href={'/FAQ'}>
                here
            </Link>{' '}
            for more information!
        </span>,
    ],
}

export const productServiceCard: InfoCardType = {
    title: 'Customer Service:',
    items: ['Do you have any questions? Contact us!'],
    social: {
        call: {
            link: '/',
            tooltip: 'Call: +1-888-240-0454',
        },
        email: {
            link: '/',
            tooltip: 'Email: eaccounts@cbna.com',
        },
        appointment: {
            link: '/',
            tooltip: 'Schedule an Appointment',
        },
    },
}

export const helpCard: InfoCardType = {
    heading: "Have any questions?",
    title: "FAQs:",
    items: [
        <span key="faq">
            Click{" "}
            <Link className="link" href={"/FAQ"}>
                here
            </Link>{" "}
            for more information!
        </span>,
    ],
    social: {
        call: {
            link: "/",
            tooltip: "Call: +1-888-240-0454",
        },
        email: {
            link: "/",
            tooltip: "Email: eaccounts@cbna.com",
        },
        appointment: {
            link: "/",
            tooltip: "Schedule an Appointment",
        },
    },
};

