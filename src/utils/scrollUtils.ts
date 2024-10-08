export const scrollElementIntoViewIfNeeded = (
    domNode: HTMLElement | null,
    parent: HTMLElement | null,
    centerIfNeeded = true,
) => {
    if (domNode && parent) {
        const parentComputedStyle = window.getComputedStyle(parent, null),
            parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
            parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
            overTop = domNode.offsetTop - parent.offsetTop < parent.scrollTop,
            overBottom =
                domNode.offsetTop - parent.offsetTop + domNode.clientHeight - parentBorderTopWidth >
                parent.scrollTop + parent.clientHeight,
            overLeft = domNode.offsetLeft - parent.offsetLeft < parent.scrollLeft,
            overRight =
                domNode.offsetLeft - parent.offsetLeft + domNode.clientWidth - parentBorderLeftWidth >
                parent.scrollLeft + parent.clientWidth,
            alignWithTop = overTop && !overBottom;

        if ((overTop || overBottom) && centerIfNeeded) {
            parent.scrollTop =
                domNode.offsetTop -
                parent.offsetTop -
                parent.clientHeight / 2 -
                parentBorderTopWidth +
                domNode.clientHeight / 2;
        }

        if ((overLeft || overRight) && centerIfNeeded) {
            parent.scrollLeft =
                domNode.offsetLeft -
                parent.offsetLeft -
                parent.clientWidth / 2 -
                parentBorderLeftWidth +
                domNode.clientWidth / 2;
        }

        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
            domNode.scrollIntoView(alignWithTop);
        }
    }
};
