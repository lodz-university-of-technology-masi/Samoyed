//UP
$(".scrollup").click((e) => {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $("body").offset().top
    }, 1000);
});

//pokaż podczas przewijania
$(window).scroll(() => {
    if ($(this).scrollTop() > 300) $('.scrollup').fadeIn();
    else $('.scrollup').fadeOut();
}); 