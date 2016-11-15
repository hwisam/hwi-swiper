    var hwiSwiper = (function(__window) {
		var 
			clone = function (obj) {
				if (obj === null || typeof(obj) !== 'object')
					return obj;

				var 
					copy = obj.constructor();

				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) {
						copy[attr] = obj[attr];
					}
				}
				return copy;
			},
			extend = function extend(){
				for(var i=1; i<arguments.length; i++)
					for(var key in arguments[i])
						if(arguments[i].hasOwnProperty(key))
							arguments[0][key] = arguments[i][key];
				return arguments[0];
			},
			createCustomEvent = function(evt,obj) {
				var 
					evt;

				if(typeof __window.CustomEvent == "function" ) {
					evt = new __window.CustomEvent(evt, extend({bubbles: true, cancelable: true},obj));
				} else {
//					evt = __window.document.createEvent(evt);
//					evt.initEvent(eventName, true, true);
//					evt = extend(evt,obj);
				}

				return evt;
			}
		
		return function (container, opt) {

			this.el = container;
			this.wrap = this.el.getElementsByClassName("sm-wrap")[0];
			this.elWidth = this.el.clientWidth;
			this.elHeight = this.el.clientHeight;

			this.defOpt = {
				direction : "horizontal",  // "horizontal","vertical","both"
				transitionDuration : "300ms",
				transitionTimingFunction: "linear",
				angel: 60,
				InitEventList : ["touchstart","touchmove","touchend"]
			};
			this.defOpt = extend(this.defOpt,opt);

			this.eventList = {};
			this.defOpt.InitEventList.forEach(function(v,i) {
				this.eventList["on"+v] = [];
			}.bind(this));
			this.eventAddrPoint = {}; // address event

			this.pos = {
				isMovingContinuity : undefined, //  undefined : 판단미정 , true , false 
				startX:0,        // 터치시작 x좌표
				startY:0,        // 터치시작 y좌표
				x:0,             // x 축이동
				y:0,             // y 축 이동
				momento:{        // 모멘토(절대값)
					x:0,
					y:0
				}
			};

			this.__proto__.isDirecBoth = function(e) {
				if (this.defOpt.direction == "both")
					return true;
			};
			this.__proto__.isDirecHoriz = function(e) {
				if (this.defOpt.direction == "horizontal")
					return true;
			};
			this.__proto__.isDirecvert = function(e) {
				if (this.defOpt.direction == "vertical")
					return true;
			};

			this.__proto__.ontouchstart = function(e) {
				this.pos.isMovingContinuity = undefined;

				this.SlideNode.node[this.SlideNode.pNode].style.transitionDuration = "0ms";
				this.SlideNode.node[this.SlideNode.aNode].style.transitionDuration = "0ms";
				this.SlideNode.node[this.SlideNode.nNode].style.transitionDuration = "0ms";

				this.pos.startX = e.touches[0].pageX;
				this.pos.startY = e.touches[0].pageY;
			}

			this.__proto__.validateTouchMove = function(x,y) {
				var
					angle,
					_x = Math.pow(x,2),
					_y = Math.pow(y,2),
					delta = Math.sqrt(_x+_y);

				// 이동거리의 각도를 구하기위한 최소한 밑변값이 확보 됬는지 확인함
				if ( delta>6 ) {
					angle = Math.atan2(-(y), x) * 180 / Math.PI;
				}
				// 스크롤 or 플리킹 체크해줌
				if (angle === undefined) {
					this.pos.isMovingContinuity = false;
				}
				if (this.pos.isMovingContinuity === undefined ) {
					if ((angle || angle==0) && (Math.abs(angle)<=this.defOpt.angel || Math.abs(angle)>=(180-this.defOpt.angel)) ) {
						this.pos.isMovingContinuity = true;
					} else {
						this.pos.isMovingContinuity = false;
					}
				}
			}

			this.__proto__.ontouchmove = function(e) {
				var
					x = (e.touches[0].pageX-this.pos.startX),
					y = (e.touches[0].pageY-this.pos.startY),
					z = 0,
					realX = this.isDirecHoriz() ? x : 0,
					realY = this.isDirecvert() ? y : 0,
					realZ = 0;

				this.pos.momento.x = (this.pos.x > x) ? this.pos.x-x : x-this.pos.x ;
				this.pos.momento.y = (this.pos.y > y) ? this.pos.y-y : y-this.pos.y ;
				this.pos.x = x;
				this.pos.y = y;

				this.validateTouchMove(x,y);  // this.pos.isMovingContinuity

				if (this.pos.isMovingContinuity === true) {
					e.preventDefault();
					e.stopPropagation();
					this.SlideNode.node[this.SlideNode.pNode].style.transform = 'translate3d(' + realX + 'px, ' + realY + 'px, ' + z + 'px)';
					this.SlideNode.node[this.SlideNode.aNode].style.transform = 'translate3d(' + (realX-this.elWidth) + 'px, ' + realY + 'px, ' + z + 'px)';
					this.SlideNode.node[this.SlideNode.nNode].style.transform = 'translate3d(' + (realX+this.elWidth) + 'px, ' + realY + 'px, ' + z + 'px)';
				}
			}
			this.__proto__.ontouchend = function(e) {
				e.preventDefault();
				e.stopPropagation();

				this.SlideNode.setPresentPos(this);
				this.animate();
			}

			
			// 이벤트 바인드
			this.__proto__._attachEvent = function() {
				var 
					aEvt = this.defOpt.InitEventList,
					that = this,
					target = that.el,
					returnFn;

				aEvt.forEach(function(v,i) {
					var
						_tmp = {};

					target.addEventListener(v,returnFn=function(e) {
						that["on"+v](e);
					});

					_tmp[v]=returnFn;
					that.eventAddrPoint = extend(that.eventAddrPoint,_tmp);
				});

			};
			// 이벤트 언바인드
			this.__proto__._detachEvent = function() {
				var
					target = this.el,
					aEvt = this.defOpt.InitEventList;

				aEvt.forEach(function(v,i) {
					this.el.removeEventListener(v,this.eventAddrPoint[v]);
				}.bind(this));
			};
			// 초기 마크업 셋팅
			this.__proto__._buildInitHtml = function() {
				this.setSlideNode();
			};
			// 이동
			this.__proto__.goPage = function(num) {
				this.SlideNode.setPresentPos(num);
				this.animate();
			};
			this.__proto__.animate = function() {
				var 
					x=0,y=0,z=0;

				this.on("touchstart",function() { return false; });
				this.on("touchmove",function() { return false; });
				this.on("touchend",function() { return false; });
				setTimeout(function() {
					this.off("touchstart");
					this.off("touchmove");
					this.off("touchend");
				}.bind(this),parseInt(this.defOpt.transitionDuration)-50);

				this.SlideNode.node[this.SlideNode.pNode].style.transitionDuration = this.defOpt.transitionDuration;
				this.SlideNode.node[this.SlideNode.aNode].style.transitionDuration = this.defOpt.transitionDuration;
				this.SlideNode.node[this.SlideNode.nNode].style.transitionDuration = this.defOpt.transitionDuration;

				
				this.SlideNode.node[this.SlideNode.pNode].style.transform = 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)';
				this.SlideNode.node[this.SlideNode.aNode].style.transform = 'translate3d(' + (x-this.elWidth) + 'px, ' + y + 'px, ' + z + 'px)';
				this.SlideNode.node[this.SlideNode.nNode].style.transform = 'translate3d(' + (x+this.elWidth) + 'px, ' + y + 'px, ' + z + 'px)';


			};
			this.SlideNode = {
				node : [],
				isIng : false,
				pNode : 0,  // 현재뷰
				nNode : 0,  // 다음뷰
				aNode : 0,  // 이전뷰
			};
			this.SlideNode.__proto__.setPresentPos = function(that) {
				var
					_len = 0;

				if (typeof that == "object") {
					if (that.pos.isMovingContinuity && Math.abs(that.pos.x) >= 50 ) {
						if (that && that.pos) {
							if (that.pos.x > 0) {
								this.pNode = (this.pNode-1 < 0) ? this.node.length-1 : this.pNode-1 ;
							} else {
								this.pNode = (this.pNode+1 >= this.node.length)? 0 : this.pNode+1 ;
							}
						}
					}
				} else if (typeof that == "number" ) {
					this.pNode = that
				}
				this.aNode = (this.pNode-1 < 0) ? this.node.length-1: this.pNode-1 ;
				this.nNode = (this.pNode+1 >= this.node.length) ? 0: this.pNode+1 ;
				//console.log(this.aNode+" : "+this.pNode+" : "+this.nNode)
				for(_len;_len<this.node.length;_len++) {
					this.node[_len].className = this.node[_len].className.replace(" active","");
				}
				this.node[this.pNode].className = this.node[this.pNode].className+" active";
				this.node[this.nNode].className = this.node[this.nNode].className+" active";
				this.node[this.aNode].className = this.node[this.aNode].className+" active";
			}

			// 초기 마크업 셋팅
			this.__proto__.setSlideNode = function() {

				this.SlideNode.node = this.wrap.children;
				
				//this.SlideNode.setPresentPos();
			};

			this.__proto__.init = function () {
//				var
//					evt = createCustomEvent("touchend",{touches : [{pageX : 0,pageY : 0}]});
				this._buildInitHtml();
				this._attachEvent();
				this.goPage(0);
				//this.el.dispatchEvent(evt);
			};

			// 이벤트 언바인드
			this.__proto__.on = function(eventType,callBack) {

				var
					_fnStr = "on"+eventType,
					_fn = this[_fnStr],
					_callBack = (function() {
						var
							_len = 0;

						return function() {
								if (typeof this.eventList[_fnStr][_len] != "function" ) {
									_len = 0;
									return true;
								} else if (this.eventList[_fnStr][_len](arguments[0])) {
									_len++;

									if ( _len >= this.eventList[_fnStr].length) {
										_len = 0;
										return true;
									} else {
										return _callBack(arguments[0]);
									}
								}
								else {
									_len = 0;
									return false
								};
						}.bind(this);
					}.bind(this))();

				this.eventList[_fnStr].push(callBack.bind(this));

				if (!this.hasOwnProperty(_fnStr)) {
					this[_fnStr] = function() {
						if (_callBack(arguments[0])) {
							_fn.apply(this,arguments)
						}
					}
				}
			};
			this.__proto__.off = function(eventType) {
				var
					_fnStr = "on"+eventType,
					_fn = this[_fnStr];

				if (this.hasOwnProperty(_fnStr)) {
					this.eventList[_fnStr].pop();
				}
			};

			this.init();
		}
	})(window);