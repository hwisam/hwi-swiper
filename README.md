간편하게 사용할수 있는 스와이프
스와프 이벤트의 추가,삭제가 용이함.

# hwi-swiper 
  ver  0.1 


# 사용법

  new hwiSwiper(노드,옵션);



  기본옵션값 : {
    direction : "horizontal",                              // "horizontal","vertical","both"
    transitionDuration : "300ms",                          // 스와프 이동시간
    transitionTimingFunction: "linear",                    // 스와프 이동형태
    angel: 60,                                             // 스와프 이동각도
    InitEventList : ["touchstart","touchmove","touchend"]  // 이벤트 
  };

  opt = {
    transitionDuration:'500ms'
  }
  
  new hwiSwiper(document.getElementById("a"),opt);

  추가 작업
