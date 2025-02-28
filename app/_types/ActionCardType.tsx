export default interface ActionCardType {
    title: string,
    content: string,
    action?: {
        title: string | undefined,
        click: () => void
    }
}