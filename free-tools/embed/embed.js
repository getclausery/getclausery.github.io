// Embedded calculators. Theme: light unless the host site asks for ?theme=dark or ?theme=auto (the visitor's system
// setting); runs before first paint, so there is no flash of the wrong colours. Height: tells the host page how tall
// the calculator is, so the optional resize script in the embed code can fit the iframe to it without a scrollbar.
(function () {
  var m = /[?&]theme=(dark|auto)\b/.exec(location.search);
  if (m && m[1] === 'dark') document.documentElement.dataset.theme = 'dark';
  else if (m) document.documentElement.removeAttribute('data-theme');
  if (window.parent === window) return;
  var last = 0;
  var send = function () {
    var h = Math.ceil(document.body.getBoundingClientRect().height) + 4;
    if (h !== last) { last = h; window.parent.postMessage({ clauseryHeight: h }, '*'); }
  };
  document.addEventListener('DOMContentLoaded', function () {
    send();
    if (window.ResizeObserver) new window.ResizeObserver(send).observe(document.body);
  });
})();
