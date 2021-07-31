$(document).ready(function () {
  /* cntY배열에 담을 offset().top을 위해 우선적으로 .sticky_ss의 높이를 먼저 지정
  큰 이미지때문에 로딩시간이 길게 발생해서
  <div class="monitor_wrap"><img src="images/sulwhasoo_brand_story.jpg" height="3012" alt="모니터 속에 보이는 설화수 브랜드스토리 페이지" class="up_img"></div>
  <img src="images/sulwhasoo_news.jpg" height="1483" alt="설화수 뉴스레터 페이지" class="fade_down">
  img 태그에 height()를 선언해 놓는다  */
  $('.sticky_ss').css({
    height: $(window).width() + $('.up_img').height() + ($(window).height() - $('.monitor_wrap').height())
  });

  // 공통 변수 선언
  const $cnt = $('#contents .section'); // home, portfolio, about me
  const total = $cnt.length; // $cnt 개수
  let cntY = new Array(total); // 각 $cnt마다 높이값
  for (let i = 0; i < total; i++) {
    cntY[i] = $cnt.eq(i).offset().top;
  }
  console.log(cntY);
  
  let timerScroll = 0;
  const $ipodUl = $('#ipodScreen .ipod_list');
  const $ipodLi = $ipodUl.children();
  let listNum = 0;

    // 접근성 함수
  // 현재본문
  function a11y() {
    $cnt.eq(listNum).removeAttr('aria-hidden inert').find('a, button').removeAttr('tabIndex');
    $cnt.eq(listNum).find('.tabIndex').attr('tabIndex', 0);
    // 나머지 본문
    $cnt.eq(listNum).siblings().attr({'aria-hidden': true, inert: ''}).find('a, button, .tabIndex').attr('tabIndex', -1);
  }

  // 마우스 커서
  $('body').on('mousemove', function (e) {
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    if (mouseX <= 1700) {
      gsap.to('.first_cursor', {left: mouseX - 15, top: mouseY - 15});
      gsap.to('.second_cursor', {left: mouseX - 25, top: mouseY - 25, duration: 0.3, delay: 0.1});
    }
    if (mouseY >= cntY[2]) {$('cursor_wrap').addClass('d_n');
    } else {$('.cursor_wrap').removeClass('d_n');}
  });

  // intro ↓버튼
  $('#intro .arrow').on('click', function () {
    if ($('html, body').is(':animated')) return false;
    $('html, body').stop().animate({scrollTop: $('#welcome').offset().top}, 800, 'easeOutBack')
  });

  // ipod nav 제어
  $('#ipod .btn_ipod').on('click', function () {
    const $ipod = $('#ipod');
    const $ipodBtn = $(this);
    const $ctrlBtn = $ipod.find('.btn_ctrl button');
    const $first = $ipod.find('.first');
    const $last = $ipod.find('.last');
    const $close = $ipod.find('.close');
    const $end = $ipod.find('.end');

    // 클릭하면 .click 없애고, 탭인덱스 없애고, first에 포커스 들어오기
    $ipod.stop().animate({left: '30%'}).attr({tabIndex: -1}).find('.click').addClass('d_n').parent().parent().siblings().attr({'aria-hidden': true, inert: ''});
    $ipodUl.children('.on').children('a').focus();

    // 밖의 영역에 scroll 안되게 하기
    $('html, body').css({height: $('#contents').outerHeight(), overflow: 'hidden'});

    // #dim 동적생성
    $ipodBtn.before('<div id="dim"></div>');
    const $dim = $('#dim');
    $dim.stop().fadeIn();

    // 포커스 ipod 안에서 움직이기(first last)
    $first.on('keydown', function (e) { // 탭+shift, ← 방향키
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

    // 키보드 트래핑
    $(window).on('keydown', function (e) {
      if ($('html, body').is(':animated')) return false;
      const key = e.keyCode;
      const $tg = $(e.target);

      if ((key === 37)) { // ← 방향키
        if ($ipodUl.children('.on').children().is('.first')) {
          $first.parent().removeClass('on');
          $end.focus().parent().addClass('on');
        } else {
          $ipodUl.children('.on').removeClass('on').prev().addClass('on').children().focus();
        }
      }
      if ((key === 39)) { // → 방향키
        if ($ipodUl.children('.on').children().is('.end')) {
          $end.parent().removeClass('on');
          $first.focus().parent().addClass('on');
        } else {
          $ipodUl.children('.on').removeClass('on').next().addClass('on').children().focus();
        }
      }
      if ((key === 38)) { // ↑방향키 (재생버튼)
        if ($('html, body').is(':animated')) return false;
        listNum = $ipodUl.children('.on').index();
        $('html, body').stop().animate({
          scrollTop: cntY[listNum]
        }, 500, 'easeOutBack', a11y);
      }
      // ↓ 방향키
      if (key === 40) $close.click();
      // enter, spacebar는 따로 제어 안함
    });

    // 닫기 버튼 
    $close.on('click', function () {
      $dim.stop().fadeOut(function () {
        $(this).remove();
      });
      $ipod.stop().animate({left: '98%'}).find('.click').removeClass('d_n').parent().parent().attr({tabIndex: 0}).siblings().removeAttr('aria-hidden inert');
      $ipodBtn.focus();
      $('html, body').removeAttr('style');
    });

    // #dim 클릭
    $dim.on('click', function () {
      $close.trigger('click');
    });
    // esc 누르면 닫히기
    $(window).on('keydown', function (e) {
      if (e.keyCode === 27) $close.click();
    });

    // $ipodList (a태그) 한 번 클릭
    $ipodLi.children().on('click', function () {
      $(this).focus().parent().addClass('on').siblings().removeClass('on');
      return false;
    });

    // 더블클릭
    $ipodLi.children().dblclick(function () {
      if ($('html, body').is(':animated')) return false;
      listNum = $(this).parent().index();
      $(this).parent().addClass('on').siblings().removeClass('on');
      console.log(cntY[listNum]);
      $('html, body').stop().animate({scrollTop: cntY[listNum]}, 700, 'easeInOutBack', a11y);
    });

    // ctrlBtn
    $ctrlBtn.on('click', function () {
      if ($(this).parent().is('.btn_left')) {
        if ($ipodUl.children('.on').children().is('.first')) {
          $first.parent().removeClass('on');
          $end.focus().parent().addClass('on');
        } else {
          $ipodUl.children('.on').removeClass('on').prev().addClass('on').children().focus();
        }
      } else if ($(this).parent().is('.btn_right')) {
        if ($ipodUl.children('.on').children().is('.end')) {
          $end.parent().removeClass('on');
          $first.focus().parent().addClass('on');
        } else {
          $ipodUl.children('.on').removeClass('on').next().addClass('on').children().focus();
        }
      } else if ($(this).parent().is('.btn_play')) {
        if ($('html, body').is(':animated')) return false;
        listNum = $ipodUl.children('.on').index();
        $('html, body').stop().animate({
          scrollTop: cntY[listNum]
        }, 500, 'easeOutBack', a11y);
      }
    });
});

// scroll
$(window).on('scroll', function () {
  clearTimeout(timerScroll);
  timerScroll = setTimeout(function(){
    $ipodLi.each(function(idx){
      if ($(window).scrollTop() >= cntY[idx]){
        $(this).addClass('on').siblings().removeClass('on');
        listNum = idx;
        a11y();
      }
    });
  }, 20);
});

  // 설화수 글씨 이동 효과    
  $(window).scroll(function () {
    const scrollY = $(this).scrollTop();
    let bgSulwhasooY = new Array(6);
    for (let s = 0; s < 6; s++) {
      bgSulwhasooY[s] = (scrollY - $('.bg_sulwhasoo p').eq(s).offset().top) * 1.7
      // console.log(bgSulwhasooY[s], winScrTop);
      $('.bg_sulwhasoo p').eq(0).css({
        left: bgSulwhasooY[0] + "px"
      });
      $('.bg_sulwhasoo p').eq(1).css({
        right: bgSulwhasooY[1] + "px"
      });
      $('.bg_sulwhasoo p').eq(2).css({
        left: bgSulwhasooY[2] + "px"
      });
      $('.bg_sulwhasoo p').eq(3).css({
        right: bgSulwhasooY[3] + "px"
      });
      $('.bg_sulwhasoo p').eq(4).css({
        left: bgSulwhasooY[4] + "px"
      });
      $('.bg_sulwhasoo p').eq(5).css({
        right: bgSulwhasooY[5] + "px"
      });
    }
      // fade 효과
    const fadeScrollY = $(this).scrollTop() + $(this).height();
    $('.fade').each(function () {
      if (fadeScrollY > $(this).offset().top) $(this).addClass('on');
      else $(this).removeClass('on');
    });
  });

  // skill hover,focus 제어
  $('#container_wrap').find('.skill_list li').attr({tabIndex: 0});
  $('#container_wrap').find('.skill_list li').on({
    'mouseenter focus': function () {
      $(this).addClass('on');
    },
    'mouseleave blur': function () {
      $(this).removeClass('on');
    }
  });

  // transform(rotateY)
  $('#container_wrap .photo_hover').attr({tabIndex: 0});
  $('#container_wrap .photo_hover').on({
    focusin: function () {
      $(this).addClass('flip');
    },
    focusout: function () {
      $(this).removeClass('flip');
    }
  });

  // intro_sulwhasoo
  const stickyWrapY = $('.sticky_ss').offset().top;
  const computerX = $('.computer').offset().left;
  const computerY = $('.computer').offset().top - stickyWrapY;
  const firstScale = 0.65; //초기 .computer의 transform : scale
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

    //console.log(scrollY);
    $('.sticky_ss').css({
      height: winWid + $('.up_img').height() + (winHei - $('.monitor_wrap').height())
    }); //5422px;

    // fixed로 고정시(sticky가 적용되는 동안 .intro_sulwhasoo.fix 라는 클래스명이 추가됨) => 필요없으면 제거하기
    // if (scrollY >= stickyWrapY && scrollY < $('.bg_sulwhasoo').offset().top) {
    //   $('.intro_sulwhasoo').addClass('fix');
    // } else {
    //   $('.intro_sulwhasoo').removeClass('fix');
    // }

    // 모니터 프레임
    if (scrollY < stickyWrapY) { //스티키 상단영역
      // console.log('1) 스티키 상단영역');
      gsap.to('.computer', {scale: 0.65, left: 0, duration: 0.5, ease: Power3.easeOut
      });
      gsap.to('.up_img', {top: 0, duration: 0.5, ease: Power3.easeOut});
    } else if (scrollY < stickyWrapY + winWid) { //스티키 영역진입 부터 1920(브라우저 가로)픽셀 까지만 - .computer 크기 0.65에서 1로 확대하기
      // console.log('2) 스티키 영역진입 부터 1920(브라우저 가로)픽셀 까지만');
      const ratio = ((1 - firstScale) / winWid) * move + firstScale;
      // const ratio =  ((1-0.65) / 1903 ) * move + 0.65;
      // .computer를 가운데 위치 시키기 위한 변수: 175는 .computer가 scale 0.65일 경우 650픽셀에서 1이 되었을 경우 1000 => 1000-650 / 2 = 175
      leftPos = ((computerX - 175) - ((winWid - $('.computer').width()) / 2)) * move / winWid;
      // console.log(ratio, leftPos);

      gsap.to('.computer', {scale: ratio, left: -leftPos, duration: 0.5, ease: Power3.easeOut});
      // gsap.to('.computer', {scale: ratio, left: -move*0.2, duration: 0.5, ease: Power3.easeOut});
      gsap.to('.up_img', {top: 0, duration: 0.5, ease: Power3.easeOut});
      $('#cnt2').find('.txt_sulwhasoo').removeClass('opacity hidden');
      $('#cnt2').find('.brand_txt').removeClass('visible');

    } else if (scrollY < $('.bg_sulwhasoo').offset().top) { //스티키  영역
      // console.log('3) 스티키  영역');

      gsap.to('.computer', {scale: 1,left: -leftPos,duration: 0.5,ease: Power3.easeOut
      });
      $('#cnt2').find('.txt_sulwhasoo').addClass('opacity hidden');
      $('#cnt2').find('.brand_txt').addClass('visible');
      if (scrollY < stickyWrapY + winWid + $('.up_img').height() - $('.monitor_wrap').height()) {
        //947(sticky_ss의시작위치)+1903(winWid)+3012(.up_img높이)-517(.monitor_wrap높이)=5355
        gsap.to('.up_img', {top: -(move - winWid), duration: 0.5, ease: Power3.easeOut
        });
      }
    } else { //스티키 하단 영역
      // console.log('4) 스티키 하단 영역');

      gsap.to('.computer', {scale: 1, left: -leftPos, duration: 0.5, ease: Power3.easeOut});
      gsap.to('.up_img', {top: -2506, duration: 0.5, ease: Power3.easeOut});
      $('#cnt2').find('.txt_sulwhasoo').removeClass('opacity hidden');
      $('#cnt2').find('.brand_txt').removeClass('visible');
    }
  });

  // with wine 모달 창 제어
  $('.md_open_btn').on('click', function () {
    const $openBtn = $(this);
    const $mdBox = $($(this).attr('data-href'));
    const $closeBtn = $mdBox.find('.md_close_btn');
    const $first = $mdBox.find('[data-link="first"]');
    const $last = $mdBox.find('.md_close_btn');
    const wrapHei = $('#wrap').outerHeight();
    $closeBtn.focus();

    $('html, body').css({height: wrapHei, overflow: 'hidden'});
    $mdBox.siblings().attr({'aria-hidden': true, inert: ''});
    $mdBox.before('<div id="md_dim"></div>');
    const $mdDim = $('#md_dim');
    $mdDim.stop().fadeIn().next().css({visibility: 'visible'});
    $closeBtn.focus();

    // 키보드 제어
    $first.on('keydown', function (e) {
      console.log(e.keyCode);
      if (e.keyCode === 9 && e.shiftKey) {
        e.preventDefault();
        $last.focus();
      }
    });
    $last.on('keydown', function (e) {
      if (e.keyCode === 9 && !e.shiftKey) {
        e.preventDefault();
        $first.focus();
      }
    });

    // 닫기 버튼
    $closeBtn.on('click', function () {
      $('html, body').removeAttr('style');
      $mdDim.stop().fadeOut(function () {
        $mdDim.remove();
      });
      $mdBox.css('visibility', 'hidden').siblings().removeAttr('aria-hidden inert');
      $openBtn.focus();
    });

    $mdDim.on('click', function () {
      $closeBtn.trigger('click');
    });

    $(window).on('keydown', function (e) {
      if (e.keyCode === 27) $closeBtn.click();
    });

    // 모달 안에 효과
    $('.md_box .md_sticky img').attr({tabIndex: 0});

    $('#modal1').on('scroll', function () {
      const mdScrollY = $(this).scrollTop();
      const $mdCnt = $('.md_sticky .hover_wrap');

      $mdCnt.eq(0).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 220) $mdCnt.eq(1).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 500) $mdCnt.eq(2).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 920) $mdCnt.eq(3).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 1310) $mdCnt.eq(4).addClass('on').siblings().removeClass('on');
    });


    $('#modal3').on('scroll', function () {
      const mdScrollY = $(this).scrollTop();
      const $mdCnt = $('#modal3 .md_sticky').find('.hover_wrap');
      console.log(mdScrollY);
      $mdCnt.eq(0).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 270) $mdCnt.eq(1).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 820) $mdCnt.eq(2).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 1360) $mdCnt.eq(3).addClass('on').siblings().removeClass('on');
      if (mdScrollY >= 1910) $mdCnt.eq(4).addClass('on').siblings().removeClass('on');
    });
    $('.md_box').trigger('scroll');

    const $loupe = $('.md_sticky').find('.loupe');
    $loupe.on({
      'mouseenter focusin': function () {
        $(this).next().next().next().fadeIn();
      },
      'mouseleave focusout': function () {
        $(this).next().next().next().fadeOut();
      }
    });
  });
  
  // #cnt3 sticky 버튼 클릭 효과
  $('#cnt3').find('.sticky_btn .normal').parent().addClass('on').siblings().removeClass('on');
  $('#cnt3').find('.sticky_btn button').on('click', function () {
    if ($(this).is('.normal')) {
      $(this).parent().addClass('on').siblings().removeClass('on');
      $('#cnt3').removeClass('spring summer fall winter');
    } else if ($(this).is('.spring')) {
      $(this).parent().addClass('on').siblings().removeClass('on');
      $('#cnt3').addClass('spring').removeClass('summer fall winter');
    } else if ($(this).is('.summer')) {
      $(this).parent().addClass('on').siblings().removeClass('on');
      $('#cnt3').addClass('summer').removeClass('spring fall winter');
    } else if ($(this).is('.fall')) {
      $(this).parent().addClass('on').siblings().removeClass('on');
      $('#cnt3').addClass('fall').removeClass('spring summer winter');
    } else if ($(this).is('.winter')) {
      $(this).parent().addClass('on').siblings().removeClass('on');
      $('#cnt3').addClass('winter').removeClass('spring summer fall');
    }
  });

  $('#cnt3').find('.sticky_btn button').on('click', function(){
    const $cntWrap = $('#container_wrap');
    const $pageLi = $('.pagination li');
    const $cnt3 = $('#container_wrap .container');
    let cnt3Y
    const cnt3Total = $cnt3.length;
    const maxStep = cnt3Total - 1;
    let winWid = $(window).width();
    let tgNum = 0;
    let timerResize = 0;
    let timerScroll = 0;
    let timerWheel = 0;
    if ($(this).is('.normal')){
      $cntWrap.removeAttr('style aria-live');
      $cntWrap.children().removeAttr('aria-hidden inert').addClass('fade');

    }
    if ($(this).hasClass('spring')){
      if($(this).parent().hasClass('on')){
        $pageLi.eq(tgNum).addClass('on').siblings().removeClass('on');
        $cntWrap.css({width: cnt3Total * winWid}).attr({'aria-live': 'polite'});
        $cntWrap.children().removeClass('fade');

        $pageLi.children().on('click', function(){
        if($cntWrap.is(':animated')) return false;
        tgNum = $(this).parent().index();
        $pageLi.eq(tgNum).addClass('on').siblings().removeClass('on');
        if ($cntWrap.hasClass('spring')){
          $cntWrap.stop().animate({marginLeft: -tgNum * winWid}, 500, cnt3A11y);
        }
        });
        // prev, next 버튼
        $('#cnt3 .p_n button').on('click', function (){
          const btnNum = $(this).index();
          if ($cntWrap.is(':animated')) return false;
          if(btnNum === 0 && tgNum === 0) return false;
          else if(btnNum === 1 && tgNum === maxStep) return false; 
          btnNum === 0? tgNum-- : tgNum++;
          $pageLi.eq(tgNum).addClass('on').siblings().removeClass('on');
          // console.log(tgNum);
          $cntWrap.stop().animate({marginLeft: -tgNum * winWid}, 500, cnt3A11y);
        });

        $(document).on('keydown', function(e){
          if ($cntWrap.is(':animated')) return false;
          const key = e.keyCode;
          const $tg = $(e.target);
          console.log(key);
          if ((key == 37) && tgNum > 0) tgNum--; // 왼쪽방향키
          else if ((key === 39) && tgNum < cnt3Total-1) tgNum++; //  오른쪽 방향키
          else if ((key === 13 || key === 32) && ($tg.is('.p_n button'))) tgNum = $tg.index();
          else if ((key === 13 || key === 32) && ($tg.is('.page_btn'))) tgNum = $tg.parent().index();
          
          $pageLi.eq(tgNum).addClass('on').siblings().removeClass('on');
          $cntWrap.stop().animate({marginLeft: -tgNum * winWid}, 500, cnt3A11y);
          // console.log(tgNum);
        });      
      }  
    }
    if ($(this).hasClass('summer')){
      $cntWrap.removeAttr('style aria-live');
      $cntWrap.children().removeAttr('aria-hidden inert')
      $(window).on('resize',function(){
        clearTimeout(timerResize);
        timerResize = setTimeout(function(){
          cnt3Y = new Array(cnt3Total);
          for (let c = 0; c < cnt3Total; c++){
          cnt3Y[c] = $cnt3.eq(c).offset().top;
          }         
          $('html, body').stop().animate({scrollTop: cnt3Y[tgNum]}, 700, 'easeOutBack');
          cnt3A11y();
        }, 50);
      });
      $(window).trigger('resize');

      $(window).on('scroll', function(){
        clearTimeout(timerScroll);
        timerScroll = setTimeout(function(){
          $pageLi.each(function(idx){
            if ($(window).scrollTop() >= cnt3Y[idx]){
              $(this).addClass('on').siblings().removeClass('on');
              tgNum = idx;
              cnt3A11y();
            }
          });
        }, 20);
      });

      $pageLi.children().on('click', function () {
        if ($('html, body').is(':animated')) return false;
        tgNum = $(this).parent().index();
        console.log(tgNum, cnt3Y[tgNum]);
        $(this).parent().addClass('on').siblings().removeClass('on');
       $('html, body').stop().animate({scrollTop: cnt3Y[tgNum]}, 700, cnt3A11y);
      });

      $(document).on('keydown', function(e){
        if ($('html, body').is(':animated')) return false;
        const key = e.keyCode;
        if (key === 38 && tgNum > 0) tgNum--; // 상단 방향키
        else if (key === 40 && tgNum < cnt3Total) tgNum++; // 하단 방향키
        
        $('html, body').stop().animate({scrollTop: cnt3Y[tgNum]}, 700, cnt3A11y);
      });
    }
    if ($(this).is('.fall')){      
      $cntWrap.removeAttr('style aria-live');
      $cntWrap.children().removeAttr('aria-hidden inert').removeClass('fade');
      const winHei = $(window).height();
      const stickyY = $('#container_wrap').offset().top;
      $(window).on('scroll', function(){
        const winScrollY = $(this).scrollTop();
        $cnt3.each(function(idx){
          console.log(idx);
          if (winScrollY > stickyY + winHei*idx) {$(this).addClass('on').siblings().removeClass('on');}
         });
      });
    }
    if ($(this).is('.winter')){
      $cntWrap.removeAttr('style aria-live');
      $cntWrap.children().removeAttr('aria-hidden inert').addClass('fade');
    }   
      // cnt3 안의 본문
  function cnt3A11y() {
    // 현재 본문
    $cntWrap.find('.container').eq(tgNum).removeAttr('aria-hidden inert').find('a, button').removeAttr('tabIndex');
    $cntWrap.find('.container').eq(tgNum).find('.tabIndex').attr('tabIndex', 0)
    // 나머지 본문들
    $cntWrap.find('.container').eq(tgNum).siblings().attr({'aria-hidden': true,      'inert': ''}).find('a, button, .tabIndex').attr('tabIndex', -1);
  }
  });
});