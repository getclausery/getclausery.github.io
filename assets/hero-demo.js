!function(){
  var $ = function(i){return document.getElementById(i)};
  var r = $('demo-rate'), h = $('demo-hours'), x = $('demo-tax');
  var tEl = $('d-total'), cta = document.querySelector('.demo-cta-sm');
  if (!r || !tEl) return;

  function fmt(n){
    return n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function setText(el, val){ el.textContent = val; }
  function num(v){ var n = Number(v); return isFinite(n) && n >= 0 && n <= 1e12 ? n : 0; }
  function rounded(v){ return Math.round(num(v) * 100) / 100; }
  var lastTotal = 0, tweenRaf = 0;

  function setTotal(val){
    var from = lastTotal, to = val;
    if (tweenRaf) cancelAnimationFrame(tweenRaf);
    var start = performance.now(), dur = 280;
    tEl.classList.add('bump');
    setTimeout(function(){ tEl.classList.remove('bump'); }, 250);
    if (Math.abs(to - from) < 0.005 || Math.abs(to - from) > 100000) { setText(tEl, fmt(to)); lastTotal = to; return; }
    function tick(now){
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3), v = from + (to - from) * e;
      setText(tEl, fmt(v));
      if (p < 1) tweenRaf = requestAnimationFrame(tick);
      else { lastTotal = to; setText(tEl, fmt(to)); }
    }
    tweenRaf = requestAnimationFrame(tick);
  }

  function updateCta(){
    if (!cta) return;
    var R = rounded(r.value), H = rounded(h.value), T = num(x.value);
    var base = cta.getAttribute('data-href') || cta.getAttribute('href');
    if (!cta.getAttribute('data-href')) cta.setAttribute('data-href', base);
    cta.setAttribute('href', base + '?rate=' + R + '&hours=' + H + '&tax=' + T + '&currency=USD');
  }

  function calc(){
    var R = rounded(r.value), H = rounded(h.value), T = num(x.value);
    var sub = R*H, a = Math.round(sub*T)/100, tot = sub + a;
    setText($('d-rate'), fmt(R));
    setText($('d-hours'), H.toFixed(2));
    setText($('d-subtotal'), fmt(sub));
    setText($('d-sub2'), fmt(sub));
    var tpct = $('d-taxpct');
    tpct.textContent = String(T);
    setText($('d-taxamt'), fmt(a));
    setTotal(tot);
    updateCta();
  }

  ['input','change'].forEach(function(e){
    r.addEventListener(e, calc); h.addEventListener(e, calc); x.addEventListener(e, calc);
  });
  var initial = rounded(r.value) * rounded(h.value);
  lastTotal = initial + Math.round(initial * num(x.value)) / 100;
  updateCta();
}();
