import toSafeInteger from 'lodash/toSafeInteger';
import isString from 'lodash/isString';
import * as shortid from 'shortid';
import { Bootstrap, ListView, MobileView, Parallax, Progress, Quickview, SideBar, Social } from 'pages-ts';
import { Content } from './Content';
import { equalHeight } from './Functions';
import { IModule } from '../app/IModule';
import { Logger } from '../common/Logger';

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

    constructor() {
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
    }

    private initPages() {
        var parallax = null;
        var $this = this;

		$('[data-pages="list-view"]').each(function() {
			 new ListView(this, {});
		});

		$('[data-navigate="view"]').each(function() {
			new MobileView(this, {});
		});

		Parallax.onInitialize();

        $('body').on('click', '.toggle-more-details', function (event) {
            event.stopPropagation();
            var p = $(this).closest('.heading');
            p.closest('.heading').children('.more-details').stop().slideToggle('fast', function () {
                p.toggleClass('open');
            });
        });

		$('[data-pages-progress="circle"]').each(function() {
			new Progress(<HTMLInputElement>this, {});
		});

		$('[data-pages="quickview"]').each(function() {
			new Quickview(this, {});
		});

		$('[data-pages="sidebar"]').each(function() {
			new SideBar(this, {});
        });

        $('.toggle-secondary-sidebar').on('click', function(e) {
            e.stopPropagation();
            $('.secondary-sidebar').toggle();
        });

        Bootstrap.reponsiveTabs();

        Social.onInitialize();

		$(window).on('resize', function() {
		    Social.onFitWidth();
		    Social.onResize();

            if ($(window).width()! <= 991) {
                $('.secondary-sidebar').hide();
            } else {
                $('.secondary-sidebar').show();
            }
        });

        $('[data-toggle="tooltip"]').tooltip();

        // {{{ Popover
        $('[data-toggle="popover"]').popover();

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

        const popover = jQuery('[data-mini]');
        popover.on('click', function(ev) {
            ev.preventDefault();
        });

        popover.popover({
            html: true,
            trigger: "focus",
            sanitize: false,
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-body username-popup"></div></div>',
            content: function() {
                const $that: JQuery<Element> = jQuery(this);
                let popupId = $that.data('popupId') ?? shortid.generate();
                let popupData = $that.data('popupData');
                if (popupData) {
                    return popupData;
                } else {
                    $that.data('popupId', popupId);
                    return userNamePopup($that, $that.data("mini"), popupId);
                }
            }
        });

        // }}} Popover

        $('.scrollable').scrollbar({
            ignoreOverlay: false
        });
    }

    /**
     * Позиционирует скроллинг к указанному элементу
     */
    public scrollTo(el: string | JQuery, top?: boolean): void {
        let offset = S(el).offset()!.top - toSafeInteger(this.content.container.css("padding-top"));
        jQuery("html, body").animate({ scrollTop: offset }, 700);
    }

    wire() {
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
            if (jQuery(this).scrollTop()! > 100) {
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

    private adjustSizes() {
        this.syncHeights();
    }

    private syncHeights() {
        jQuery("[data-aspect-ratio=\"true\"]").each(function () {
            jQuery(this).height(jQuery(this).width()!);
        });

        jQuery("[data-sync-height=\"true\"]").each(function () {
            equalHeight(jQuery(this).children());
        });
    }
}
