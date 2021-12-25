function mobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

function check_device() {
  if (mobile()) {
    document.documentElement.classList.add('mobile');
  } else {
    document.documentElement.classList.add('desktop');
  }
}

function check_scrollbar() {
  let $test_div = document.createElement('div');
      $test_div.style.cssText = 'position:fixed;width:100%;';
      document.body.insertAdjacentElement('afterbegin', $test_div);

      let test_width = $test_div.getBoundingClientRect().width,
          window_width = window.innerWidth,
          value = window_width - test_width;

      $test_div.remove();

  //set scrollbar params
  document.documentElement.style.setProperty('--scrollbar-width-property', `${value}px`);
}

function check_safe_screen() {
  document.documentElement.style.setProperty('--window-safe-height-property', `${window.innerHeight}px`);
}
function check_screen() {
  document.documentElement.style.setProperty('--window-height-property', `${window.innerHeight}px`);
}

check_device();
check_scrollbar();

check_safe_screen();
check_screen();

window.addEventListener("resize", function() {
  check_screen();
  if (!mobile()) check_safe_screen();
});

window.addEventListener("scroll", function() {
  check_screen();
});

window.addEventListener("orientationchange", function() {
  if (mobile()) {
    setInterval(() => { check_safe_screen() }, 500);
  }
});

