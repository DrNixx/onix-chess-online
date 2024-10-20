import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    forwardRef,
    Ref,
    PropsWithChildren,
    useImperativeHandle,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { scrollElementIntoViewIfNeeded } from '../utils/scrollUtils';
import { applyDefaults, defaultOf } from '../utils/propsUtils';

export type InfinityScrollerRef = {
    scrollToView: (el: HTMLElement | null) => void;
};

type Props = BoxProps & {
    onInfiniteLoad: () => Promise<void>;
    flipped?: boolean;
    scrollLoadThreshold?: number;
    shouldLoad?: () => boolean;
    spinner?: React.ReactNode;
};

type propsWithDefaults = 'flipped' | 'scrollLoadThreshold' | 'spinner';
const defaultProps: defaultOf<Props, propsWithDefaults> = {
    flipped: false,
    scrollLoadThreshold: 10,
    spinner: <div />,
};

let supportsPassive = false;
try {
    const opts = Object.defineProperty({}, 'passive', {
        get() {
            supportsPassive = true;
        },
    });

    const fn = () => true;

    window.addEventListener('scroll', fn, opts);
    window.removeEventListener('scroll', fn);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (e) {
    /* pass */
}

const InfinityScroller = forwardRef(function (propsIn: PropsWithChildren<Props>, ref: Ref<InfinityScrollerRef>) {
    const props = applyDefaults(propsIn, defaultProps);

    const { onInfiniteLoad, flipped, spinner, scrollLoadThreshold, shouldLoad, children, sx, ...other } = props;

    const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);

    const smoothScrollingWrapper = useRef<HTMLDivElement | null>(null);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    // for cleaning up outstanding requestAnimationFrames on WillUnmount
    const rafRequestId = useRef(0);

    // regular mode initial scroll
    const scrollTop = useRef(0);

    // it's okay, this won't be read until the second render.
    const scrollHeight = useRef<number | undefined>(undefined);

    // In flipped mode, we need to measure the scrollable height from the DOM to write to the scrollTop.
    // Flipped and regular measured heights are symmetrical and don't depend on the scrollTop

    useImperativeHandle(ref, () => {
        return {
            scrollToView(el: HTMLElement | null) {
                if (scrollerRef.current) {
                    scrollElementIntoViewIfNeeded(el, scrollerRef.current);
                    scrollTop.current = scrollerRef.current.scrollTop;
                }
            },
        };
    }, []);

    const isPassedThreshold = useCallback(
        (scrollTop: number, scrollHeight: number, clientHeight: number) => {
            return flipped
                ? scrollTop <= scrollLoadThreshold
                : scrollTop >= scrollHeight - clientHeight - scrollLoadThreshold;
        },
        [flipped, scrollLoadThreshold],
    );

    const shouldTriggerLoad = useCallback(() => {
        if (scrollerRef.current) {
            const passedThreshold = isPassedThreshold(
                scrollerRef.current?.scrollTop,
                scrollerRef.current?.scrollHeight,
                scrollerRef.current?.clientHeight,
            );

            return passedThreshold && !isInfiniteLoading && (!shouldLoad || shouldLoad());
        }

        return false;
    }, [isInfiniteLoading, isPassedThreshold, shouldLoad]);

    const updateScrollTop = useCallback(() => {
        if (scrollerRef.current) {
            // todo this is only the happy path
            let newScrollTop =
                scrollerRef.current.scrollTop +
                (flipped ? scrollerRef.current.scrollHeight - (scrollHeight.current || 0) : 0);

            // if scrollHeightDifference is > 0 then something was removed from list
            const scrollHeightDifference = scrollHeight.current
                ? scrollHeight.current - scrollerRef.current.scrollHeight
                : 0;

            // if something was removed from list we need to include this difference in new scroll top
            if (flipped && scrollHeightDifference > 0) {
                newScrollTop += scrollHeightDifference;
            }

            if (newScrollTop !== scrollerRef.current.scrollTop) {
                scrollerRef.current.scrollTop = newScrollTop;
            }

            scrollTop.current = scrollerRef.current.scrollTop;
            scrollHeight.current = scrollerRef.current.scrollHeight;

            // Setting scrollTop can halt user scrolling (and disables hardware acceleration)

            // Both cases - flipped and refular - have cases where the content expands in the proper direction,
            // or the content expands in the wrong direciton. Either history or new message in both cases.
            // We are only handling half of the cases. Or an image resized above or below us.
        }
    }, [flipped]);

    // detect when dom has changed underneath us- either scrollTop or scrollHeight (layout reflow)
    // may have changed.
    const onScroll = useCallback(() => {
        if (scrollerRef.current?.scrollTop !== scrollTop.current) {
            if (shouldTriggerLoad()) {
                setIsInfiniteLoading(true);
                onInfiniteLoad()
                    .then(() => {
                        setIsInfiniteLoading(false);
                    })
                    .catch((e) => console.error(e));
            }

            if (scrollerRef.current) {
                scrollTop.current = scrollerRef.current.scrollTop;
            }
        }
    }, [onInfiniteLoad, shouldTriggerLoad]);

    const pollScroll = useCallback(() => {
        onScroll();
        rafRequestId.current = window.requestAnimationFrame(pollScroll);
    }, [onScroll]);

    const arrangeTop = useCallback(() => {
        if (scrollerRef.current) {
            // If there are not yet any children (they are still loading),
            // this is a no-op as we are at both the top and bottom of empty viewport
            const heightDifference = flipped ? scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight : 0;

            scrollerRef.current.scrollTop = heightDifference;
            scrollTop.current = heightDifference;
            scrollHeight.current = scrollerRef.current.scrollHeight;
        }
    }, [flipped]);

    useEffect(() => {
        arrangeTop();
    }, [arrangeTop]);

    useEffect(() => {
        let scrollable: HTMLDivElement | undefined;
        if (scrollerRef.current) {
            scrollable = scrollerRef.current;

            // Unless passive events are supported, we must not hook onScroll event
            // directly - that will break hardware accelerated scrolling. We poll it
            // with requestAnimationFrame instead.
            if (supportsPassive) {
                scrollerRef.current.addEventListener('scroll', onScroll, { passive: true });
            } else {
                rafRequestId.current = window.requestAnimationFrame(pollScroll);
            }
        }

        return () => {
            scrollable?.removeEventListener('scroll', onScroll);
            window.cancelAnimationFrame(rafRequestId.current);
        };
    }, [onScroll, pollScroll]);

    const childsCount = useCallback(() => {
        if (Array.isArray(children)) {
            return children.length;
        }

        return 0;
    }, [children]);

    useEffect(() => {
        updateScrollTop();
    }, [childsCount, updateScrollTop]);

    const renderChilds = useCallback(() => {
        return children;
    }, [children]);

    const getSpinner = useCallback(() => {
        return isInfiniteLoading ? spinner : null;
    }, [isInfiniteLoading, spinner]);

    return (
        <Box {...other} sx={{ ...sx, overflowX: 'hidden', overflowY: 'auto' }} ref={scrollerRef}>
            <Box ref={smoothScrollingWrapper}>
                {flipped && getSpinner()}
                {renderChilds()}
                {!flipped && getSpinner()}
            </Box>
        </Box>
    );
});

export default InfinityScroller;
