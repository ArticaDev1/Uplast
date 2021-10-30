function mobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
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

function check_screen() {
  document.documentElement.style.setProperty('--page-height-property', `${window.innerHeight}px`);
}

check_scrollbar();
check_screen();


window.addEventListener("resize", function() {
  if (!mobile()) check_screen();
});

window.addEventListener("orientationchange", function() {
  if (mobile()) {
    setInterval(() => { check_screen() }, 500);
  }
});