interface Whitelist {
    [key: string]: boolean;
}

export function focusVisible() {
    let hadKeyboardEvent = true;
    let hadFocusVisibleRecently = false;
    let hadFocusVisibleRecentlyTimeout: number | undefined;
    const inputTypesWhitelist: Whitelist = {
        text: true,
        search: true,
        url: true,
        tel: true,
        email: true,
        password: true,
        number: true,
        date: true,
        month: true,
        week: true,
        time: true,
        datetime: true,
        'datetime-local': true
    };

    /**
     * Helper function for legacy browsers and iframes which sometimes focus
     * elements like document and body.
     * @param {Element} el
     */
    function isValidFocusTarget(el: Node|null) {
        if (el && el !== document && el.nodeName !== 'HTML' && el.nodeName !== 'BODY') {
            return true;
        }

        return false;
    }

    /**
     * Computes whether the given element should automatically trigger the
     * `focus-visible` class being added, i.e. whether it should always match
     * `:focus-visible` when focused.
     * @param {Element} el
     * @return {boolean}
     */
    function focusTriggersKeyboardModality(el: HTMLInputElement) {
        const type = el.type;
        const tagName = el.tagName;

        if (tagName == 'INPUT' && inputTypesWhitelist[type] && !el.readOnly) {
        return true;
        }

        if (tagName == 'TEXTAREA' && !el.readOnly) {
            return true;
        }

        if (el.contentEditable == 'true') {
            return true;
        }

        return false;
    }

    /**
     * Add the `focus-visible` class to the given element if it was not added by
     * the author.
     * @param {Element} el
     */
    function addFocusVisibleClass(el: Element) {
        if (el.classList.contains('focus-visible')) {
            return;
        }

        el.classList.add('focus-visible');
        el.setAttribute('data-focus-visible-added', '');
    }

    /**
     * Remove the `focus-visible` class from the given element if it was not
     * originally added by the author.
     * @param {Element} el
     */
    function removeFocusVisibleClass(el: Element) {
        if (!el.hasAttribute('data-focus-visible-added')) {
            return;
        }

        el.classList.remove('focus-visible');
        el.removeAttribute('data-focus-visible-added');
    }

    /**
     * Treat `keydown` as a signal that the user is in keyboard modality.
     * Apply `focus-visible` to any current active element and keep track
     * of our keyboard modality state with `hadKeyboardEvent`.
     * @param {Event} e
     */
    function onKeyDown(e: KeyboardEvent) {
        if (isValidFocusTarget(document.activeElement)) {
            addFocusVisibleClass(document.activeElement!);
        }

        hadKeyboardEvent = true;
    }

    /**
     * If at any point a user clicks with a pointing device, ensure that we change
     * the modality away from keyboard.
     * This avoids the situation where a user presses a key on an already focused
     * element, and then clicks on a different element, focusing it with a
     * pointing device, while we still think we're in keyboard modality.
     * @param {Event} e
     */
    function onPointerDown(e: MouseEvent|TouchEvent|PointerEvent) {
        hadKeyboardEvent = false;
    }

    /**
     * On `focus`, add the `focus-visible` class to the target if:
     * - the target received focus as a result of keyboard navigation, or
     * - the event target is an element that will likely require interaction
     *   via the keyboard (e.g. a text box)
     * @param {Event} e
     */
    function onFocus(e: FocusEvent) {
        // Prevent IE from focusing the document or HTML element.
        if (!isValidFocusTarget(<Element>e.target)) {
            return;
        }

        if (hadKeyboardEvent || focusTriggersKeyboardModality(<HTMLInputElement>e.target)) {
            addFocusVisibleClass(<Element>e.target);
            hadKeyboardEvent = false;
        }
    }

    /**
     * On `blur`, remove the `focus-visible` class from the target.
     * @param {Event} e
     */
    function onBlur(e: FocusEvent) {
        const target = <Element>e.target;
        if (!isValidFocusTarget(target)) {
            return;
        }

        if (target.classList.contains('focus-visible')) {
            // To detect a tab/window switch, we look for a blur event followed
            // rapidly by a visibility change.
            // If we don't see a visibility change within 100ms, it's probably a
            // regular focus change.
            hadFocusVisibleRecently = true;
            window.clearTimeout(hadFocusVisibleRecentlyTimeout);
            hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
                hadFocusVisibleRecently = false;
                window.clearTimeout(hadFocusVisibleRecentlyTimeout);
            }, 100);

            removeFocusVisibleClass(target);
        }
    }

    /**
     * If the user changes tabs, keep track of whether or not the previously
     * focused element had .focus-visible.
     * @param {Event} e
     */
    function onVisibilityChange(e: Event) {
        if (document.visibilityState == 'hidden') {
            // If the tab becomes active again, the browser will handle calling focus
            // on the element (Safari actually calls it twice).
            // If this tab change caused a blur on an element with focus-visible,
            // re-apply the class when the user switches back to the tab.
            if (hadFocusVisibleRecently) {
                hadKeyboardEvent = true;
            }
            addInitialPointerMoveListeners();
        }
    }

    /**
     * Add a group of listeners to detect usage of any pointing devices.
     * These listeners will be added when the polyfill first loads, and anytime
     * the window is blurred, so that they are active when the window regains
     * focus.
     */
    function addInitialPointerMoveListeners() {
        document.addEventListener('mousemove', onInitialPointerMove);
        document.addEventListener('mousedown', onInitialPointerMove);
        document.addEventListener('mouseup', onInitialPointerMove);
        document.addEventListener('pointermove', onInitialPointerMove);
        document.addEventListener('pointerdown', onInitialPointerMove);
        document.addEventListener('pointerup', onInitialPointerMove);
        document.addEventListener('touchmove', onInitialPointerMove);
        document.addEventListener('touchstart', onInitialPointerMove);
        document.addEventListener('touchend', onInitialPointerMove);
    }

    function removeInitialPointerMoveListeners() {
        document.removeEventListener('mousemove', onInitialPointerMove);
        document.removeEventListener('mousedown', onInitialPointerMove);
        document.removeEventListener('mouseup', onInitialPointerMove);
        document.removeEventListener('pointermove', onInitialPointerMove);
        document.removeEventListener('pointerdown', onInitialPointerMove);
        document.removeEventListener('pointerup', onInitialPointerMove);
        document.removeEventListener('touchmove', onInitialPointerMove);
        document.removeEventListener('touchstart', onInitialPointerMove);
        document.removeEventListener('touchend', onInitialPointerMove);
    }

    /**
     * When the polfyill first loads, assume the user is in keyboard modality.
     * If any event is received from a pointing device (e.g. mouse, pointer,
     * touch), turn off keyboard modality.
     * This accounts for situations where focus enters the page from the URL bar.
     * @param {Event} e
     */
    function onInitialPointerMove(e: MouseEvent|TouchEvent|PointerEvent) {
        const target = <Element>e.target;

        // Work around a Safari quirk that fires a mousemove on <html> whenever the
        // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
        if (target.nodeName.toLowerCase() === 'html') {
            return;
        }

        hadKeyboardEvent = false;
        removeInitialPointerMoveListeners();
    }

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
    document.addEventListener('visibilitychange', onVisibilityChange, true);
    addInitialPointerMoveListeners();

    document.body.classList.add('js-focus-visible');
}