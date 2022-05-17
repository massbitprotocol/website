$(document).ready(function () {
    // AOS.init();
    $(window).scroll(function () {
        var wScroll = $(this).scrollTop();
        if (wScroll >= 80) {
            $('.navbar').addClass('mb-navbar-fixed');
        } else {
            $('.navbar').removeClass('mb-navbar-fixed');
        }


    });

    if ($(window).scrollTop() >= 80) {
        $('.navbar').addClass('mb-navbar-fixed');
    } else {
        $('.navbar').removeClass('mb-navbar-fixed');
    }


    const config = {
        loop: true,
        margin: 30,
        responsiveClass: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2,
                margin: 10,
                stagePadding: 40
            },
            600: {
                items: 3
            },
            1000: {
                items: 6
            }
        }
    }
    $(".mb-team-experience-slide").owlCarousel(config);
    $(".mb-partners-slide").owlCarousel(config);

    $(".navbar-nav .nav-link").click(function (e) {
        const targetEl = $(this).attr('href');
        if (targetEl != '#' && targetEl.startsWith('#')) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: ($(targetEl).offset().top - 70)
            }, 500);
        }
    });

    $('#to_top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    })

    $('.mb-right-box-close').click(function (e) {
        e.preventDefault();
        $('.mb-right-box-wrap').fadeOut(300);
        $('.mb-right-box-wrap').removeClass('show');
    })

    window.setTimeout(() => {
        $('#wr_loading').fadeOut();
    }, 800)

    window.setTimeout(() => {
        $('.mb-right-box-wrap').fadeIn(300);
        $('.mb-right-box-wrap').addClass('show');
    }, 1500)
});
$(document).ready(function () {
    window.addEventListener("scroll", handleToggleScrollToTop);

    function handleToggleScrollToTop(e) {
        const windowx = e.currentTarget;
        if (windowx.scrollY > 200) {
            // $('#to_top').fadeIn(300);
        } else {
            // $('#to_top').fadeOut(300);
        }
    }
    setSlide();

    $(window).on('resize', () => {
        setSlide();
    })
})

function setSlide() {
    if ($(window).width() < 768) {
        $('#slideMobile').addClass('owl-carousel');
        $("#slideMobile").owlCarousel({
            loop: true,
            // autoplay: true,
            dots: true,
            margin: 30,
            center: true,
            items: 1,
            autoplayTimeout: 3000
        });
    } else {
        if (typeof $('#slideMobile').data('owl.carousel') != 'undefined') {
            $('#slideMobile').data('owl.carousel').destroy();
            $('#slideMobile').removeClass('owl-carousel');
        }
    }

}

function hideBanner() {
    $('body').removeClass('testnet');
    $('.mb-banner-testnet').hide(300);
}
var noticeModalEl = document.getElementById("noticeModal");
if (noticeModalEl) {
    var noticeModal = new bootstrap.Modal(noticeModalEl, {});
    window.onload = function () {
        window.setTimeout(() => {
            noticeModal.show();
        }, 2000)
    };
    noticeModalEl.addEventListener('hidden.bs.modal', function (event) {
        $('body').addClass('testnet');
        $('.mb-banner-testnet').fadeIn(300);
    })
}