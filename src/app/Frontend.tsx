import React, {PropsWithChildren, ReactElement, useCallback, useEffect, useRef} from "react";

import { Popover } from 'bootstrap';
import { pg, Bootstrap, ListView, MobileView, Parallax, Progress, Quickview, SideBar, Social } from 'pages-ts';
import {equalHeight} from "../ui/Functions";
import {focusVisible} from "../ui/FocusVisible";
import {simpleChat} from "../chat/SimpleChat";
import {nanoid} from "nanoid";
import {useApi} from "../hooks/useApi";
import UserBadge from "../components/user/UserBadge";
import {renderPortal} from "../utils/renderUtils";

function syncHeights() {
    jQuery("[data-aspect-ratio=\"true\"]").each(function () {
        jQuery(this).height(jQuery(this).width() ?? 0);
    });

    jQuery("[data-sync-height=\"true\"]").each(function () {
        equalHeight(jQuery(this).children());
    });
}

function adjustSizes() {
    syncHeights();
}

function wire() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    jQuery("[data-height-adjust=\"true\"]").each(function () {
        const h = jQuery(this).attr("data-elem-height");
        jQuery(this).css("min-height", h!);
        jQuery(this).css("background-image", "url(" + jQuery(this).data("backgroundImage") + ")");
        jQuery(this).css("background-repeat", "no-repeat");
        if (jQuery(this).attr("data-background-image")) {
            // TODO: adjust backgrounds
        }
    });
}

function initPages(){
    pg.queryElements('[data-pages="list-view"]').forEach((el) => {
        new ListView(el, {});
    });

    pg.queryElements('[data-navigate="view"]').forEach((el) => {
        new MobileView(el, {});
    });

    Parallax.onInitialize();

    pg.queryElements('[data-pages-progress="circle"]').forEach((el) => {
        new Progress((el as HTMLInputElement), {});
    });

    pg.queryElements('[data-pages="quickview"]').forEach((el) => {
        new Quickview(el, {});
    });

    pg.queryElements('[data-pages="sidebar"]').forEach((el) => {
        new SideBar(el, {});
    });

    jQuery('.toggle-secondary-sidebar').on('click', function(e) {
        e.stopPropagation();
        jQuery('.secondary-sidebar').toggle();
    });

    Bootstrap.reponsiveTabs();

    Social.onInitialize();

    if (jQuery().scrollbar) {
        jQuery('.scrollable').scrollbar({
            ignoreOverlay: false
        });
    }
}

const Frontend: React.FC<PropsWithChildren> = ({children}) => {

    const userDataPopoverList = useRef<Popover[]>([]);
    const {apiGet} = useApi();

    const onResize = useCallback(() => {
        Social.onFitWidth();
        Social.onResize();

        syncHeights();

        if (window.innerWidth <= 991) {
            jQuery('.secondary-sidebar').hide();
        } else {
            jQuery('.secondary-sidebar').show();
        }
    }, []);

    const userNamePopup = useCallback((owner: HTMLElement, popoverLink: string, divId: string) => {
        apiGet(popoverLink)
            .then(function(data) {
                owner.dataset['popupData'] = data.model;
                const el = document.getElementById(divId);
                if (el) {
                    el.innerHTML = data.model;
                }
            })
            .catch(function(error) {
                console.error('Looks like there was a problem when reading data: \n', error);
            });

        return '<div id="'+ divId +'"><div class="text-center"><div class="progress-circle-indeterminate m-t-45" /></div></div>';
    }, [apiGet]);

    const userNamePopups = useCallback(() => {
        const userDataMiniList = document.querySelectorAll('[data-mini]');
        userDataPopoverList.current = [];
        userDataMiniList.forEach((el) => {
            userDataPopoverList.current.push(
                new Popover(el, {
                    container: "body",
                    template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body username-popup"></div></div>',
                    content: function () {
                        const element = el as HTMLElement;
                        const popupId = element.dataset['popupId'] ?? nanoid(8);
                        const popupData = element.dataset['popupData'];
                        if (popupData) {
                            return popupData;
                        } else {
                            element.dataset['popupId'] = popupId;
                            return userNamePopup(element, element.dataset['mini'] ?? '', popupId);
                        }
                    },
                    html: true,
                    sanitize: false,
                    trigger: "click"
                })
            );
        });
    }, [userNamePopup]);

    const hideAllPopups = useCallback(() => {
        userDataPopoverList.current.forEach(p => p.hide());
    }, []);

    useEffect(() => {
        adjustSizes();
        wire();
        initPages();
        focusVisible();
        userNamePopups();

        window.addEventListener('resize', onResize);
        document.addEventListener('click', hideAllPopups);
        
        return () => {
            document.removeEventListener("click", hideAllPopups);
            window.removeEventListener("resize", onResize);
        };
    }, [hideAllPopups, onResize, userNamePopups]);

    const renderChats = useCallback(() => {
        const result: ReactElement[] = [];
        pg.queryElements('[data-simple-chat]').forEach((el) => {
            const channel = el.dataset['simpleChat'];
            const apiUrl = el.dataset['apiUrl'];
            if (channel && apiUrl) {
                result.push(simpleChat(el, { channel: channel }));
            }
        });

        return result;
    }, []);

    const renderBadges = useCallback(() => {
        const result: ReactElement[] = [];
        pg.queryElements('[data-user-badge]').forEach((el) => {
            delete el.dataset['userBadge']
            const uid = el.dataset['id'];
            const size: any = el.dataset['size'];
            const compact = (el.dataset['compact'] === undefined) || (el.dataset['compact'] == 'true');
            result.push(renderPortal(el, UserBadge, {userId: uid, size: size, compact: compact}));
        });

        return result;
    }, []);

    return (
        <>
            {renderChats()}
            {renderBadges()}
            {children}
        </>
    );
};

export default Frontend;