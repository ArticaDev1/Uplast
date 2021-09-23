const Dev = true;

const breakpoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}
const $body = document.body;
const $wrapper = document.querySelector('.wrapper');
const $header = document.querySelector('.header');

const animation_duration_1 = 0.15;

import 'lazysizes';
import {gsap} from "gsap";
gsap.defaults({
  ease: "power2.inOut", 
  duration: 1
});
import { disablePageScroll, enablePageScroll, getPageScrollBarWidth } from 'scroll-lock';
import Inputmask from "inputmask";
import SwipeListener from 'swipe-listener';
import Swiper, {Navigation, Pagination, Lazy, Autoplay} from 'swiper/core';
Swiper.use([Navigation, Pagination, Lazy, Autoplay]);
import SlimSelect from 'slim-select';
import tippy, {followCursor} from 'tippy.js';

//animations
gsap.registerEffect({
  name: "fadeIn",
  effect: ($element, config) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha: 1, duration: config.duration,
      onStart: () => {
        $element.forEach($this => {
          $this.classList.add('d-block');
        })
      },
      onComplete: () => {
        $element.forEach($this => {
          gsap.set($this, {clearProps: "all"});
        })
      },
      onReverseComplete: () => {
        $element.forEach($this => {
          gsap.set($this, {clearProps: "all"});
          $this.classList.remove('d-block');
        })
      }
    })
  },
  extendTimeline: true
});

function mobile() {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    return true;
  } else {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //set scrollbar width
  document.documentElement.style.setProperty('--scrollbar-width', `${getPageScrollBarWidth()}px`);

  CustomInteractionEvents.init();
  Nav.init();
  Location.init();
  Search.init();
  Modal.init();
  //
  tippy('[data-tippy-content]', {
    followCursor: true,
    plugins: [followCursor],
    duration: 150,
    placement: 'bottom'
  });

  const activeFunctions = new ActiveFunctions();
  activeFunctions.create();
  activeFunctions.add(HomeBanner, '.home-banner');
  activeFunctions.add(TabSlider, '.tab-slider');
  activeFunctions.add(AdvantagesSlider, '.advantages-slider');
  activeFunctions.add(Partners, '.section-partners');
  activeFunctions.add(Map, '.contacts__map');
  activeFunctions.add(Select, '.select select');
  activeFunctions.add(Card3d, '[data-3d="parent"]');
  activeFunctions.init();
});


const CustomInteractionEvents = Object.create({
  targets: {
    value: '[data-custom-interaction], a, button, label, .scrollbar-thumb, .ss-single-selected, .ss-option'
  },
  touchEndDelay: {
    value: 100
  }, 
  init() {
    this.events = (event) => {
      let $targets = [];
      $targets[0] = event.target!==document?event.target.closest(this.targets.value):null;
      let $element = $targets[0], i = 0;
  
      while($targets[0]) {
        $element = $element.parentNode;
        if($element!==document) {
          if($element.matches(this.targets.value)) {
            i++;
            $targets[i] = $element;
          }
        } 
        else {
          break;
        }
      }
  
      //touchstart
      if(event.type=='touchstart') {
        this.touched = true;
        if(this.timeout) clearTimeout(this.timeout);
        if($targets[0]) {
          for(let $target of $targets) $target.setAttribute('data-touch', '');
        }
      } 
      //touchend
      else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
        this.timeout = setTimeout(() => {this.touched = false}, 500);
        if($targets[0]) {
          setTimeout(()=>{
            for(let $target of $targets) {
              $target.removeAttribute('data-touch');
            }
          }, this.touchEndDelay.value)
        }
      } 
      //mouseenter
      if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
        $targets[0].setAttribute('data-hover', '');
      }
      //mouseleave
      else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
        $targets[0].removeAttribute('data-click');
        $targets[0].removeAttribute('data-hover');
      }
      //mousedown
      if(event.type=='mousedown' && !this.touched && $targets[0]) {
        $targets[0].setAttribute('data-click', '');
      } 
      //mouseup
      else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
        $targets[0].removeAttribute('data-click');
      }
    }
    document.addEventListener('touchstart',  this.events);
    document.addEventListener('touchend',    this.events);
    document.addEventListener('mouseenter',  this.events, true);
    document.addEventListener('mouseleave',  this.events, true);
    document.addEventListener('mousedown',   this.events);
    document.addEventListener('mouseup',     this.events);
    document.addEventListener('contextmenu', this.events);
  }
})


const Nav = {
  init: function() {
    this.$element = document.querySelector('.mobile-nav');
    this.$element_container = document.querySelector('.mobile-nav__container');
    this.$open = document.querySelector('[data-action="open_nav"]');
    this.$close = document.querySelector('[data-action="close_nav"]');

    document.addEventListener('click', (event) => {
      let $target = event.target.closest('.mobile-nav__container, [data-action="open_nav"]');
      if(!$target && this.state) this.hide();
    })

    this.$open.addEventListener('click', () => {
      if(!this.state) this.show();
    })

    this.$close.addEventListener('click', () => {
      if(this.state) this.hide();
    })

    this.show = () => {
      this.state = true;
      this.$element.classList.add('mobile-nav_visible');
    }

    this.hide = () => {
      this.state = false;
      this.$element.classList.remove('mobile-nav_visible');
    }
  }
}

const Search = {
  init: function() {
    this.$position = document.querySelector('.header__search');
    this.$element = document.querySelector('.search-element');
    this.$input = document.querySelector('.search-element__input');
    this.$input_element = document.querySelector('.search-element__input-element');

    this.$input_element.addEventListener('focus', () => {
      this.show();
    })

    document.addEventListener('click', (event) => {
      let $target = event.target.closest('.search-element');
      if(!$target && this.state) this.hide();
    })

    this.show = () => {
      this.state = true;
      this.$input.classList.add('search-element__input_focus');
    }

    this.hide = () => {
      this.state = false;
      this.$input.classList.remove('search-element__input_focus');
      this.$input_element.value = '';
    }

    this.setPosition = () => {
      let w = this.$position.getBoundingClientRect().width,
          y = this.$position.getBoundingClientRect().y + window.pageYOffset,
          x = this.$position.getBoundingClientRect().x;

      this.$element.style.width = `${w}px`;
      this.$element.style.top = `${y}px`;
      this.$element.style.left = `${x}px`;
    }

    this.setPosition();
    window.addEventListener('resize', this.setPosition);


    this.$position.classList.add('header__search_disabled');
    this.$element.style.display = 'block';
  }
}

const Location = {
  init: function() {
    this.$trigger = document.querySelector('[data-action="open_location"]');
    this.$element = document.querySelector('.location-element');

    this.$trigger.addEventListener('click', () => {
      if(!this.state) this.show();
      else this.hide();
    })

    document.addEventListener('click', (event) => {
      let $target = event.target.closest('[data-action="open_location"], .location-element');
      if(!$target && this.state) this.hide();
    })

    this.show = () => {
      this.state = true;
      this.$element.classList.add('location-element_visible');
    }

    this.hide = () => {
      this.state = false;
      this.$element.classList.remove('location-element_visible');
    }

    this.setPosition = () => {
      let h = this.$trigger.getBoundingClientRect().height,
          y = this.$trigger.getBoundingClientRect().y + window.pageYOffset,
          x = this.$trigger.getBoundingClientRect().x;

      this.$element.style.top = `${y + h + 8}px`;
      this.$element.style.left = `${x}px`;
    }

    this.setPosition();
    window.addEventListener('resize', this.setPosition);
  }
}

class ActiveFunctions {
  create() {
    this.functions = [];
  }
  add(clss, blocks) {
    let $blocks = document.querySelectorAll(blocks);
    if($blocks.length) {
      $blocks.forEach($block => {
        this.functions.push(new clss($block));
      });
    }
  }
  init() {
    this.functions.forEach(func => {
      func.init();
    })
  }
  destroy() {
    this.functions.forEach(func => {
      func.destroy();
    })
    this.functions = [];
  }
}

class HomeBanner {
  constructor($parent) {
    this.$parent = $parent;
  }
  init() {
    this.interval = 5;
    this.$back_items = this.$parent.querySelectorAll('.home-banner__back-item');
    this.$front_items = this.$parent.querySelectorAll('.home-banner__front-item');
    this.$pagination_button = this.$parent.querySelectorAll('.home-banner__pagination-button');
    this.$pagination_button_loader = this.$parent.querySelectorAll('.home-banner__pagination-button-loader');

    this.getNext = ()=> {
      return this.index==this.$front_items.length-1?0:this.index+1;
    }
    this.getPrev = ()=> {
      return this.index==0?this.$front_items.length-1:this.index-1;
    }

    this.animationsEnter = [];
    this.animationsExit = [];
    this.animationLoader = [];

    this.animations_loader = [];
    this.animations_back = [];
    this.animations_front = [];
    this.animations_front_hide = [];

    this.$front_items.forEach(($this, index) => {
      let $front_image = this.$front_items[index].querySelector('.image');

      this.animations_back[index] = gsap.timeline({paused:true})
        .fromTo(this.$back_items[index], {autoAlpha:0}, {autoAlpha:1, duration:0.5})
        .fromTo(this.$back_items[index], {scale:1.1}, {scale:1, duration:1, ease:'power2.out'}, '-=0.5')

      this.animations_front[index] = gsap.timeline({paused:true})
        .fromTo(this.$front_items[index], {autoAlpha:0}, {autoAlpha:1, duration:0.5})
        .fromTo($front_image, {scale:1.1}, {scale:1, duration:1, ease:'power2.out'}, '-=0.5')

      this.animations_front_hide[index] = gsap.timeline({paused:true})
        .fromTo(this.$front_items[index], {autoAlpha:1}, {immediateRender:false, autoAlpha:0, duration:0.5, ease:'power2.out'})

      this.animations_loader[index] = gsap.timeline({paused:true})
        .fromTo(this.$pagination_button_loader[index], {scaleX:0, xPercent:-50}, {scaleX:1, xPercent:0, ease:'none', duration:this.interval})
    })

    this.change = (index) => {
      if(this.in_animation) return;

      this.in_animation = true;

      if(this.index!==undefined) {
        this.$back_items[this.index].style.zIndex = 0;
        this.$front_items[this.index].style.zIndex = 0;
        this.animations_loader[this.index].pause();
        this.$pagination_button[this.index].classList.remove('active');
        this.animations_front_hide[this.index].play(0);
      }

      this.$back_items[index].style.zIndex = 1;
      this.$front_items[index].style.zIndex = 1;

      this.animations_front[index].play(0);

      this.animations_back[index].play(0).eventCallback('onComplete', ()=> {
        this.animations_back[index].pause();
        
        if(this.index!==undefined) {
          this.animations_back[this.index].progress(0);
        }

        this.in_animation = false;
        this.index = index;
      });

      if(!Dev) {
        this.animations_loader[index].play(0).eventCallback('onComplete', ()=> {
          this.change(this.getNext());
        });
      } else {
        this.animations_loader[index].progress(1);
      }
      
      
      this.$pagination_button[index].classList.add('active');
    }

    this.change(0);


    this.$pagination_button.forEach(($this, index) => {
      $this.addEventListener('click', ()=> {
        this.change(index);
      })
    })

    this.swipes = SwipeListener(this.$parent);
    this.$parent.addEventListener('swipe', (event) => {
      let dir = event.detail.directions;
      if(dir.left) {
        this.change(this.getNext());
      } else if(dir.right) {
        this.change(this.getPrev());
      }
    });
  }
}

class Tabs {
  constructor($head) {
    this.$head = $head;
  }
  init() {
    this.$toggle = this.$head.querySelectorAll('[data-role="tab-trigger"]');
    this.$content = document.querySelector(`[data-role='tab-content'][data-content='${this.$head.getAttribute('data-content')}']`);
    this.$blocks = this.$content.querySelectorAll('[data-role="tab-block"]');
    this.$slider = this.$head.querySelector('.toggle-head__slider');

    this.animations = []

    this.change = (index) => {
      this.$toggle[this.index].classList.remove('active');
      this.$toggle[index].classList.add('active');
      this.index = index;

      //
      if(this.$slider) {
        gsap.to(this.$slider, {xPercent:100*index, duration:0.3})
      }
    }

    this.$toggle.forEach(($this, index) => {
      this.animations[index]
      if($this.classList.contains('active')) {
        this.index = index;
      } 
      $this.addEventListener('click', () => {
        this.change(index)
      })
    })

    if(!this.index) {
      this.index = 0;
    }

    this.change(this.index);
  }
}

class TabSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$buttons = this.$parent.querySelectorAll('.tab-slider__button');
    this.$slider_trigger = this.$parent.querySelector('.toggle-head__slider');
    this.speed = 0.3;

    this.$slider_trigger.style.width = `${100/this.$buttons.length}%`;

    this.tabChange = (index)=> {
      this.$buttons[this.index].classList.remove('active');
      this.$buttons[index].classList.add('active');
      this.index = index;
    }

    this.$buttons.forEach(($this, index) => {
      if($this.classList.contains('active')) {
        this.index = index;
      }
      $this.addEventListener('click', () => {
        this.slider.slideTo(index);
      })
    })
    if(!this.index) this.index = 0;

    gsap.set(this.$slider_trigger, {xPercent:100*this.index})

    this.slider = new Swiper(this.$slider, {
      initialSlide: this.index,
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      slidesPerView: 1,
      autoHeight: true,
      speed: this.speed*1000
    });

    this.slider.on('slideChangeTransitionStart', (swiper)=>{
      this.tabChange(swiper.realIndex);
      gsap.to(this.$slider_trigger, {xPercent:100*swiper.realIndex, ease:'power1.inOut', duration:this.speed});
    });
    this.slider.on('touchStart', (swiper)=>{
      this.drag = true;
    });
    this.slider.on('touchEnd', (swiper)=>{
      this.drag = false;
      gsap.to(this.$slider_trigger, {xPercent:100*this.index, ease:'power1.inOut', duration:this.speed});
    });
    this.slider.on('setTranslate', (swiper)=>{
      if(this.drag) {
        let val = -swiper.translate/((swiper.virtualSize-swiper.size)/(Math.round(swiper.virtualSize/swiper.size)-1));
        gsap.set(this.$slider_trigger, {xPercent:100*val})
      }
    });
  }
}

class AdvantagesSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$items = this.$parent.querySelectorAll('.advantages-slider__item');
    this.$content = this.$parent.querySelectorAll('.advantages-slider__content');


    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$slides = this.$parent.querySelectorAll('.advantages-slider__slide');

    this.speed = 0.15;


    
    this.sliderEvent = () => {
      this.change();
    }
    this.$slider.addEventListener('mouseleave', this.sliderEvent);

    this.slideEvents = [];
    this.$slides.forEach(($slide, index) => {
      this.slideEvents[index] = () => {
        if(!CustomInteractionEvents.touched) {
          this.change(index);
        }
      }
      $slide.addEventListener('mouseenter', this.slideEvents[index]);
      $slide.addEventListener('click', this.slideEvents[index]);
    });


    this.change = (index) => {
      if(this.index!==undefined) {
        this.$items[this.index].classList.remove('active');
        this.$slides[this.index].classList.remove('active');
      }
      if(index!==undefined) {
        this.$slides.forEach($slide => {
          $slide.classList.add('hidden');
        });
        this.$items[index].classList.add('active');
        this.$slides[index].classList.add('active');
      } else {
        this.$slides.forEach($slide => {
          $slide.classList.remove('hidden');
        });
      }
      this.index = index;
    }

  }
}

class Partners {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$sliders = this.$parent.querySelectorAll('.swiper-container');
    this.sliders = [];
    this.speed = [1800, 2300, 2200];

    this.$sliders.forEach(($slider, index) => {
      let $slides = $slider.querySelectorAll('.swiper-slide');

      let slider = new Swiper($slider, {
        slidesPerView: 'auto',
        loop: true,
        loopedSlides: $slides.length,
        allowTouchMove: false,
        lazy: {
          loadOnTransitionStart: true,
          loadPrevNext: true,
          loadPrevNextAmount: $slides.length * 2
        }
      });
      
      let render = () => {
        let scroll_size = slider.virtualSize / 3,
            progress_start = scroll_size * -1,
            progress_end = scroll_size * -2,
            scroll_step = scroll_size / this.speed[index],
            progress = slider.translate - scroll_step,
            translate = progress >= progress_end ? progress : progress_start;
  
        slider.setTranslate(translate);
        
        requestAnimationFrame(render);
      }
  
      render();
    })

    

    
  }
}

class Map {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.apiKey = 'c8264039-ceec-4c63-8f99-6858d416bca0';

    let loadMap = ()=> {
      if(typeof ymaps === 'undefined') {
        let callback = ()=> {
          ymaps.ready(createMap);
        }
        let script = document.createElement("script");
        script.type = 'text/javascript';
        script.onload = callback;
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${this.apiKey}&lang=ru_RU`;
        $body.appendChild(script);
      } else {
        createMap();
      }
    }
    
    let createMap = ()=> {
      this.map = new ymaps.Map(this.$parent, {
        center: [57.035109, 65.704738],
        controls: ['zoomControl'],
        zoom: 14
      });
      this.map.behaviors.disable(['scrollZoom']);
      this.placemarks = [];
      this.$map = this.map.container._element;
      this.$map.classList.add('contacts-block__map-element');
      gsap.fromTo(this.$map, {autoAlpha:0}, {autoAlpha:1})

      let placemark = new ymaps.Placemark(this.map.getCenter(), {
        balloonContent: 'пгт. Стрелица ул. Солнечная 39'
      }, {
        iconLayout: 'default#image',
        iconImageHref: './img/icons/map-point.svg',
        iconImageSize: [30, 44],
        iconImageOffset: [-15, -44],
        hideIconOnBalloonOpen: false
      });
      this.map.geoObjects.add(placemark);
    }

    loadMap();
  }
}

class Select {
  constructor($select) {
    this.$select = $select;
  }

  init() {

    this.select = new SlimSelect({
      select: this.$select,
      showSearch: false,
      showContent: 'down'
    })

    /* //add custom arrow
    this.select.slim.container
      .querySelector('.ss-arrow span')
      .insertAdjacentHTML('afterbegin', '<svg class="icon"><use xlink:href="./img/icons/icons.svg#select-arrow"></use></svg>');
    
    //add custom scroll
    this.select.slim.list.classList.add('scrollbar'); */

    let $arrow = this.select.slim.container.querySelector('.ss-arrow span'),
        $scroll = document.createElement('div');

    //add custom arrow
    $arrow.insertAdjacentHTML('afterbegin', '<svg class="icon"><use xlink:href="./img/icons/icons.svg#select-arrow"></use></svg>');
    //add custom scroll
    $scroll.classList.add('scrollbar');
    this.select.slim.content.insertAdjacentElement('beforeEnd', $scroll);
    $scroll.insertAdjacentElement('beforeEnd', this.select.slim.list);
    this.select.slim.list.classList.add('scrollbar__container');
  }
}

class Card3d {
  constructor($block) {
    this.$block = $block;
  }
  init() {
    this.$back = this.$block.querySelectorAll('[data-3d="back"]');
    this.$forward = this.$block.querySelectorAll('[data-3d="forward"]');

    this.event = (event)=> {
      if(CustomInteractionEvents.touched || window.innerWidth < breakpoints.lg) return;
      
      if(event.type=='mousemove') {
        if(this.backanimation) this.backanimation.pause();

        let x = this.$block.getBoundingClientRect().x - event.clientX,
            y = this.$block.getBoundingClientRect().y - event.clientY,
            w = this.$block.getBoundingClientRect().width/2,
            h = this.$block.getBoundingClientRect().height/2,
            xValue = -(1+x/w),
            yValue = 1+y/h,
            xr = xValue*3,
            yr = yValue*3,
            xm = xValue*3,
            ym = -yValue*3;

        if(this.animation) this.animation.pause();
        this.animation = gsap.timeline({defaults:{ease:'power2.out', duration:0.5}})
          .to(this.$back, {rotationY:xr, rotationX:yr})
          .to(this.$forward, {x:xm, y:ym}, `-=${0.5}`)
      } else {
        if(this.animation) this.animation.pause();
        this.backanimation = gsap.timeline({defaults:{ease:'power2.out', duration:0.5}})
          .to(this.$back, {rotationY:0, rotationX:0})
          .to(this.$forward, {x:0, y:0}, `-=${0.5}`)
      }
    }

    this.$block.addEventListener('mousemove',  this.event);
    this.$block.addEventListener('mouseleave', this.event);
  }
}

const Modal = {
  init: function() {

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-action="open_modal"]'),
          $close = event.target.closest('[data-action="close_modal"]');

      if ($open) {
        event.preventDefault();
        this.open(document.querySelector(`${$open.getAttribute('href')}`));
      } else if ($close) {
        this.close();
      }
    })
    
    this.open = ($target) => {
      if ($target == this.$active) return;

      this.animation = gsap.timeline()
        .fadeIn($target, {duration:animation_duration_1})
        .eventCallback('onStart', () => {
          disablePageScroll();
        });;

      this.$active = $target;
    }

    this.close = (callback) => {
      if (!this.$active) return;

      this.animation.reverse().eventCallback('onReverseComplete', () => {
        enablePageScroll();
        if(callback) callback();
      })

      delete this.$active;
    }
  }
}
