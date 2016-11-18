# HWI-Swiper 
  ver.  0.01 

  가볍고 간편하게 사용할수 있는 스와이프

  무한 반복 스크롤시 양끝쪽셀의 복사본을 만들어 사용하는 형태가 아닌 
  노드의 있는 그대를 이용해 무한 스크롤을 처리하도록 되어 있어
  메모리 또는 처리속도면에서 빠른 스크롤에 용이함.

  기본이벤트(InitEventList)의 실행을 제어하는 스택형태 메소드가 있어 리턴값으로 
  이벤트를 간단히 제어 할수 있음.



# Swiper Layer

  - HTML LAYOUT
```html
    <div id="example">

      <div class="hwi-wrap">

        <div class="hwi-slide" >


        </div>

        <div class="hwi-slide" >

        </div>

	......

      </div>

    </div>
```

  - CSS LAYOUT
```html
    .sm-wrap {position:relative;height:100%;overflow:hidden;}
    .sm-slide {display:none;position:absolute;overflow:hidden;width:100%;height:100%;transition-timing-function: linear;}
    .sm-slide.active {display:block;}
```

  - JAVASCRIPT LAYOUT
```html
    옵션 = {
      direction : "horizontal",                              // "horizontal","vertical","both"
      transitionDuration : "300ms",                          // 스와프 이동시간
      transitionTimingFunction: "linear",                    // 스와프 이동형태
      angel: 60,                                             // 스와프 승인 이동각도
      InitEventList : ["touchstart","touchmove","touchend"]  // 이벤트 
    };
    var hwi = new hwiSwiper(노드,옵션);
```html



# Methods

  .on  : swiper에서 처리되는 기본이벤트(InitEventList)의 실행을 제어하는 스택형태 함수(push)
         리턴값에 따라 이하 처리를 제어할수 있음.

         hwi.on(event,callback)    : event : - string - 기본옵값의 InitEventList의 이벤트명
             			     callback : - boolean - 기본 undefined 오버라이딩 실행여부 

  
  .off  : swiper에서 처리되는 기본이벤트(InitEventList)의 실행을 제어하는 스택형태 함수(pop)

         hwi.off(event)    : event : - string - 기본옵값의 InitEventList의 이벤트명



  .goPage : swiper의 특정 구성셸로 이동

           hwi.goPage(num)    : num : - number - 특정구성셸로 이동
