/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of CMI under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* Clausery site script: mobile menu, copy buttons, template finder, command palette (⌘K), in-page TOC, returning-visitor bar, read progress, scroll-to-top. External so pages work under a strict script-src 'self' policy. */
const CLAUSERY_ANALYTICS={token:'20524027c20141ab8306d586c8518877',since:'2026-10-03',host:'getclausery.github.io'};
if(CLAUSERY_ANALYTICS.token&&location.hostname===CLAUSERY_ANALYTICS.host){const s=document.createElement('script');s.type='module';s.src='https://static.cloudflareinsights.com/beacon.min.js';s.setAttribute('data-cf-beacon',JSON.stringify({token:CLAUSERY_ANALYTICS.token}));document.head.appendChild(s);}

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const K=(e,k)=>{const m=e.matches?e:e.target;if(!m)return false;try{return m.matches(k)}catch{return false}};

/* ---------- Menu ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest?.('.menu-btn');if(!b)return;
  const n=document.getElementById(b.getAttribute('aria-controls'));if(!n)return;
  const open=n.classList.toggle('open');b.setAttribute('aria-expanded',String(open));
  const bd=document.getElementById('nav-backdrop');if(bd){bd.hidden=!open;bd.classList.toggle('show',open)}
  if(open){b.dataset.prev=document.body.style.overflow;document.body.style.overflow='hidden'}
  else{document.body.style.overflow=b.dataset.prev||'';if(bd){bd.hidden=true;bd.classList.remove('show')}}
});
document.addEventListener('click',e=>{
  if(K(e,'#nav-backdrop')){const n=$('#site-nav'),b=$('.menu-btn');if(n)n.classList.remove('open');if(b)b.setAttribute('aria-expanded','false');const bd=$('#nav-backdrop');if(bd){bd.hidden=true;bd.classList.remove('show')}document.body.style.overflow=''}
  if(K(e,'.site-nav a')){const n=$('#site-nav'),b=$('.menu-btn'),bd=$('#nav-backdrop');if(n)n.classList.remove('open');if(b)b.setAttribute('aria-expanded','false');if(bd){bd.hidden=true;bd.classList.remove('show')}document.body.style.overflow=''}
});

/* ---------- Copy buttons ---------- */
document.addEventListener('click',async e=>{
  const b=e.target.closest?.('.copy-btn');if(!b)return;
  const s=document.getElementById(b.dataset.copy),st=b.parentElement.querySelector('.copy-status');if(!s)return;
  const isBox=s.tagName==='TEXTAREA',txt=isBox?s.value:[...s.querySelectorAll('p')].map(p=>p.textContent.trim()).join('\n\n');
  try{await navigator.clipboard.writeText(txt);if(st)st.textContent='Copied to the clipboard.'}
  catch{if(isBox){s.focus();s.select();if(st)st.textContent='Press Ctrl+C (or Cmd+C) to copy.';return}
    const r=document.createRange();r.selectNodeContents(s);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);
    if(st)st.textContent='Press Ctrl+C (or Cmd+C) to copy.'}
});

/* ---------- Template finder ---------- */
for(const box of $$('[data-filter-for]')){
  const root=document.getElementById(box.dataset.filterFor),input=$('input',box);
  if(!root||!input)continue;
  const cnt=$('[data-filter-count]',box),empty=$('[data-filter-empty]');
  const items=[...root.querySelectorAll('.feature')].map(el=>[el,[...el.childNodes].map(n=>n.textContent).join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)]);
  const groups=[...root.querySelectorAll('.filter-group')];
  const run=()=>{const w=input.value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);let shown=0;
    for(const[el,tok]of items){const hit=w.every(x=>tok.some(t=>t.startsWith(x)));el.hidden=!hit;if(hit)shown++}
    for(const g of groups)g.hidden=!g.querySelector('.feature:not([hidden])');
    if(cnt)cnt.textContent=w.length?`${shown} of ${items.length} templates match`:'';
    if(empty)empty.hidden=shown>0};
  input.addEventListener('input',run);box.hidden=false;
  const q=new URL(location.href).searchParams.get('q');if(q){input.value=q;run()}
}

/* ---------- Read progress + to-top + scroll-cta ---------- */
(function(){
  const bar=$('#read-progress'),cta=$('#scroll-cta'),topBtn=$('#to-top'),ctaLabel=$('#scroll-cta-label');
  let t=false,drafts=null;
  const readDrafts=()=>{if(drafts!==null)return drafts;
    try{const idx=localStorage.getItem('clausery:drafts-index');if(idx){const d=JSON.parse(idx);drafts=Array.isArray(d)?d:[]}else drafts=[]}catch{drafts=[]}
    return drafts};
  const lastDoc=()=>{try{return JSON.parse(localStorage.getItem('clausery:last-doc')||'null')}catch{return null}};
  const upd=()=>{
    const h=document.documentElement,s=h.scrollTop||document.body.scrollTop,m=Math.max(1,h.scrollHeight-h.clientHeight),p=Math.min(100,Math.max(0,(s/m)*100));
    if(bar)bar.style.width=p.toFixed(1)+'%';
    const dd=readDrafts(),last=lastDoc();
    const hasD=dd.length>0||last;
    if(cta){
      const show=hasD?s>250:s>900&&p>20;cta.classList.toggle('show',show);
      if(ctaLabel){if(last&&last.title)ctaLabel.textContent=`Continue “${last.title.length>28?last.title.slice(0,26)+'…':last.title}”`;else if(dd.length)ctaLabel.textContent=`Continue drafting · ${dd.length} saved`;else ctaLabel.textContent='Start a new invoice'}
    }
    if(topBtn)topBtn.classList.toggle('show',s>600);
    t=false};
  if(topBtn)topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  if(bar||cta||topBtn){upd();window.addEventListener('scroll',()=>{if(!t){requestAnimationFrame(upd);t=true}},{passive:true})}
})();

/* ---------- Welcome-back bar ---------- */
(function(){
  const bar=$('#welcome-bar'),msg=$('#wb-msg'),meta=$('#wb-meta'),dismiss=$('#wb-dismiss');
  if(!bar)return;
  const DISMISSED_KEY='clausery:welcome-dismissed-v1';
  let drafts=[];try{drafts=JSON.parse(localStorage.getItem('clausery:drafts-index')||'[]')||[]}catch{}
  let last=null;try{last=JSON.parse(localStorage.getItem('clausery:last-doc')||'null')}catch{}
  if(!drafts.length&&!last)return;
  if(sessionStorage.getItem(DISMISSED_KEY))return;
  const dismissedUntil=+localStorage.getItem(DISMISSED_KEY+'_until')||0;
  if(Date.now()<dismissedUntil)return;
  if(last&&last.title){msg.textContent=`Welcome back — pick up "${last.title.length>40?last.title.slice(0,38)+'…':last.title}"`}
  else if(drafts.length){msg.textContent=`Welcome back — you have ${drafts.length} saved draft${drafts.length===1?'':'s'}`}
  meta.textContent=drafts.length?last?`· plus ${drafts.length-1>0?drafts.length-1+' more':'latest draft'}`:'':'· Nothing to upload, all local';
  bar.classList.add('show');
  if(dismiss)dismiss.addEventListener('click',()=>{bar.classList.remove('show');sessionStorage.setItem(DISMISSED_KEY,'1');localStorage.setItem(DISMISSED_KEY+'_until',String(Date.now()+7*864e5))});
})();

/* ---------- Command palette ---------- */
(function(){
  const root=$('#cmdk');if(!root)return;
  const input=$('#cmdk-input',root),list=$('#cmdk-list',root);
  const openBtn=$('#nav-search');
  let idx=0,items=[],flat=[],data=null,loading=null;
  const ACTIONS={id:'actions',title:'Actions',items:[
    {t:'New invoice',u:'app/#/start/invoice',i:'+'},
    {t:'New quote',u:'app/#/start/quote',i:'+'},
    {t:'New receipt',u:'app/#/start/receipt',i:'+'},
    {t:'Open drafts',u:'app/#/drafts',i:'▦'},
    {t:'Pricing',u:'pricing/',i:'$'},
    {t:'Documentation',u:'docs/',i:'?'},
  ]};
  const buildItems=d=>{const g=[{...ACTIONS,items:ACTIONS.items.map(x=>({...x,g:'actions'}))},
    {id:'templates',title:'Templates',items:(d.templates||[]).map(x=>({t:x.t,u:x.p,i:'T',g:'templates'}))},
    {id:'invoices',title:'Invoice templates',items:(d.invoices||[]).map(x=>({t:x.t,u:x.p,i:'I',g:'invoices'}))},
    {id:'guides',title:'Guides',items:(d.guides||[]).map(x=>({t:x.t,u:x.p,i:'G',g:'guides'}))},
    {id:'clauses',title:'Clauses',items:(d.clauses||[]).map(x=>({t:x.t,u:x.p,i:'C',g:'clauses'}))},
    {id:'tools',title:'Free tools',items:(d.tools||[]).map(x=>({t:x.t,u:x.p,i:'f',g:'tools'}))},
    {id:'pages',title:'Pages',items:(d.pages||[]).map(x=>({t:x.t,u:x.p,i:'·',g:'pages'}))},
  ];return g.filter(x=>x.items.length)};
  async function ensure(){if(data)return data;if(loading)return loading;
    const el=document.getElementById('search-index');const src=el?.dataset?.src||'search-index.json';
    loading=fetch(src,{credentials:'same-origin'}).then(r=>r.json()).then(d=>{data=d;items=buildItems(d);return d}).catch(()=>{data={};items=[ACTIONS];return data});
    return loading}
  items=[ACTIONS];
  function render(q=''){
    const qw=q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const sc=it=>{if(!qw.length)return 1;let s=0;for(const w of qw){const tl=it.t.toLowerCase();if(tl===w)s+=100;else if(tl.startsWith(w))s+=40;else if(tl.includes(w))s+=20;else return 0}return s};
    const out=[];
    for(const g of items){
      const matches=g.items.map(x=>({x,s:sc(x)})).filter(m=>m.s>0).sort((a,b)=>b.s-a.s).slice(0,8);
      if(matches.length)out.push(`<div class="cmdk-group" role="group" data-group="${g.id}"><div class="cmdk-group-label">${g.title}</div>${matches.map((m,i)=>`<a class="cmdk-item" role="option" data-i="${i}" href="${m.x.u}" id="cmdk-i-${g.id}-${i}" aria-selected="${g.id===items[0].id&&i===0?'true':'false'}"><span class="cmdk-icon">${m.x.i||'·'}</span><span class="cmdk-title">${hl(m.x.t,qw)}</span><span class="cmdk-path">${m.x.u.replace(/\.html$/,'').replace(/\/index$/,'/')}</span></a>`).join('')}</div>`);
    }
    list.innerHTML=out.length?out.join(''):'<div class="cmdk-empty">No matches — try a different word.</div>';
    flat=[...list.querySelectorAll('.cmdk-item')];idx=0;if(flat.length){flat[0].setAttribute('aria-selected','true');flat[0].scrollIntoView({block:'nearest'})}
  }
  function hl(t,qw){const safe=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));if(!qw.length)return safe(t);let out=safe(t);for(const w of qw){const re=new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'gi');out=out.replace(re,'<b>$1</b>')}return out}
  async function open(){root.hidden=false;root.classList.add('show');list.innerHTML='<div class="cmdk-empty">Loading…</div>';setTimeout(()=>{input.value='';input.focus()},20);document.body.style.overflow='hidden';await ensure();render(input.value||'')}
  function close(){root.hidden=true;root.classList.remove('show');document.body.style.overflow='';idx=0}
  function move(d){if(!flat.length)return;flat[idx]?.setAttribute('aria-selected','false');idx=(idx+d+flat.length)%flat.length;flat[idx].setAttribute('aria-selected','true');flat[idx].scrollIntoView({block:'nearest'})}
  document.addEventListener('keydown',e=>{
    const mod=e.metaKey||e.ctrlKey;
    if(mod&&(e.key==='k'||e.key==='K')){e.preventDefault();root.classList.contains('show')?close():open();return}
    if(e.key==='/'&&!root.classList.contains('show')&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();open();return}
    if(!root.classList.contains('show'))return;
    if(e.key==='Escape'){e.preventDefault();close()}
    else if(e.key==='ArrowDown'){e.preventDefault();move(1)}
    else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}
    else if(e.key==='Enter'){e.preventDefault();const a=flat[idx];if(a){a.click();close()}}
  });
  if(openBtn)openBtn.addEventListener('click',open);
  root.addEventListener('click',e=>{if(e.target===root)close()});
  input.addEventListener('input',()=>render(input.value));
  list.addEventListener('mouseover',e=>{const a=e.target.closest?.('.cmdk-item');if(!a)return;flat.forEach(x=>x.setAttribute('aria-selected','false'));a.setAttribute('aria-selected','true');idx=flat.indexOf(a)});
})();

/* ---------- In-page TOC for long articles ---------- */
(function(){
  const main=$('main');if(!main)return;
  const hs=[...main.querySelectorAll('h2')].filter(h=>h.id||(h.id='sec-'+(Math.random().toString(36).slice(2,8))));
  if(hs.length<3)return;
  const prose=hs[0].closest('.prose,.docs-body,.tpl-overview');if(!prose)return;

  if(!prose.closest('.docs-with-toc')&&hs.length<4)return;
  const wrap=document.createElement('aside');wrap.className='article-toc';wrap.setAttribute('aria-label','On this page');
  wrap.innerHTML=`<h4>On this page</h4><ol>${hs.map(h=>`<li><a href="#${h.id}">${h.textContent}</a></li>`).join('')}</ol>`;
  const container=prose.closest('.docs-with-toc');if(container){container.appendChild(wrap);return}

})();

/* ---------- Reveal on scroll ---------- */
(function(){
  const els=$$('.feature,.plan,.steps li,.docs-card');if(!els.length||!('IntersectionObserver'in window))return;
  els.forEach((e,i)=>{e.classList.add('reveal');e.style.transitionDelay=(i%8)*30+'ms'});
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  els.forEach(e=>io.observe(e));
})();

/* ---------- Feature card spotlight ---------- */
document.addEventListener('pointermove',e=>{
  const f=e.target.closest?.('.feature');if(!f)return;
  const r=f.getBoundingClientRect();f.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');f.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
});

/* ---------- Copy-protection watermark ---------- */
(function(){
  const OFFICIAL=['getclausery.github.io','getclausery.com','www.getclausery.com','clausery.app','www.clausery.app'];
  const h=location.hostname.toLowerCase();
  if(h==='localhost'||h==='127.0.0.1'||h==='0.0.0.0'||h===''||h.endsWith('.e2b.app')||h.endsWith('.e2b.dev')||h.endsWith('.arena.ai')||h.endsWith('.local')||h==='file')return;
  if(window.__CLAUSERY_WHITE_LABEL)return;
  for(const o of OFFICIAL)if(h===o||h.endsWith('.'+o))return;
  const brand=(($('.brand')?.textContent||'')+' '+document.title+' '+($('meta[property="og:site_name"]')?.getAttribute('content')||'')+' '+($('meta[name="generator"]')?.getAttribute('content')||'')+' '+($('meta[name="original-source"]')?.getAttribute('content')||'')+' '+($('.legal')?.textContent||'')+' '+[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent).join(' ')).toLowerCase();
  if(!/clausery/.test(brand))return;
  if(document.getElementById('clausery-copyguard'))return;
  const bar=document.createElement('div');bar.id='clausery-copyguard';bar.setAttribute('role','note');
  bar.innerHTML='This appears to be an unlicensed copy of <a href="https://getclausery.github.io/" rel="noopener" target="_blank">Clausery</a>. Clausery is free and open source (AGPLv3); hosted copies that keep the Clausery name require a <a href="https://getclausery.github.io/legal/license.html" rel="noopener" target="_blank">commercial license</a>, and modified copies must publish their source.';
  document.documentElement.setAttribute('data-copyguard','1');document.body.insertBefore(bar,document.body.firstChild);
  try{console.log('%cClausery','color:#fff;background:#0b5;padding:2px 6px;border-radius:3px','open source AGPLv3 — unlicensed copy detected.')}catch{}
})();

/* ---------- Frame-busting ---------- */
(function(){
  try{if(window.top===window.self)return;
    const allowed=['getclausery.github.io','getclausery.com','www.getclausery.com','clausery.app','www.clausery.app'];let ok=false;
    try{const host=window.top.location.hostname;if(!host)ok=true;else for(const a of allowed)if(host===a||host.endsWith('.'+a)){ok=true;break}}catch{ok=false}
    if(!ok)window.top.location.replace(window.self.location.href)}catch{}
})();
