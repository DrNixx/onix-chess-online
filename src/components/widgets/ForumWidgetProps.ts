export type ForumWidgetProps = {
    language: string;
    apiUrl: string;
    i18n: {
        forums: string,
        tabs: {
            [key: string]: string
        }
    }
}