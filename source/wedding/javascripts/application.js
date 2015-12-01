$(function(){
  var nav = $('.nav');
  var navs = $('.nav a');
  var offset = 50;
  var sections = $('.section');
  var speed = 700;
  
  function scrollHandler() {
    var dft = $(window).scrollTop();
    var active = compare(dft);
    navs.removeClass('active').eq(active).addClass('active');
    if(dft > 0) {
      nav.addClass('active');
    } else {
      nav.removeClass('active');
    }
  }
  scrollHandler();
  window.onscroll = function(){ scrollHandler(); }
    
  function compare(dft) {
    if(dft + offset < sections.eq(1).offset().top) {
      active = 0;
    } else {
      for(i = 1; i < sections.length; i++) {
        if(dft + offset - sections.eq(i).offset().top >= 0) {
          active = i;
        }
      }
    }
    return active;
  }
  
  navs.bind('click', function(e) {
    var $this = $(this);
    if( navs.index($this) == 0 ) {
      $('html,body').animate({ scrollTop:0 }, speed);
    } else {
      var scrollTo = sections.eq( navs.index($this) ).offset().top - offset;
      $('html,body').animate({ scrollTop:scrollTo }, speed);
    }
    e.preventDefault();
  });
});
