export class Selection {
    public static toggle(): () => void {
        const active = document.activeElement;
        const selection = document.getSelection();
        if (!active || !selection || !selection.rangeCount) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return function () {};
        }

        const ranges: Range[] = [];
        for (let i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i));
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        let focus: Function | undefined;
        switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
            case 'INPUT':
                focus = (active as HTMLInputElement).focus;
                (active as HTMLInputElement).blur();
            case 'TEXTAREA':
                focus = (active as HTMLTextAreaElement).focus;
                (active as HTMLTextAreaElement).blur();
                break;
            default:
                break;
        }

        selection.removeAllRanges();
        return function () {
            selection.type === 'Caret' && selection.removeAllRanges();
            if (!selection.rangeCount) {
                ranges.forEach(function(range) {
                    selection.addRange(range);
                });
            }

            focus && focus();
        };
    }
}