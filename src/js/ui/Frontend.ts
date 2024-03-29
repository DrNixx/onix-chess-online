import toSafeInteger from 'lodash/toSafeInteger';
import isString from 'lodash/isString';
import { createRoot } from 'react-dom/client';
import { nanoid } from 'nanoid';
import { pg, Bootstrap, ListView, MobileView, Parallax, Progress, Quickview, SideBar, Social } from 'pages-ts';
import { notify as notifyBase, INotificationOptions } from 'pages-ts/lib/ui/Notification';
import { Content } from './Content';
import { equalHeight } from './Functions';
import { IModule } from '../app';
import { Logger } from '../common/Logger';
import { focusVisible } from './FocusVisible';
import { simpleChat } from '../chat/Chat';
import { Popover } from 'bootstrap';
import React from "react";
import UserBadge from "./user/UserBadge";

function S(selector: string | JQuery<HTMLElement>): JQuery<HTMLElement> {
    return (isString(selector)) ? jQuery(selector) : selector;
}

declare global {
    interface JQuery {
        scrollbar: (options?: any) => void;
    }
}

export class Frontend implements IModule {
    private height?: number = 0;

    private window: JQuery<Window>;
    private body: JQuery;
    private scrollup: JQuery;

    public content: Content;

    constructor(private uid?: number | string) {
        this.window = jQuery(window);
        this.body = jQuery("body");
        this.scrollup = jQuery(".scrollup");

        this.content = new Content(".page-content");
    }

    public init() {
        this.height = this.content.calculateHeight();
        this.adjustSizes();
        this.wire();
        this.initPages();
        focusVisible();
    }

    private initPages() {
        const parallax = null;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        pg.queryElements('[data-pages="list-view"]').forEach((el) => {
            new ListView(el, {});
        });

        pg.queryElements('[data-navigate="view"]').forEach((el) => {
			new MobileView(el, {});
		});

		Parallax.onInitialize();

        /*
        jQuery('body').on('click', '.toggle-more-details', function (event) {
            event.stopPropagation();
            const p = jQuery(this).closest('.heading');
            p.closest('.heading').children('.more-details').stop().slideToggle('fast', function () {
                p.toggleClass('open');
            });
        });
        */

		pg.queryElements('[data-pages-progress="circle"]').forEach((el) => {
			new Progress(<HTMLInputElement>el, {});
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

		that.window.on('resize', function() {
		    Social.onFitWidth();
		    Social.onResize();

            if (that.window.width()! <= 991) {
                jQuery('.secondary-sidebar').hide();
            } else {
                jQuery('.secondary-sidebar').show();
            }
        });

        jQuery().tooltip && jQuery('[data-toggle="tooltip"]').tooltip();

        // {{{ Popover
        jQuery().popover && jQuery('[data-toggle="popover"]').popover();

        const userNamePopup = function($owner: JQuery<Element>, popoverLink: string, divId: string): string {
            fetch(popoverLink, {mode: "cors"})
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }

                    return response.text();
                })
                .then(function(responseAsText) {
                    $owner.data('popupData', responseAsText);
                    jQuery('#' + divId).html(responseAsText);
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when reading data: \n', error);
                });

            return '<div id="'+ divId +'"><div class="text-center"><div class="progress-circle-indeterminate m-t-45" /></div></div>';
        };

        const userDataMiniList = <HTMLElement[]>[].slice.call(document.querySelectorAll('[data-mini]'));
        const userDataPopoverList = userDataMiniList.map(function (el) {
            return new Popover(el, {
                container: "body",
                template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body username-popup"></div></div>',
                content: function () {
                    const $that: JQuery<Element> = jQuery(this);
                    const popupId = $that.data('popupId') ?? nanoid(8);
                    const popupData = $that.data('popupData');
                    if (popupData) {
                        return popupData;
                    } else {
                        $that.data('popupId', popupId);
                        return userNamePopup($that, $that.data("mini"), popupId);
                    }
                },
                html: true,
                sanitize: false,
                trigger: "click"
            });
        });

        /*
        .on("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
        }).on('inserted.bs.popover', function () {
            jQuery(".popover").on("click", function (event) {
                event.stopPropagation();
            })
        });
        */

        jQuery(document).on("click", function() {
            userDataPopoverList.forEach(p => p.hide());
        });
        // }}} Popover

        jQuery().scrollbar && jQuery('.scrollable').scrollbar({
            ignoreOverlay: false
        });

        // {{{ User badges
        pg.queryElements('[data-user-badge]').forEach((el) => {
            delete el.dataset['userBadge']
            const uid = el.dataset['id'];
            const size: any = el.dataset['size'];
            const compact = (el.dataset['compact'] === undefined) || (el.dataset['compact'] == 'true');
            const root = createRoot(el);
            root.render(React.createElement(UserBadge, {userId: uid, size: size, compact: compact}));
        });
        // }}} User badges

        // {{{ Chat
        if (this.uid) {
            pg.queryElements('[data-simple-chat]').forEach((el) => {
                const channel = el.dataset['simpleChat'];
                const apiUrl = el.dataset['apiUrl'];
                if (channel && apiUrl) {
                    simpleChat({ channel: channel, apiUrl: apiUrl, messages: [] }, el);
                }
            });
        }

        // }}} Chat
    }

    /**
     * Позиционирует скроллинг к указанному элементу
     */
    public scrollTo(el: string | JQuery, top?: boolean): void {
        const offset = (S(el).offset()?.top ?? 0) - toSafeInteger(this.content.container.css("padding-top"));
        jQuery("html, body").animate({ scrollTop: offset }, 700);
    }

    wire() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        jQuery("[data-height-adjust=\"true\"]").each(function () {
            const h = jQuery(this).attr("data-elem-height");
            jQuery(this).css("min-height", h!);
            jQuery(this).css("background-image", "url(" + jQuery(this).data("backgroundImage") + ")");
            jQuery(this).css("background-repeat", "no-repeat");
            if (jQuery(this).attr("data-background-image")) {
                // TODO: adjust backgrounds
            }
        });

        this.window.on('resize', function () {
            that.syncHeights();
        });

        this.window.on('scroll', function () {
            if ((jQuery(this).scrollTop() ?? 0) > 100) {
                that.scrollup.fadeIn();
            } else {
                that.scrollup.fadeOut();
            }
        });

        this.scrollup.on('click', function () {
            jQuery("html, body").animate({ scrollTop: 0 }, 700);
            return false;
        });
    }

    public notifyError(options: INotificationOptions) {
        options.type = options.type ?? "error";
        options.style = options.style ??  "bar";
        options.position = options.position ?? "top";
        options.showClose = true;
        options.timeout = 15000;

        notifyBase(options);
    }

    public notifyInfo(options: INotificationOptions) {
        options.type = options.type ?? "info";
        options.style = options.style ??  "simple";
        options.position = options.position ?? "bottom-right";

        notifyBase(options);
    }

    private adjustSizes() {
        this.syncHeights();
    }

    private syncHeights() {
        jQuery("[data-aspect-ratio=\"true\"]").each(function () {
            jQuery(this).height(jQuery(this).width() ?? 0);
        });

        jQuery("[data-sync-height=\"true\"]").each(function () {
            equalHeight(jQuery(this).children());
        });
    }
}
