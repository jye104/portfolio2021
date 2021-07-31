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
  $(window).on('scroll', function(){
    const scrollY = $(this).scrollTop();
    const stickyWrapY = $('.sticky_wrap').offset().top;
    const move = scrollY - stickyWrapY;
    const upImgX = $('.up_img').offset().left;
    const upImgY = $('.up_img').offset().top - stickyWrapY; //부모요소에서 떨어진 거리
    const winWid = $(this).width();
    const winHei = $(this).height();
    // console.log(scrollY, stickyWrapY, upImgX, upImgY);
    //                      937        1012.4718627929688    1185.1500244140625

    const lastScale = 0.31;           //초기 이미지 scale
    const lastImg = 1920 * lastScale; //초기 이미지 px

    // 모니터 프레임 
    if (scrollY < stickyWrapY+200) {
      $('.monitor_wrap').css({overflow: 'hidden'});
      gsap.to('.monitor>img', {opacity: 1, duration: 0.5, ease: Power3.easeOut});
    } else {
      $('.monitor_wrap').css({overflow: 'visible'});
      gsap.to('.monitor>img', {opacity: 0, duration: 0.5, ease: Power3.easeOut});
    }

    if (scrollY >= stickyWrapY && scrollY < $('.bg_sulwhasoo').offset().top) {
      $('.intro_sulwhasoo').addClass('fix');

      // 브라우저 높이 만큼 스크롤이 움직이는 동안 .up_img의 크기는 커진다 scale(0.48) => scale(1)
      if (scrollY > stickyWrapY+200 && scrollY <= stickyWrapY+winHei+200) {

        const lager = (1 - lastScale)*(winWid);  // (1-0.31) = 0.69 * 1920 = 1313이 더 커져야 한다
        let ratio =  move / (lager-400) * (1-lastScale) + lastScale;
        let posX = upImgX/(winHei-200)*(move*3)
        let posY = upImgY/(winHei*2)*move
        console.log(`scale: ${ratio}, 커질크기: ${lager}, 스크롤: ${scrollY}, x좌표: ${posX}, y좌표: ${posY}`);
        if (ratio <= 1.2) {
          
          gsap.to('.up_img', {scale: ratio, left: -posX, top: -posY, duration: 0.5, ease: Power3.easeOut});
        }
      }
    }
    else {
      $('.intro_sulwhasoo').removeClass('fix');
    }


  });
});