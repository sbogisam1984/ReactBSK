interface socialItem {
    link: string,
    icon?: string,
    tooltip?: string
}
export interface Social {
    chat?: socialItem,
    videoChat?: socialItem,
    call?: socialItem,
    email?: socialItem,
    appointment?: socialItem 
}
export interface SocialType {
    social?: Social,
    className?: string
}
export default interface InfoCardType extends SocialType{
    heading?: string,
    title: string,
    items: string[] | JSX.Element[],
    noBorder?: boolean
}