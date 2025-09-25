/* Updated interactive JS (mobile-optimized) */
/* Config */
const PRICE_INR = 199;
let STOCK_LEFT = 50;

/* On DOM loaded */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  const stockEl = document.getElementById('stock-left');
  if(stockEl) stockEl.textContent = STOCK_LEFT;
  const priceEl = document.getElementById('price-amount');
  if(priceEl) priceEl.textContent = PRICE_INR;

  initPreviewCarousel();
  initTestimonialsCarousel();
  initAccordion();
});

/* Helpers */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* PREVIEW CAROUSEL */
function initPreviewCarousel(){
  const track = document.getElementById('preview-track');
  const dotsContainer = document.getElementById('preview-dots');
  const prevBtn = document.querySelector('.preview-control.prev');
  const nextBtn = document.querySelector('.preview-control.next');
  if(!track) return;

  const items = Array.from(track.children);
  let index = 0;
  let startX = 0, isDragging = false;
  const gap = 10;

  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'preview-dot';
    dot.setAttribute('aria-label', `Go to preview ${i+1}`);
    dot.addEventListener('click', ()=>{ index = i; update(); });
    dotsContainer.appendChild(dot);
  });

  function visibleCount(){
    if(window.innerWidth >= 900) return 3;
    if(window.innerWidth >= 600) return 2;
    return 1;
  }

  function update(){
    const visible = visibleCount();
    const itemWidth = items[0].getBoundingClientRect().width + gap;
    const maxIndex = Math.max(0, items.length - visible);
    index = clamp(index, 0, maxIndex);
    const translate = index * itemWidth;
    track.style.transform = `translateX(-${translate}px)`;
    Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === index));
  }

  if(prevBtn) prevBtn.addEventListener('click', ()=>{ index = Math.max(0, index-1); update(); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ index = Math.min(index+1, items.length-1); update(); });

  // touch
  track.addEventListener('touchstart', (e)=>{ isDragging=true; startX = e.touches[0].clientX; });
  track.addEventListener('touchmove', (e)=>{
    if(!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${ -index * (items[0].getBoundingClientRect().width + gap) + -dx }px)`;
  });
  track.addEventListener('touchend', (e)=>{
    isDragging=false;
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const dx = endX - startX;
    if(Math.abs(dx) > 40){ if(dx < 0) index = Math.min(index+1, items.length-1); else index = Math.max(0, index-1); }
    update();
  });

  window.addEventListener('resize', ()=> setTimeout(update, 120));
  update();
}

/* TESTIMONIALS CAROUSEL */
function initTestimonialsCarousel(){
  const track = document.getElementById('ts-track');
  const prevBtn = document.querySelector('.ts-prev');
  const nextBtn = document.querySelector('.ts-next');
  if(!track) return;
  const items = Array.from(track.children);
  let index = 0;
  const gap = 12;
  let timer;

  function visibleCount(){
    if(window.innerWidth >= 900) return 3;
    if(window.innerWidth >= 600) return 2;
    return 1;
  }

  function update(){
    const visible = visibleCount();
    const itemWidth = items[0].getBoundingClientRect().width + gap;
    const maxIndex = Math.max(0, items.length - visible);
    index = clamp(index, 0, maxIndex);
    const translate = index * itemWidth;
    track.style.transform = `translateX(-${translate}px)`;
  }

  if(prevBtn) prevBtn.addEventListener('click', ()=>{ index = Math.max(0, index-1); update(); resetAuto(); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ index = Math.min(index+1, items.length-1); update(); resetAuto(); });

  function startAuto(){ stopAuto(); timer = setInterval(()=>{ index = (index + 1) % items.length; update(); }, 4500); }
  function stopAuto(){ if(timer) clearInterval(timer); }
  function resetAuto(){ stopAuto(); startAuto(); }

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  window.addEventListener('resize', ()=> setTimeout(update,120));

  update(); startAuto();
}

/* ACCORDION */
function initAccordion(){
  document.querySelectorAll('.accordion-item').forEach(button=>{
    button.addEventListener('click', ()=>{
      const expanded = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-item').forEach(b=>b.setAttribute('aria-expanded','false'));
      document.querySelectorAll('.accordion-panel').forEach(p=>p.style.display='none');
      if(!expanded){
        button.setAttribute('aria-expanded','true');
        const panel = button.nextElementSibling;
        if(panel) panel.style.display = 'block';
      }
    });
    button.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); button.click(); }
    });
  });
}
