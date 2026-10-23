!function(){
  var $ = function(i){return document.getElementById(i)};
  var r = $('demo-rate'), h = $('demo-hours'), x = $('demo-tax');
  var tEl = $('d-total');
  if (!r || !tEl) return;

  function fmt(n){
    return (Math.round(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function setText(el, val){
    el.textContent = val;
  }
  var lastTotal = 0;
  var tweenRaf = 0;

  function setTotal(val){
    var from = lastTotal, to = val;
    if (tweenRaf) cancelAnimationFrame(tweenRaf);
    var start = performance.now();
    var dur = 280;
    // bump the scale for tactile feedback
    tEl.classList.add('bump');
    setTimeout(function(){ tEl.classList.remove('bump'); }, 250);
    // if jump is tiny just set it
    if (Math.abs(to - from) < 0.005 || Math.abs(to - from) > 100000) {
      setText(tEl, fmt(to));
      lastTotal = to;
      return;
    }
    function tick(now){
      var p = Math.min(1, (now - start) / dur);
      // easeOutCubic
      var e = 1 - Math.pow(1 - p, 3);
      var v = from + (to - from) * e;
      setText(tEl, fmt(v));
      if (p < 1) tweenRaf = requestAnimationFrame(tick);
      else { lastTotal = to; setText(tEl, fmt(to)); }
    }
    tweenRaf = requestAnimationFrame(tick);
  }

  function calc(){
    var R = (+r.value)||0, H = (+h.value)||0, T = (+x.value)||0;
    var sub = R*H, a = sub*T/100, tot = sub + a;
    setText($('d-rate'), fmt(R));
    setText($('d-hours'), H.toFixed(2));
    setText($('d-subtotal'), fmt(sub));
    setText($('d-sub2'), fmt(sub));
    var tpct = $('d-taxpct');
    tpct.textContent = T.toFixed(1).replace(/[.]0$/,'');
    setText($('d-taxamt'), fmt(a));
    setTotal(tot);
  }

  ['input','change'].forEach(function(e){
    r.addEventListener(e, calc); h.addEventListener(e, calc); x.addEventListener(e, calc);
  });
  // calculate once on load to ensure values match
  lastTotal = (+r.value||0)*(+h.value||0)*(1 + ((+x.value||0)/100));
}();
