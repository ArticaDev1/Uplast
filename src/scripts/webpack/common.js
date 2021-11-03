const Dev = window.location.host == 'localhost:9000' ? true : false;

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

const animation_duration_1 = +getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-1').replace(/[^\d.-]/g, '');
const animation_duration_2 = +getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-2').replace(/[^\d.-]/g, '');
const animation_duration_3 = +getComputedStyle(document.documentElement).getPropertyValue('--animation-duration-3').replace(/[^\d.-]/g, '');

const LoaderSVG = `
  <svg class="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30" fill="currentColor">
    <circle cx="15" cy="15" r="15">
        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/>
    </circle>
    <circle cx="105" cy="15" r="15">
        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/>
    </circle>
  </svg>`

import 'lazysizes';
import {gsap} from "gsap";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);
gsap.defaults({
  ease: "power2.inOut",
  duration: 1
});
import {disablePageScroll, enablePageScroll} from 'scroll-lock';
import Inputmask from "inputmask";
import autosize from 'autosize';
import SwipeListener from 'swipe-listener';
import Swiper, {Navigation, Pagination, Autoplay, Scrollbar, FreeMode} from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';


import SlimSelect from 'slim-select';
import tippy, {followCursor} from 'tippy.js';
const validate = require("validate.js");

//animations
gsap.registerEffect({
  name: "fadeIn",
  effect: ($element, config) => {
    return gsap.fromTo($element, {autoAlpha: 0}, {immediateRender: false, autoAlpha: 1, duration: config.duration || animation_duration_1 / 1000,
      onStart: () => {
        $element.forEach($this => {
          $this.classList.add('d-block');
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
gsap.registerEffect({
  name: "slide",
  effect: ($element, config) => {
    return gsap.fromTo($element, {css: {'height':config.height}}, {css: {'height':'auto'}, duration: config.duration || animation_duration_1 / 1000, 
      onComplete: () => {
        $element.forEach($this => {
          gsap.set($this, {clearProps: "all"});
        })
      },  
      onReverseComplete: () => {
        $element.forEach($this => {
          gsap.set($this, {clearProps: "all"});
        })
      }
    })
  },
  extendTimeline: true
});

document.addEventListener("DOMContentLoaded", function () {
  CustomInteractionEvents.init();
  Location.init();
  Search.init();
  Modal.init();
  ScrollAnchors.init();
  Validation.init();
  Input.init();
  InputFile.init();

  //tippy
  tippy('[data-tippy-content]', {
    followCursor: true,
    touch: false,
    plugins: [followCursor],
    duration: 150,
    placement: 'bottom'
  });

  //mask
  Inputmask({
    mask: "+7 (999) 999-99-99",
    showMaskOnHover: false,
    clearIncomplete: false
  }).mask('[data-validate="phone"]');

  //textarea
  autosize(document.querySelectorAll('.input textarea'));

  calculator();
  form_toggle();
  collapse();

  InstancesManager.add(HomeBanner, '.home-banner');
  InstancesManager.add(TabSlider, '.tab-slider');
  InstancesManager.add(AdvantagesSlider, '.advantages-slider');
  InstancesManager.add(Partners, '.section-partners');
  //InstancesManager.add(Map, '.contacts__map');
  InstancesManager.add(Select, '.select select');
  InstancesManager.add(Card3d, '[data-3d="parent"]');
  InstancesManager.add(ProductSlider, '.product-slider');
  InstancesManager.add(SliderConstructor, '.slider-constructor');
  InstancesManager.add(MapVector, '.map-vector');
  InstancesManager.add(HistoryList, '.history-list');
  InstancesManager.init();
});

function mobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

const Input = {
  init: function() {
    this._class = 'input';
    this._class_filled = 'filled';
    
    let events = (event) => {
      let $input = event.target,
          $parent = $input.closest(`.${this._class}`);

      if (!$parent) return;
         
      let input_empty = validate.single($input.value, {presence: {allowEmpty: false}}) !== undefined;
        
      if(event.type=='input' || event.type=='change') {
        if(!input_empty) {
          $input.classList.add(this._class_filled);
        } else {
          $input.classList.remove(this._class_filled);
        }
      }
    
      else if(event.type=='blur') {
        if(input_empty) {
          $input.classList.remove(this._class_filled);
          $input.value = '';
        }
      } 
    }

    document.addEventListener('input', events, true);
    document.addEventListener('blur', events, true);
  },
  reset: function($input) {
    $input.value = '';

    $input.classList.remove(this._class_filled);
    if($input.tagName=='TEXTAREA') {
      $input.style.height = 'initial';
    }
  }
}

const InputFile = {
  init: function() {
    this._class = 'input-file';
    this._class_selected = 'selected';
    this._attr_text = 'data-text';
    
    let events = (event) => {
      let $input = event.target,
          $parent = event.target.closest(`.${this._class}`);

      if (!$parent) return;
      
      let $text = $parent.querySelector(`[${this._attr_text}]`),
          text = $text.getAttribute(this._attr_text).split('|');

      if ($input.files.length) {
        $input.classList.add(this._class_selected);
        $text.textContent = text[1];
      } else {
        $input.classList.remove(this._class_selected);
        $text.textContent = text[0];
      }
    }

    document.addEventListener('change', events);
  },
  reset: function($input) {
    let $parent = $input.parentNode.closest(`.${this._class}`),
        $text = $parent.querySelector(`[${this._attr_text}]`),
        text = $text.getAttribute(this._attr_text).split('|');

    $input.value = '';

    $input.classList.remove(this._class_selected);
    $text.textContent = text[0];
  }
}

function form_toggle() {
  let _attr_ = 'data-form-toggle';

  let change_inputs = (event) => {
    let $target = event.target;

    if ($target.getAttribute('type') == 'checkbox' || $target.getAttribute('type') == 'radio') {
      let data = {};
      data.name = $target.getAttribute('name');
      data.value = $target.value;
      data.checked = $target.checked

      check_element_state(data);
    }
  }

  let check_element_state = (data) => {
    let $elements = document.querySelectorAll(`[${_attr_}]`);

    $elements.forEach($element => {
      let arr = $element.getAttribute(_attr_).split('|'),
          name = arr[0],
          value = arr[1];

      if (data.name == name && data.value == value) {
        $element.classList.remove('d-none');
      } else if (data.name == name) {
        $element.classList.add('d-none');
      }
    })
  }

  document.addEventListener('change', change_inputs);
}

function input_number_test($input) {
  $input.value = $input.value.replace(/[^\d.]/g, '');
}

function calculator() {
  let _button_ = '.product-calculator__button',
      _input_ = '.product-calculator__input',
      _input_count_ = '.product-calculator__input-count',
      _minus_ = '.product-calculator__button_minus',
      _plus_ = '.product-calculator__button_plus';

  let calculator_events = (event) => {
    let $target = event.target.closest(`${_input_}, ${_input_count_}, ${_button_}`);

    if ($target) {
      let $calculator = {};
          $calculator.$parent = $target.parentNode;
          $calculator.$input = $calculator.$parent.querySelector(_input_);
          $calculator.$input_count = $calculator.$parent.querySelector(_input_count_);
          $calculator.$minus = $calculator.$parent.querySelector(_minus_);
          $calculator.$plus = $calculator.$parent.querySelector(_plus_);
          $calculator.count = parseInt($calculator.$input.getAttribute('data-count'));

      if ($target == $calculator.$minus || $target == $calculator.$plus) {
        buttons_click_event($target, $calculator, event);
      } else if ($target == $calculator.$input && (event.type == 'input' || event.type == 'change')) {
        input_number_test($target);
        input_min_test($target, $calculator, event);
        count_change($calculator.$input_count, $calculator, event);
      } else if ($target == $calculator.$input_count && (event.type == 'input' || event.type == 'change')) {
        input_number_test($target);
        count_change_event($target, $calculator, event);
      }
    }
  }

  let input_min_test = ($target, $calculator, event) => {
    $target.value = Math.max(1, $target.value);
  }

  let count_change_event = ($target, $calculator, event) => {
    
    let change = () => {
      let val = Math.ceil($target.value / $calculator.count);
      $calculator.$input.value = val;
      $calculator.$input.dispatchEvent(new Event("change", {bubbles: true}));
    }

    if ($target.timeout) clearTimeout($target.timeout);

    if (event.type == 'change') {
      change();
    } else {
      $target.timeout = setTimeout(() => {
        change();
      }, 500)
    }
  }

  let count_change = ($target, $calculator, event) => {
    $target.value = parseInt($calculator.$input.value) * $calculator.count;
  }

  let buttons_click_event = ($target, $calculator, event) => {
    if ($target == $calculator.$minus) $calculator.$input.value = parseInt($calculator.$input.value) - 1;
    else if ($target == $calculator.$plus) $calculator.$input.value = parseInt($calculator.$input.value) + 1;
    $calculator.$input.dispatchEvent(new Event("change", {bubbles: true}));
  }

  document.addEventListener('input', calculator_events);
  document.addEventListener('change', calculator_events);
  document.addEventListener('click', calculator_events);
}

function collapse() {
  let _toggle_ = '[data-collapse="toggle"]',
      _parent_ = '[data-collapse="parent"]',
      _content_ = '[data-collapse="content"]',
      _inner_ = '[data-collapse="inner"]';

  let check = () => {
    let $parents = document.querySelectorAll(_parent_);

    $parents.forEach($parent => {

      let $content = $parent.querySelector(_content_),
          $inner = $parent.querySelector(_inner_),
          $toggle = $parent.querySelector(_toggle_);

      let h1 = $inner.getBoundingClientRect().height;

      let $test = document.createElement('div');
      $test.style.cssText = `position:absolute;height:${getComputedStyle($content).getPropertyValue('--height')};`;
      $content.insertAdjacentElement('afterbegin', $test);

      let h2 = $test.getBoundingClientRect().height;

      $test.remove();

      if (h1 <= h2) {
        $parent.classList.remove('active');
        $toggle.classList.remove('d-block');
      } else {
        $parent.classList.add('active');
        if (!$toggle.classList.contains('d-block')) {
          gsap.effects.fadeIn($toggle, {duration: animation_duration_2 / 1000});
          gsap.effects.slide($toggle, {height: 0, duration: animation_duration_2 / 1000});
        }
      }

    })
  }

  check();
  window.addEventListener('resize', check);

  document.addEventListener('click', function(event) {
    let $toggle = event.target.closest(_toggle_);

    if (!$toggle) return;

    let $parent = $toggle.closest(_parent_),
        $content = $parent.querySelector(_content_),
        h = getComputedStyle($content).getPropertyValue('--height');

    let state = () => {
      return $content.classList.contains('active');
    }

    if (state()) {
      gsap.effects.slide($content, {height: h}).reverse(0);
      $content.classList.remove('active');
      $toggle.classList.remove('active');
    } else {
      gsap.effects.slide($content, {height: h});
      $content.classList.add('active');
      $toggle.classList.add('active');
    }
  })
}

const CustomInteractionEvents = Object.create({
  targets: {
    value: '[data-custom-interaction], a, button, label, .input input, .input textarea, .scrollbar-thumb, .ss-single-selected, .ss-option'
  },
  touchEndDelay: {
    value: 100
  },
  init() {
    this.events = (event) => {
      let $targets = [];
      $targets[0] = event.target !== document ? event.target.closest(this.targets.value) : null;
      let $element = $targets[0],
        i = 0;

      while ($targets[0]) {
        $element = $element.parentNode;
        if ($element !== document) {
          if ($element.matches(this.targets.value)) {
            i++;
            $targets[i] = $element;
          }
        } else {
          break;
        }
      }

      //touchstart
      if (event.type == 'touchstart') {
        this.touched = true;
        if (this.timeout) clearTimeout(this.timeout);
        if ($targets[0]) {
          for (let $target of $targets) $target.setAttribute('data-touch', '');
        }
      }
      //touchend
      else if (event.type == 'touchend' || (event.type == 'contextmenu' && this.touched)) {
        this.timeout = setTimeout(() => {
          this.touched = false
        }, 500);
        if ($targets[0]) {
          setTimeout(() => {
            for (let $target of $targets) {
              $target.removeAttribute('data-touch');
            }
          }, this.touchEndDelay.value)
        }
      }
      //mouseenter
      if (event.type == 'mouseenter' && !this.touched && $targets[0] && $targets[0] == event.target) {
        $targets[0].setAttribute('data-hover', '');
      }
      //mouseleave
      else if (event.type == 'mouseleave' && !this.touched && $targets[0] && $targets[0] == event.target) {
        $targets[0].removeAttribute('data-click');
        $targets[0].removeAttribute('data-hover');
      }
      //mousedown
      if (event.type == 'mousedown' && !this.touched && $targets[0]) {
        $targets[0].setAttribute('data-click', '');
      }
      //mouseup
      else if (event.type == 'mouseup' && !this.touched && $targets[0]) {
        $targets[0].removeAttribute('data-click');
      }
    }
    document.addEventListener('touchstart', this.events);
    document.addEventListener('touchend', this.events);
    document.addEventListener('mouseenter', this.events, true);
    document.addEventListener('mouseleave', this.events, true);
    document.addEventListener('mousedown', this.events);
    document.addEventListener('mouseup', this.events);
    document.addEventListener('contextmenu', this.events);
  }
})

const Search = {
  init: function () {
    if (typeof mse2FormConfig == 'undefined') return;

    let $position = document.querySelector('.header__search');

    let $element = document.querySelector('.search-element'),
        $form = $element.querySelector('.search-element__form'),
        $input = $element.querySelector('.search-element__input'),
        $resaults = $element.querySelector('.search-element__resaults');

    let key = $form.getAttribute('data-key'),
        config = mse2FormConfig[key],
        actionURL = mse2Config['actionUrl'],
        data = {
          action: 'search',
          key: key,
          pageId: config.pageId
        };

    let animation = gsap.timeline({paused:true})
      .fadeIn($resaults)

    document.addEventListener('click', (event) => {
      let $target = event.target.closest('.search-element');
      if (!$target && $input.value) {
        $input.value = '';
        $input.dispatchEvent(new Event("input"));
      }
    })

    this.setPosition = () => {
      if ($element.parentNode == $position && window.innerWidth < breakpoints.lg) {
        $header.insertAdjacentElement('afterend', $element);
        $element.classList.add('scrollbar');
      } else if($element.parentNode !== $position && window.innerWidth >= breakpoints.lg) {
        $position.insertAdjacentElement('afterbegin', $element);
        $element.classList.remove('scrollbar');
      }
    }

    this.show_resaults = () => {
      $form.classList.add('search-element__form_has-resaults');
      animation.play();
    }

    this.hide_resaults = () => {
      $form.classList.remove('search-element__form_has-resaults');
      animation.reverse().eventCallback('onReverseComplete', () => {
        $resaults.innerHTML = '';
      });
    }

    this.search = (event) => {
      if(event.target.value.length >= config.minQuery) {

        data[config['queryVar']] = event.target.value;

        $.post(actionURL, data, (response) => {
          if (event.target.value.length < config.minQuery) return;
          
          if(response.data.results.length) {
            $resaults.innerHTML = '';
            for(let resault of response.data.results) {
              $resaults.insertAdjacentHTML('beforeend', resault.label);
            }
          } else {
            $resaults.innerHTML = '<span class="search-element__no-resaults">Результатов не найдено</span>';
          }
          
          this.show_resaults();
        }, 'json');

      } else {
        this.hide_resaults();
      }
    }

    this.setPosition();
    window.addEventListener('resize', this.setPosition);

    $input.addEventListener('input', this.search);
  }
}

const Location = {
  init: function () {
    this.$trigger = document.querySelector('[data-action="open_location"]');
    this.$element = document.querySelector('.location-element');

    this.$trigger.addEventListener('click', () => {
      if (!this.state) this.show();
      else this.hide();
    })

    document.addEventListener('click', (event) => {
      let $target = event.target.closest('[data-action="open_location"], .location-element');
      if (!$target && this.state) this.hide();
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

const InstancesManager = {
  instances: [],

  add: function (clss, blocks) {
    let $blocks = document.querySelectorAll(blocks);
    if ($blocks.length) {
      $blocks.forEach($block => {
        this.instances.push(new clss($block));
      });
    }
  },

  init: function () {
    this.instances.forEach(func => {
      func.init();
    })
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

    this.getNext = () => {
      return this.index == this.$front_items.length - 1 ? 0 : this.index + 1;
    }
    this.getPrev = () => {
      return this.index == 0 ? this.$front_items.length - 1 : this.index - 1;
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

      this.animations_back[index] = gsap.timeline({
          paused: true
        })
        .fromTo(this.$back_items[index], {
          autoAlpha: 0
        }, {
          autoAlpha: 1,
          duration: 0.5
        })
        .fromTo(this.$back_items[index], {
          scale: 1.1
        }, {
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.5')

      this.animations_front[index] = gsap.timeline({
          paused: true
        })
        .fromTo(this.$front_items[index], {
          autoAlpha: 0
        }, {
          autoAlpha: 1,
          duration: 0.5
        })
        .fromTo($front_image, {
          scale: 1.1
        }, {
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.5')

      this.animations_front_hide[index] = gsap.timeline({
          paused: true
        })
        .fromTo(this.$front_items[index], {
          autoAlpha: 1
        }, {
          immediateRender: false,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.out'
        })

      this.animations_loader[index] = gsap.timeline({
          paused: true
        })
        .fromTo(this.$pagination_button_loader[index], {
          scaleX: 0,
          xPercent: -50
        }, {
          scaleX: 1,
          xPercent: 0,
          ease: 'none',
          duration: this.interval
        })
    })

    this.change = (index) => {
      if (this.in_animation) return;

      this.in_animation = true;

      if (this.index !== undefined) {
        this.$back_items[this.index].style.zIndex = 0;
        this.$front_items[this.index].style.zIndex = 0;
        this.animations_loader[this.index].pause();
        this.$pagination_button[this.index].classList.remove('active');
        this.animations_front_hide[this.index].play(0);
      }

      this.$back_items[index].style.zIndex = 1;
      this.$front_items[index].style.zIndex = 1;

      this.animations_front[index].play(0);

      this.animations_back[index].play(0).eventCallback('onComplete', () => {
        this.animations_back[index].pause();

        if (this.index !== undefined) {
          this.animations_back[this.index].progress(0);
        }

        this.in_animation = false;
        this.index = index;
      });

      if (!Dev) {
        this.animations_loader[index].play(0).eventCallback('onComplete', () => {
          this.change(this.getNext());
        });
      } else {
        this.animations_loader[index].progress(1);
      }


      this.$pagination_button[index].classList.add('active');
    }

    this.change(0);


    this.$pagination_button.forEach(($this, index) => {
      $this.addEventListener('click', () => {
        this.change(index);
      })
    })

    this.swipes = SwipeListener(this.$parent);
    this.$parent.addEventListener('swipe', (event) => {
      let dir = event.detail.directions;
      if (dir.left) {
        this.change(this.getNext());
      } else if (dir.right) {
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
      if (this.$slider) {
        gsap.to(this.$slider, {
          xPercent: 100 * index,
          duration: 0.3
        })
      }
    }

    this.$toggle.forEach(($this, index) => {
      this.animations[index]
      if ($this.classList.contains('active')) {
        this.index = index;
      }
      $this.addEventListener('click', () => {
        this.change(index)
      })
    })

    if (!this.index) {
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

    this.tabChange = (index) => {
      this.$buttons[this.index].classList.remove('active');
      this.$buttons[index].classList.add('active');
      this.index = index;
    }

    this.$buttons.forEach(($this, index) => {
      if ($this.classList.contains('active')) {
        this.index = index;
      }
      $this.addEventListener('click', () => {
        this.slider.slideTo(index);
      })
    })
    if (!this.index) this.index = 0;

    gsap.set(this.$slider_trigger, {
      xPercent: 100 * this.index
    })

    this.slider = new Swiper(this.$slider, {
      initialSlide: this.index,
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      slidesPerView: 1,
      autoHeight: true,
      speed: this.speed * 1000
    });

    this.slider.on('slideChangeTransitionStart', (swiper) => {
      this.tabChange(swiper.realIndex);
      gsap.to(this.$slider_trigger, {
        xPercent: 100 * swiper.realIndex,
        ease: 'power1.inOut',
        duration: this.speed
      });
    });
    this.slider.on('touchStart', (swiper) => {
      this.drag = true;
    });
    this.slider.on('touchEnd', (swiper) => {
      this.drag = false;
      gsap.to(this.$slider_trigger, {
        xPercent: 100 * this.index,
        ease: 'power1.inOut',
        duration: this.speed
      });
    });
    this.slider.on('setTranslate', (swiper) => {
      if (this.drag) {
        let val = -swiper.translate / ((swiper.virtualSize - swiper.size) / (Math.round(swiper.virtualSize / swiper.size) - 1));
        gsap.set(this.$slider_trigger, {
          xPercent: 100 * val
        })
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
        if (!CustomInteractionEvents.touched) {
          this.change(index);
        }
      }
      $slide.addEventListener('mouseenter', this.slideEvents[index]);
      $slide.addEventListener('click', this.slideEvents[index]);
    });


    this.change = (index) => {
      if (this.index !== undefined) {
        this.$items[this.index].classList.remove('active');
        this.$slides[this.index].classList.remove('active');
      }
      if (index !== undefined) {
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

    let loadMap = () => {
      if (typeof ymaps === 'undefined') {
        let callback = () => {
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

    let createMap = () => {
      this.map = new ymaps.Map(this.$parent, {
        center: [57.035109, 65.704738],
        controls: ['zoomControl'],
        zoom: 14
      });
      this.map.behaviors.disable(['scrollZoom']);
      this.placemarks = [];
      this.$map = this.map.container._element;
      this.$map.classList.add('contacts-block__map-element');
      gsap.fromTo(this.$map, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

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

    this.event = (event) => {
      if (CustomInteractionEvents.touched || window.innerWidth < breakpoints.lg) return;

      if (event.type == 'mousemove') {
        if (this.backanimation) this.backanimation.pause();

        let x = this.$block.getBoundingClientRect().x - event.clientX,
          y = this.$block.getBoundingClientRect().y - event.clientY,
          w = this.$block.getBoundingClientRect().width / 2,
          h = this.$block.getBoundingClientRect().height / 2,
          xValue = -(1 + x / w),
          yValue = 1 + y / h,
          xr = xValue * 3,
          yr = yValue * 3,
          xm = xValue * 3,
          ym = -yValue * 3;

        if (this.animation) this.animation.pause();
        this.animation = gsap.timeline({
            defaults: {
              ease: 'power2.out',
              duration: 0.5
            }
          })
          .to(this.$back, {
            rotationY: xr,
            rotationX: yr
          })
          .to(this.$forward, {
            x: xm,
            y: ym
          }, `-=${0.5}`)
      } else {
        if (this.animation) this.animation.pause();
        this.backanimation = gsap.timeline({
            defaults: {
              ease: 'power2.out',
              duration: 0.5
            }
          })
          .to(this.$back, {
            rotationY: 0,
            rotationX: 0
          })
          .to(this.$forward, {
            x: 0,
            y: 0
          }, `-=${0.5}`)
      }
    }

    this.$block.addEventListener('mousemove', this.event);
    this.$block.addEventListener('mouseleave', this.event);
  }
}

class ProductSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper');
    this.$pagination = this.$parent.querySelector('.product-slider__pagination');
    this.$pagination_element = this.$parent.querySelector('.swiper-pagination');

    this.$miniatures = this.$parent.querySelector('.product-slider__miniatures');
    this.$miniature = this.$parent.querySelectorAll('.product-slider__miniature');

    let enabled = this.$miniature.length > 1 ? true : false;

    this.slider = new Swiper(this.$slider, {
      modules: [Pagination],
      touchStartPreventDefault: false,
      speed: animation_duration_3,
      enabled: enabled,
      pagination: {
        el: this.$pagination_element,
        clickable: true,
        bulletElement: 'button'
      },
    });

    if (this.$miniature.length > 1) {

      this.$miniature[0].classList.add('is-active');
      this.slider.on('slideChange', (event) => {
        this.$miniature.forEach($this => {
          $this.classList.remove('is-active')
        })
        this.$miniature[event.realIndex].classList.add('is-active');
      })

      this.$miniature.forEach(($this, index) => {
        $this.addEventListener('mouseenter', () => {
          this.slider.slideTo(index);
        })
        $this.addEventListener('click', () => {
          this.slider.slideTo(index);
        })
      })

      gsap.effects.fadeIn([this.$miniatures, this.$pagination]);

    }

  }
}

class SliderConstructor {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper');
    this.$pagination = this.$parent.querySelector('.swiper-pagination');
    this.$prev = this.$parent.querySelector('.swiper-button-prev');
    this.$next = this.$parent.querySelector('.swiper-button-next');

    let slides_count = this.$parent.getAttribute('data-slides') || 1,
        slides_sm_count = this.$parent.getAttribute('data-sm-slides') || slides_count,
        slides_md_count = this.$parent.getAttribute('data-md-slides') || slides_sm_count,
        slides_lg_count = this.$parent.getAttribute('data-lg-slides') || slides_md_count,
        slides_xl_count = this.$parent.getAttribute('data-xl-slides') || slides_lg_count,
        slides_xxl_count = this.$parent.getAttribute('data-xxl-slides') || slides_xl_count;

    this.swiper = new Swiper(this.$slider, {
      modules: [Pagination, Navigation],
      touchStartPreventDefault: false,
      slidesPerView: slides_count,
      speed: animation_duration_3,
      pagination: {
        el: this.$pagination,
        clickable: true,
        bulletElement: 'button'
      },
      navigation: {
        prevEl: this.$prev,
        nextEl: this.$next
      },
      breakpoints: {
        [breakpoints.xxl]: {
          slidesPerView: slides_xxl_count
        },
        [breakpoints.xl]: {
          slidesPerView: slides_xl_count
        },
        [breakpoints.lg]: {
          slidesPerView: slides_lg_count
        },
        [breakpoints.md]: {
          slidesPerView: slides_md_count
        },
        [breakpoints.sm]: {
          slidesPerView: slides_sm_count
        }
      }
    });

  }
}

class HistoryList {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.x_position = 0;
    this.x_value = 0;

    let initSlider = () => {
      this.instance = {
        x_position: 0,
        x_value: 0
      };

      this.instance.slider = new Swiper(this.$parent, {
        modules: [Scrollbar, FreeMode],
        touchStartPreventDefault: false,
        slidesPerView: "auto",
        freeMode: true,
        speed: animation_duration_3
      });

      if (!mobile()) {
        document.addEventListener('mousemove', mousemove);
        this.instance.requestAnimationFrame = requestAnimationFrame(checkPosition);
      }      
    }

    let destroySlider = () => {
      this.instance.slider.destroy();
      document.removeEventListener('mousemove', mousemove);
      if (this.instance.requestAnimationFrame) {
        cancelAnimationFrame(this.instance.requestAnimationFrame);
      }
      delete this.instance;
    }

    let mousemove = (event) => {
      let w = this.$parent.getBoundingClientRect().width,
          x = this.$parent.getBoundingClientRect().left,
          val1 = (event.clientX - x) / w;
      
      this.instance.x_value = Math.min(1, Math.max(0, val1));
    }

    let checkPosition = () => {

      if(window.innerWidth >= breakpoints.lg) {

        this.instance.x_position += (this.instance.x_value - this.instance.x_position) * 0.1;
      
        //scroll
        this.instance.slider.setProgress(this.instance.x_position, 0);

      }
    
      this.instance.requestAnimationFrame = requestAnimationFrame(checkPosition);
    }

    let checkStatus = () => {
      if (!this.instance && window.innerWidth >= breakpoints.lg) {
        initSlider();
      } else if (this.instance && window.innerWidth < breakpoints.lg) {
        destroySlider();
      }
    }

    checkStatus();
    window.addEventListener('resize', checkStatus);
  }
}

class MapVector {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper');
    this.$scrollbar = this.$parent.querySelector('.swiper-scrollbar');

    this.slider = new Swiper(this.$slider, {
      modules: [Scrollbar, FreeMode],
      touchStartPreventDefault: false,
      slidesPerView: "auto",
      freeMode: true,
      speed: animation_duration_3,
      scrollbar: {
        el: this.$scrollbar,
      }
    });
  }
}

const Modal = {
  init: function () {

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

      document.dispatchEvent(new CustomEvent("modal_open", {
        detail: {
          target: $target
        }
      }));

      this.animation = gsap.timeline()
        .fadeIn($target)
        .eventCallback('onStart', () => {
          disablePageScroll();
        });

      this.$active = $target;
    }

    this.close = (callback) => {
      if (!this.$active) return;

      this.animation.reverse().eventCallback('onReverseComplete', () => {
        enablePageScroll();
        if (callback) callback();
      })

      delete this.$active;
    }
  }
}

const ScrollAnchors = {
  init: function() {
    let _scroll_ = '[data-action="scroll_to_anchor"]';

    let click_event = (event) => {
      let $link = event.target.closest(`${_scroll_}`);

      if (!$link) return;

      event.preventDefault();

      let attr = $link.getAttribute('href'),
          $target = document.querySelector(`${attr}`);

      if (!$target) return;

      scroll_event($target, $link);
    }

    let scroll_event = ($target, $link) => {
      let ty = $target.getBoundingClientRect().top + window.pageYOffset,
          gap = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--scroll-to-content-gap')
            .replace(/[^\d.-]/g, '')),
          y = ty - gap;
        
      window.dispatchEvent(new CustomEvent("scroll_to_anchor_start", {
        detail:{
          $target: $target,
          $link: $link
        }
      }));

      gsap.to(window, {scrollTo: y, duration: animation_duration_3 / 1000, onComplete: () => {
        window.dispatchEvent(new CustomEvent("scroll_to_anchor_end"));
      }});
    }

    document.addEventListener('click', click_event);
  }
}

const Form = {
  _elements: 'input, textarea, select',
  disable: function($form) {
    let $elements = $form.querySelectorAll(this._elements);
    $elements.forEach(($element) => {
      $element.setAttribute('disabled', '');
    })
  },
  enable: function($form) {
    let $elements = $form.querySelectorAll(this._elements);
    $elements.forEach(($element) => {
      $element.removeAttribute('disabled');
    })
  },
  reset: function ($form) {
    if ($form.getAttribute('data-validation')!==null) $form.setAttribute('data-validation', '');

    let $elements = $form.querySelectorAll(this._elements);

    $elements.forEach(($element) => {
      if ($element.closest(`.${Input._class}`)) {
        Input.reset($element);
      } else if ($element.closest(`.${InputFile._class}`)) {
        InputFile.reset($element);
      }
    })
  }
}

window.Validation = {
  init: function () {
    this._form_elements = 'input, textarea, select';
    this.constraints = {
      file: {
        presence: {
          allowEmpty: false,
          message: '^Загрузите файл'
        },
      },
      phone: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш номер телефона'
        },
        format: {
          pattern: /^\+[0-9]\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
          message: '^Введите корректный номер телефона'
        }
      },
      email: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш email-адрес'
        },
        email: {
          message: '^Введите корректный email-адрес'
        }
      },
      empty: {
        presence: {
          allowEmpty: false,
          message: '^Заполните это поле'
        }
      }
    };

    document.addEventListener('input', (event) => {
      if (event.target.classList.contains('error') || 
          event.target.classList.contains('success')) {
        this.validate_input(event.target);
      }
    })

    document.addEventListener('submit', (event) => {
      let $form = event.target,
          prevalidation = $form.getAttribute('data-validation');
    
      if (!event.isTrusted || prevalidation===null) return;

      event.preventDefault();
    
      if (this.validate($form)) {
        $form.setAttribute('data-validation', 'true');
        $form.dispatchEvent(new Event("submit", {bubbles: true}));
      }
    })

  },

  check_prevalidation: function($form) {
    let validation = $form.getAttribute('data-validation');

    if (validation===null || validation==='true') return true; 
    else return false;
  },

  validate: function($form) {
    let $inputs = $form.querySelectorAll(this._form_elements),
        flag = 0;

    $inputs.forEach(($input) => {
      if (!this.validate_input($input)) flag++;
    })

    if (!flag) return true;
    else return false;
  },

  validate_input: function ($input) {
    let required = $input.getAttribute('required') !== null,
        type = $input.getAttribute('data-validate'),
        disabled = $input.getAttribute('disabled') !== null,
        empty = validate.single($input.value, {presence: {allowEmpty: false}}) !== undefined,
        resault;

    if (disabled) return;

    if(type && (required || !empty)) {
      resault = validate.single($input.value, this.constraints[type]);
    } else if (required) {
      resault = validate.single($input.value, this.constraints.empty);
    }
    
    //если есть ошибки
    if (resault) {
      if ($input.classList.contains('success')) {
        $input.classList.remove('success');
      }
      if (!$input.classList.contains('error')) {
        $input.classList.add('error');
        $input.parentNode.parentNode.insertAdjacentHTML('beforeend', `<span class="input-message">${resault[0]}</span>`);
        gsap.effects.fadeIn($input.parentNode.parentNode.querySelector('.input-message'));
      } else {
        $input.parentNode.parentNode.querySelector('.input-message').textContent = `${resault[0]}`;
      }
      return false;
    }

    //если нет ошибок
    else {
      if ($input.classList.contains('error')) {
        $input.classList.remove('error');
        $input.classList.add('success');
        gsap.effects.fadeIn($input.parentNode.parentNode.querySelector('.input-message')).reverse(1).eventCallback('onReverseComplete', () => {
          $input.parentNode.parentNode.querySelector('.input-message').remove();
        });
      }
      return true;
    }

  },

  reset_hints: function ($form) {
    let $inputs = $form.querySelectorAll(this._form_elements);
    $inputs.forEach(($input) => {
      if ($input.classList.contains('error')) {
        $input.classList.remove('error');
        gsap.effects.fadeIn($input.parentNode.parentNode.querySelector('.input-message')).reverse(1).eventCallback('onReverseComplete', () => {
          $input.parentNode.parentNode.querySelector('.input-message').remove();
        });
      }

      if ($input.classList.contains('success')) {
        $input.classList.remove('success');
      }

    })

  }
}

const ButtonLoader = {
  add: function ($button) {
    if ($button.classList.contains('button_disabled')) return;

    $button.classList.add('button_disabled');

    $button.insertAdjacentHTML('beforeend', LoaderSVG);
    setTimeout(() => {
      $button.classList.add('button_in-load');
    }, 0);

  },

  remove: function ($button) {
    $button.classList.remove('button_in-load');
    setTimeout(() => {
      let $loader = $button.querySelector('.loader');
      if ($loader) $loader.remove();
      $button.classList.remove('button_disabled');
    }, animation_duration_1);
  }
}

//ajax form events
document.addEventListener('ajaxForm:beforeSubmit', function (event) {
  let $button = event.target.querySelector('[type="submit"]');
  ButtonLoader.add($button);
  Form.disable(event.target);
})
document.addEventListener('ajaxForm:afterSubmit', function (event) {
  let $button = event.target.querySelector('[type="submit"]');
  ButtonLoader.remove($button);
  Form.enable(event.target);
})
document.addEventListener('ajaxForm:success', function (event) {
  Form.reset(event.target);
  Validation.reset_hints(event.target);
})




document.addEventListener('miniShop2_callback', function (event) {
  let detail = event.detail;

  //cart buttons
  if(detail.type == 'before' && detail.action == 'cart/add') {
    let $button = detail.$form.querySelector('[type="submit"]');
    ButtonLoader.add($button);
  }
  if(detail.type == 'after' && detail.action == 'cart/add' && detail.response.success) {
    let $button = detail.$form.querySelector('[type="submit"]');
    ButtonLoader.remove($button);
    $button.classList.add('cart-button_in-cart');
  }

  //order
  if(detail.type == 'before' && detail.action == 'order/submit') {
    let $button = detail.$form.querySelector('[type="submit"]');
    Form.disable(detail.$form);
    ButtonLoader.add($button);
  }
  if(detail.type == 'after' && detail.action == 'order/submit' && detail.response.success) {
    let $button = detail.$form.querySelector('[type="submit"]');
    Form.enable(detail.$form);
    ButtonLoader.remove($button);
  }

  //cart element
  if(detail.type == 'after' && detail.action == 'cart/remove' && detail.response.success) {
    console.log(detail)
    let $element = detail.$form.closest('.cart-item');
    $element.remove();
  }
  
})

document.addEventListener('after_change_resaults_page', function () {
  let py = +getComputedStyle(document.documentElement).getPropertyValue('--grid-gutter-x').replace(/[^\d.-]/g, ''),
    $top = document.querySelector('.breadcrumbs') ? document.querySelector('.breadcrumbs') : document.querySelector('.catalog'),
    y = $top.getBoundingClientRect().y + window.pageYOffset;

  gsap.to(window, {
    scrollTo: y - py,
    duration: animation_duration_3 / 1000
  });
})

document.addEventListener('before_load_filter_resaults', function () {
  let $filter_button = document.querySelector('.filter__show-button .button');

  if ($filter_button) {
    ButtonLoader.add($filter_button);
  }
})

document.addEventListener('after_load_filter_resaults', function () {
  let $filter_button_inner = document.querySelector('.filter__show-button'),
    $filter_button = document.querySelector('.filter__show-button .button');

  if ($filter_button_inner && !$filter_button_inner.classList.contains('d-block')) {
    gsap.effects.fadeIn($filter_button_inner);
  }

  if ($filter_button) {
    ButtonLoader.remove($filter_button);
  }
})

document.addEventListener('modal_open', function (event) {
  let $filter_button_inner = event.detail.target.querySelector('.filter__show-button');

  if ($filter_button_inner) {
    $filter_button_inner.classList.remove('d-block');
  }
})
