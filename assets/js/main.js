// RadiQ Healthcare – site scripts
// Form delivery: paste a form-service URL here (e.g. https://formspree.io/f/xxxxxxx).
// Leave empty to keep the forms in draft mode (nothing is sent).
const FORM_ENDPOINT='';

(function(){
  const tabs={facility:document.getElementById('tab-facility'),patient:document.getElementById('tab-patient')};
  const panels={facility:document.getElementById('panel-facility'),patient:document.getElementById('panel-patient')};
  function show(which){
    for(const k in tabs){const on=k===which;tabs[k].setAttribute('aria-selected',on);panels[k].hidden=!on;}
  }
  tabs.facility.addEventListener('click',()=>show('facility'));
  tabs.patient.addEventListener('click',()=>show('patient'));
  document.querySelectorAll('[data-tab]').forEach(a=>a.addEventListener('click',()=>show(a.dataset.tab)));

  // earliest bookable date = tomorrow
  const d=document.getElementById('pa-date');const t=new Date();t.setDate(t.getDate()+1);
  d.min=t.toISOString().slice(0,10);

  function handle(formId,errId,title,extraCheck){
    const form=document.getElementById(formId),err=document.getElementById(errId);
    form.addEventListener('submit',e=>{
      e.preventDefault();err.textContent='';
      const missing=[...form.querySelectorAll('[required]')].filter(el=>el.type==='checkbox'?!el.checked:!el.value.trim());
      if(missing.length){err.textContent='Please fill in the highlighted fields.';missing.forEach(el=>el.style.borderColor='var(--stat)');missing[0].focus();return;}
      const email=form.querySelector('input[type=email]');
      if(email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){err.textContent='Enter a valid email address, like name@hospital.in.';email.focus();return;}
      const x=extraCheck&&extraCheck(form);if(x){err.textContent=x;return;}
      const data=new FormData(form),rows={};
      for(const [k,v] of data){if(!v)continue;rows[k]=rows[k]?rows[k]+', '+v:v;}
      const box=document.createElement('div');box.className='confirm';box.setAttribute('role','status');
      const h=document.createElement('h3');h.textContent=title;box.appendChild(h);
      const dl=document.createElement('dl');
      for(const k in rows){const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');dd.textContent=rows[k];dl.append(dt,dd);}
      box.appendChild(dl);
      const p=document.createElement('p');p.className='proto';p.textContent=FORM_ENDPOINT?'':'Draft site: nothing has been sent. Set FORM_ENDPOINT in assets/js/main.js to deliver requests.';box.appendChild(p);
      if(FORM_ENDPOINT){
        p.textContent='Sending…';
        fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:data})
          .then(r=>{if(!r.ok)throw 0;h.textContent=title.replace('is ready','has been sent');p.textContent='Our team will contact you shortly.';p.className='';})
          .catch(()=>{p.textContent='Sending failed. Please call or email us using the details at the bottom of the page.';});
      }
      form.replaceChildren(box);
    });
    form.addEventListener('input',e=>{e.target.style.borderColor='';});
  }
  handle('form-facility','fa-err','Thanks. Your request for sample reports is ready.',f=>f.querySelector('input[name=Modalities]:checked')?'':'Pick at least one modality.');
  handle('form-patient','pa-err','Thanks. Your appointment request is ready.');

  document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
    const el=document.getElementById(b.dataset.copy);const txt=el.textContent;
    const done=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500)};
    try{navigator.clipboard.writeText(txt).then(done,()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);});}
    catch(e){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);}
  }));
})();
(function(){
  if(!('IntersectionObserver' in window))return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const groups=['.proof .cell','.mod-card','.step','.checks li','.faq details','footer .wrap > div'];
  const singles=['.sec-head','#quality .tbl-scroll','#quality .caption','.tabs','.form-grid form','.aside .box'];
  const els=new Set();
  groups.forEach(sel=>{
    const list=document.querySelectorAll(sel);
    list.forEach(el=>{
      const sibs=[...el.parentElement.children].filter(c=>c.matches(sel));
      el.style.setProperty('--d',Math.min(sibs.indexOf(el),5)*90+'ms');
      els.add(el);
    });
  });
  singles.forEach(sel=>document.querySelectorAll(sel).forEach((el,i)=>{
    if(el.matches('.aside .box'))el.style.setProperty('--d',(1+[...el.parentElement.children].indexOf(el))*110+'ms');
    els.add(el);
  }));
  const vh=innerHeight;
  els.forEach(el=>{
    el.classList.add('rv');
    const r=el.getBoundingClientRect();
    if(r.top<vh*0.95&&r.bottom>0)el.classList.add('in'); // already on screen: show at once
  });
  document.documentElement.classList.add('js-reveal');
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -8% 0px',threshold:0.12});
  els.forEach(el=>{if(!el.classList.contains('in'))io.observe(el);});
  // anything scrolled past (e.g. jumping to an anchor) is revealed too
  addEventListener('scroll',()=>{els.forEach(el=>{if(!el.classList.contains('in')&&el.getBoundingClientRect().bottom<0){el.classList.add('in');io.unobserve(el);}});},{passive:true});
})();
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||matchMedia('(max-width:700px)').matches)return;
  const g=document.getElementById('mb-scroll-g'),hero=document.querySelector('.hero');
  let lastY=scrollY,lastT=performance.now(),blur=0,raf=0;
  function tick(){
    const now=performance.now(),y=scrollY,v=Math.abs(y-lastY)/Math.max(now-lastT,1);
    lastY=y;lastT=now;
    blur+= (Math.min(v*9,16)-blur)*0.25;      // ease toward speed-based target
    if(blur<0.15)blur=0;
    g.setAttribute('stdDeviation','0 '+blur.toFixed(2));
    raf=(blur>0||v>0.01)?requestAnimationFrame(tick):0;
  }
  addEventListener('scroll',()=>{
    if(hero.getBoundingClientRect().bottom<0)return;
    if(!raf){lastT=performance.now();raf=requestAnimationFrame(tick);}
  },{passive:true});
})();
