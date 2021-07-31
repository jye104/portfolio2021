$(document).ready(function () {
  let listNum
  // 마우스 커서 효과
  $('body').on('mousemove', function (e) {
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    //console.log(mouseX)
  //   if(mouseX >= 1530){
  //       $('body').addClass('overflowX');
  //       gsap.to('.cursor', {left: mouseX - 100, top: mouseY - 100});
  //   } else{
  //   gsap.to('.cursor', {left: mouseX - 100, top: mouseY - 100});
  // }


    // gsap.to('.second_cursor', {duration: 0.3, delay: 0.1});
  });

  /*   $('body').addClass('overflowy');
  $('#intro').stop().delay(8000).fadeOut('slow', function () {
    $('body').removeClass('overflowy');
  }); */

  //  ipod 제어 
  $('#ipod .btn_ipod').on('click', function () {
    const $ipod = $('#ipod');
    const $ipodBtn = $(this);
    const $ctrlBtn = $ipod.find('.btn_ctrl button');
    const $ipodList = $('#ipodScreen .ipod_list a');
    const $first = $ipod.find('.first');
    const $last = $ipod.find('.last');
    const $close = $ipod.find('.close');
    const $end = $ipod.find('.end');
    const $cnt = $('#contents .section');
    const total = $cnt.length;
    let cntY = new Array(total);
    for (let i = 0; i < total; i++) {
      cntY[i] = $cnt.eq(i).offset().top;
    }
    console.log($end, typeof $end);

    // 클릭하면 나오고 '.click' 없애기
    $ipodBtn.parent($ipod).stop().animate({left: '50%',marginLeft: '-238.5px'}).find('.click').addClass('d_n').parent().attr({
      tabIndex: -1
    });

    // #dim 동적생성
    $ipod.siblings().attr({
      'aria-hidden': true, inert: ''
    });
    $ipodBtn.before('<div id="dim"></div>');
    const $dim = $('#dim');
    $dim.stop().fadeIn();

    // 키보드 트래핑 - first, last 요소 제어
    $first.on('keydown', function (e) {
      console.log(e.keyCode); // tab -> 9
      if (e.shiftKey && e.keyCode === 9) {
        e.preventDefault();
        $last.focus();
      }
    });
    $last.on('keydown', function (e) {
      if (!e.shiftKey && e.keyCode === 9) {
        e.preventDefault();
        $first.focus();
      }
    });

    // 닫기버튼
    $close.on('click', function () {
      $dim.stop().fadeOut(function () {
        $(this).remove();
      });
      $ipod.stop().animate({
        left: '98%',
        marginLeft: 0
      }).find('.click').removeClass('d_n').parent().attr({
        tabIndex: 0
      }).siblings().removeAttr('aria-hidden inert');
      $ipodBtn.focus();
    });
    // #dim 클릭
    $dim.on('click', function () {
      $close.trigger('click');
    });
    // esc로 닫기
    $(window).on('keydown', function (e) {
      if (e.keyCode === 27) $close.click();
    });

    // $ipodList(a태그) 제어
    $ipodList.on('click', function () {
      $ipodList.parent().removeClass('on');
      $(this).parent().addClass('on');
      return false;
    });
    $ipodList.dblclick(function () {
      if ($('html, body').is(':animated')) return false;
      listNum = $(this).parent().index();
      // console.log(listNum)
      $('html, body').stop().animate({
        scrollTop: cntY[listNum]
      }, 700, 'easeOutBack', a11y);
    });

    // .btn_ctrl 제어
    $ctrlBtn.on('click', function () {
      if ($(this).parent().is('.btn_left')) {
        if ($ipodList.parent('.on').children().is('.first')) {
          $first.parent().removeClass('on');
          $end.parent().addClass('on');
        } else {
          $ipodList.parent('.on').removeClass('on').prev().addClass('on');
        }
      } else if ($(this).parent().is('.btn_right')) {
        if ($ipodList.parent('.on').children().is('.end')) {
          $end.parent().removeClass('on');
          $first.parent().addClass('on');
        } else {
          $ipodList.parent('.on').removeClass('on').next().addClass('on');
        }
      } else if ($(this).parent().is('.btn_play')) {
        if ($('html, body').is(':animated')) return false;
        listNum = $ipodList.parent('.on').index();
        $('html, body').stop().animate({
          scrollTop: cntY[listNum]
        }, 700, 'easeOutBack', a11y);
      }
    });

    // 접근성 추가
    function a11y() {
      // 현재 본문
      $cnt.eq(listNum).removeAttr('aria-hidden inert').find('a, button').removeAttr('tabIndex');
      $cnt.eq(listNum).find('.tabIndex').attr('tabIndex', 0)
      // 나머지 본문들
      $cnt.eq(listNum).siblings().attr({
        'aria-hidden': true,
        'inert': ''
      }).find('a, button, .tabIndex').attr('tabIndex', -1);
    }
  });

  // portfolio
  // $(window).on('scroll', function(){
  //   const scrollY = $(this).scrollTop()/*  + $(this).height()*2/3 */;
  //   console.log(scrollY);

  //   if(scrollY > $('#cnt2').offset().top + 20){
  //     //gsap.to('.computer', {left: -300, top: 600, transform: 'scale(1)'});
  //     $('.intro_sulwhasoo').addClass('on');
  //   } else {
  //     $('.intro_sulwhasoo').removeClass('on');
  //   }

  //     if(scrollY >= 1355){
  //       $('.brand_txt').addClass('on');
  //     } else{
  //       $('.brand_txt').removeClass('on');
  //     }
  // });

  // intro_sulwhasoo
  const stickyWrapY = $('.sticky_wrap').offset().top;
  const computerX = $('.computer').offset().left;
  const computerY = $('.computer').offset().top - stickyWrapY;
  const lastScale = 0.65;           //초기 .computer의 transform : scale
  // console.log(stickyWrapY, computerX, computerY, $('.bg_sulwhasoo').offset().top);
  // 947    969.234375    205.050048828125      5879

  
  $(window).on('scroll', function () {
    const scrollY = $(this).scrollTop();
    const move = scrollY - stickyWrapY;
    const winWid = $(this).width();
    const winHei = $(this).height();
    let leftPos;
    // console.log(scrollY, move, winWid, winHei);
    // 957  10    1903    947
    
    $('.sticky_wrap').css({height: winWid + $('.up_img').height() + (winHei -$('.monitor_wrap').height())});  //5422px;

    // fixed로 고정시(sticky가 적용되는 동안 .intro_sulwhasoo.fix 라는 클래스명이 추가됨) => 필요없으면 제거하기
    if (scrollY >= stickyWrapY && scrollY < $('.bg_sulwhasoo').offset().top) {
      $('.intro_sulwhasoo').addClass('fix');
    } else {
      $('.intro_sulwhasoo').removeClass('fix');
    }

    // 모니터 프레임
    if (scrollY < stickyWrapY) { //스티키 상단영역
      // console.log('1) 스티키 상단영역');

      gsap.to('.computer', {scale: 0.65, left: 0, duration: 0.5, ease: Power3.easeOut});
      gsap.to('.up_img', {top: 0, duration: 0.5, ease: Power3.easeOut});
    } else if (scrollY < stickyWrapY + winWid) { //스티키 영역진입 부터 1920(브라우저 가로)픽셀 까지만 - .computer 크기 0.65에서 1로 확대하기
      // console.log('2) 스티키 영역진입 부터 1920(브라우저 가로)픽셀 까지만');

      const ratio =  ((1-lastScale) / winWid ) * move + lastScale;
      // const ratio =  ((1-0.65) / 1903 ) * move + 0.65;
      // .computer를 가운데 위치 시키기 위한 변수: 175는 .computer가 scale 0.65일 경우 650픽셀에서 1이 되었을 경우 1000 => 1000-650 / 2 = 175
      leftPos = ((computerX-175) - ((winWid - $('.computer').width()) / 2)) * move / winWid;
      // console.log(ratio, leftPos);

      gsap.to('.computer', {scale: ratio, left: -leftPos, duration: 0.5, ease: Power3.easeOut});
      // gsap.to('.computer', {scale: ratio, left: -move*0.2, duration: 0.5, ease: Power3.easeOut});
      gsap.to('.up_img', {top: 0, duration: 0.5, ease: Power3.easeOut});
    } else if (scrollY < $('.bg_sulwhasoo').offset().top) { //스티키  영역
      console.log('3) 스티키  영역');

      gsap.to('.computer', {scale: 1, left: -leftPos, duration: 0.5, ease: Power3.easeOut});

      if (scrollY < stickyWrapY + winWid + $('.up_img').height() - $('.monitor_wrap').height()) {  
        //947(sticky_wrap의시작위치)+1903(winWid)+3012(.up_img높이)-517(.monitor_wrap높이)=5355
        gsap.to('.up_img', {top: -(move-winWid), duration: 0.5, ease: Power3.easeOut});
      }
    } else {  //스티키 하단 영역
      // console.log('4) 스티키 하단 영역');

      gsap.to('.computer', {scale: 1, left: -leftPos, duration: 0.5, ease: Power3.easeOut});
      gsap.to('.up_img', {top: -2506, duration: 0.5, ease: Power3.easeOut});
    }
  });
  $(window).trigger('scroll');
});