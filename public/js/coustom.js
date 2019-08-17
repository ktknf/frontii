
var $ = jQuery.noConflict();
$(document).ready(function(){
    //add class img-responsive
    $('img').addClass('img-responsive');
     /*
    =clicked botton go to up
    ---------------------------------------------*/

        // $toosweb(window).scroll(function(){
        //     if ($toosweb(this).scrollTop() > 100) {
        //         $toosweb('#go-top').fadeIn();
        //     } else {
        //         $toosweb('#go-top').fadeOut();
        //     }
        // });

    //Click event to scroll to top
    //     $toosweb('#go-top').click(function(){
    //         $toosweb('html, body').animate({scrollTop : 0},800);
    //         return false;
    //     });

    //swich toggle in tab index
    $('.btn-toggle').click(function() {
        $(this).find('.btn').toggleClass('active');
        if ($(this).find('.btn-primary').length>0) {
            $(this).find('.btn').toggleClass('btn-primary');
        }
        $(this).find('.btn').toggleClass('btn-default');

    });

    if($('.content-special').length){
        $('.list-item-spe').slick({
            autoPlay: true,
            infinite: true,
            centerMode: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: false,
            rtl: true,
            centerPadding: '0',
            responsive: [
                {
                    breakpoint: 990,
                    settings: {
                        centerPadding: '0',
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        centerPadding: '0',
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
    /*------------------------------*/
    /* modal login step
    /*------------------------------*/

});
