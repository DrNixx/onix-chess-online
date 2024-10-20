import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InfiniteScrollContent from './InfiniteScrollContent';
import { applyDefaults, defaultOf } from '../utils/propsUtils';

type InfinityCallback = () => Promise<void>;

type Props = {
    disabled?: boolean;
    position?: 'bottom' | 'top';
    threshold?: string;
    onInfinite?: (callback: InfinityCallback) => void;
};

type propsWithDefaults = 'disabled' | 'position' | 'threshold' | 'onInfinite';
const defaultProps: defaultOf<PropsWithChildren<Props>, propsWithDefaults> = {
    disabled: false,
    position: 'bottom',
    threshold: '15%',
    onInfinite: () => {},
};

const InfinityScroll: React.FC<PropsWithChildren<Props>> = (propsIn) => {
    const props = applyDefaults(propsIn, defaultProps);
    const {
        disabled,
        position,
        //threshold,
        children,
        onInfinite,
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const complete = useCallback(async () => {
        setIsLoading(false);
        if (position === 'top') {
            setIsBusy(true);
            // ******** DOM READ ****************
            // Save the current content dimensions before the UI updates
            //const prev = scrollEl.scrollHeight - scrollEl.scrollTop;
            // ******** DOM READ ****************
            requestAnimationFrame(() => {
                //const scrollHeight = scrollEl.scrollHeight;
                // New content was added on top, so the scroll position should be changed immediately to prevent it from jumping around
                //const newScrollTop = scrollHeight - prev;
                // ******** DOM WRITE ****************
                requestAnimationFrame(() => {
                    //scrollEl.scrollTop = newScrollTop;
                    setIsBusy(false);
                });
            });
        }
    }, [position]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (entry.isIntersecting && !isLoading && !isBusy) {
                setIsLoading(true);
                onInfinite(complete);
            }
        },
        [complete, isBusy, isLoading, onInfinite],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback);
        if (ref.current && !disabled) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [observerCallback, disabled]);

    return (
        <Box
            ref={ref}
            sx={{
                width: '100%',
                display: disabled ? 'none' : 'block',
                '& .infinite-loading': {
                    display: isLoading ? 'block' : 'none',
                },
            }}
        >
            {children ? children : <InfiniteScrollContent />}
        </Box>
    );
};

export default InfinityScroll;
