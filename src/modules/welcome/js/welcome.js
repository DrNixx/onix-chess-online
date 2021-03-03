jQuery(function () {
    const $html = jQuery('html');
    const $window = jQuery(window);
    const $body = jQuery('body');

    let parallax_isMobile = ($window.height() <= 640);
    let screenHeight = 0;
    let initScroll = 0;
    let initPad = 0;
    let h2Max = 0;
    let autoScrollTimeout = 0;

    const setParallaxSize = () => {
        parallax_isMobile = ($window.height() <= 640);

        if (parallax_isMobile && ($html.hasClass("k-safari") || $html.hasClass("k-webkit"))) {
            $("[data-rowid=1]").hide();
            $body.addClass("sub-bg");
        } else {
            $body.removeClass("sub-bg");
        }

        const wh = $window.height();
        screenHeight = wh;
        const th = 0; //parallax_isMobile ? $(".top-bar").height() : $(".tab-bar").height();
        const h1 = ((wh - th) / 2);

        if (h1 > 0) {
            $("[data-rowid=1]").css({
                paddingTop: h1,
                paddingBottom: h1
            });
        }

        const row2 = $("[data-rowid=2] [data-rowtype=1]");
        const cnt = row2.find(".container");
        initPad = 10;
        h2Max = ((wh - row2.height()) / 2);
        initScroll = cnt.height() + 20;
        let h2 = 10;
        if (parallax_isMobile) {
            h2 += 10;
        }

        if (h2 > 0) {
            $("[data-rowid=2]").css({
                paddingTop: h2,
                paddingBottom: h2Max
            });
        }
    }

    $window.on('scroll', function (e) {
        clearTimeout(autoScrollTimeout);
        const currentScroll = $(this).scrollTop();
        const maxScroll = h2Max;
        if (currentScroll > initScroll) {
            let delta = (currentScroll - initScroll) / 1.5;
            if (delta > 0) {
                delta = initPad + delta;
                if (delta < h2Max) {
                    $("[data-rowid=2]").css({
                        paddingTop: delta
                    });
                }
            }
        }
        const topScroll = screenHeight / 2.4;
    });

    $body.on('mousewheel', function (event, x1, x2, x3) {
        event.preventDefault();
        const step = (-x1 * 40) / 10;
        for (let i = 0; i < 10; i++) {
            window.scrollBy(0, step);
        }
    });

    /*
    $("[data-rowid=1] ").on("click", function () {
        var h = $(this).outerHeight() + (parallax_isMobile ? $(".top-bar").height() : $(".tab-bar").height());
        var step = Math.floor(h / 30);
        var diff = h - (step * 30);
        for (var i = 0; i < 30; i++) {
            window.scrollBy(0, step);
        }

        if (diff > 0) {
            window.scrollBy(0, diff);
        }
    });

    $("[data-rowid=2] ").on("click", function () {
        var h = $(this).outerHeight() - $(".ha-header-front").outerHeight();
        var step = Math.floor(h / 30);
        var diff = h - (step * 30);
        for (var i = 0; i <= 30; i++) {
            window.scrollBy(0, step);
        }

        if (diff > 0) {
            window.scrollBy(0, diff);
        }
    });
    */

    setParallaxSize();

    $window.on("resize", function () {
        setParallaxSize();
    });

    /*** Retina Image Loader ***/
    if ($.fn.unveil) {
        $("img").unveil();
    }

    /**** Scroller ****/
    let mainScroller = undefined;
    if ($.fn.niceScroll) {
        mainScroller = $body.niceScroll({
            zindex: 999999,
            boxzoom: true,
            cursorcolor: "#FF8719",
            cursoropacitymin: 0.5,
            cursoropacitymax: 0.8,
            cursorwidth: "10px",
            cursorborder: "0px solid",
            autohidemode: false
        });
    }

    /**** Mobile Side Menu ****/
    if ($.fn.waypoint) {
        const $head = $('#ha-header');
        $('.ha-waypoint').each(function (i) {
            const $el = $(this),
                animClassDown = $el.data('animateDown'),
                animClassUp = $el.data('animateUp');

            $el.waypoint(function (direction) {
                if (direction === 'down' && animClassDown) {
                    $head.attr('class', 'ha-header ' + animClassDown);
                } else if (direction === 'up' && animClassUp) {
                    $head.attr('class', 'ha-header ' + animClassUp);
                }

                if (mainScroller) {
                    mainScroller.resize();
                }
            }, { offset: '100%' });
        });
    }

    /**** Appear JS ****/
    if ($.fn.appear) {
        const $dra = $('[data-ride="animated"]');
        $dra.appear();
        if (!$html.hasClass('ie no-ie10')) {
            $dra.addClass('appear');
            $dra.on('appear', function () {
                const $el = $(this), $ani = ($el.data('animation') || 'fadeIn');
                let $delay;
                if (!$el.hasClass('animated')) {
                    $delay = $el.data('delay') || 0;
                    setTimeout(function () {
                        $el.removeClass('appear').addClass($ani + " animated");
                    }, $delay);
                }
            });
        }

        const $na = $('.number-animator');
        $na.appear();
        $na.on('appear', function () {
            $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-animation-duration")));
        });

        const $apb = $('.animated-progress-bar');
        $apb.appear();
        $apb.on('appear', function () {
            const percent_fill = $(this).attr("data-percentage");
            $(this).animate({ width: percent_fill }, { duration: 200 });
        });
    } else {
        if ($.fn.animateNumbers) {
            $('.number-animator').each(function () {
                $(this).animateNumbers($(this).attr("data-value"), true, parseInt($(this).attr("data-animation-duration")));
            })
        }

        $('.animated-progress-bar').each(function () {
            var percent_fill = $(this).attr("data-percentage");
            $(this).animate({ width: percent_fill }, { duration: 200 });
        });
    }


    autoScrollTimeout = setTimeout(function () {
        $("html, body").animate({
            scrollTop: initScroll
        }, 700);
    }, 2500);
});
