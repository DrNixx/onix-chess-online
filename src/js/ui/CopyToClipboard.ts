import { Selection } from './Selection';

export interface CopyToClipboardProps {
    message?: string;
}

const defaultMessage = 'Copy to clipboard: #{key}, Enter';

function format(message: string) {
    const copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
    return message.replace(/#{\s*key\s*}/g, copyKey);
}

export function copy(text?: string, options?: CopyToClipboardProps): boolean {
    if (!text) {
        return false;
    }

    let message, range, selection, mark, success = false;
    if (!options) { options = {}; }

    const reselectPrevious = Selection.toggle();

    try {
        range = document.createRange();
        selection = document.getSelection();
        if (selection === null) {
            throw new Error('copy command was unsuccessful');
        }

        mark = document.createElement('span');
        mark.textContent = text;
        mark.setAttribute('style', [
            // reset user styles for span element
            'all: unset',
            // prevents scrolling to the end of the page
            'position: fixed',
            'top: 0',
            'clip: rect(0, 0, 0, 0)',
            // used to preserve spaces and line breaks
            'white-space: pre',
            // do not inherit user-select (it may be `none`)
            '-webkit-user-select: text',
            '-moz-user-select: text',
            '-ms-user-select: text',
            'user-select: text',
        ].join(';'));

        document.body.appendChild(mark);

        range.selectNode(mark);
        selection.addRange(range);

        const successful = document.execCommand('copy');
        if (!successful) {
            throw new Error('copy command was unsuccessful');
        }
        success = true;
    } catch (err) {
        try {
            const clipboardData = (window as { [key: string]: any })["clipboardData"] as any;
            if (clipboardData) {
                clipboardData.setData('text', text);
                success = true;
            }
        } catch (err) {
            message = format(('message' in options) && !!options.message ? options.message : defaultMessage);
            window.prompt(message, text);
        }
    } finally {
        if (selection) {
            if (typeof selection.removeRange == 'function') {
                if (range) {
                    selection.removeRange(range);
                }
            } else {
                selection.removeAllRanges();
            }
        }

        if (mark) {
            document.body.removeChild(mark);
        }
        
        reselectPrevious();
    }

    return success;
}