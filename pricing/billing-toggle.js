(function(){
  var b=document;b.addEventListener('click',function(e){var t=e.target.closest('[data-billing]');if(!t)return;b.querySelectorAll('[data-billing]').forEach(function(x){x.classList.remove('active');x.setAttribute('aria-selected','false')});t.classList.add('active');t.setAttribute('aria-selected','true');b.body.classList.toggle('billing-yearly',t.dataset.billing==='yearly')});
  if(/[?&]yearly/.test(location.search)){var y=b.querySelector('[data-billing=yearly]');if(y)y.click();}
})();
