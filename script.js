/* Simple interactivity for landing page (no server required) */

/* Config */
const PRICE_INR = 199;
let STOCK_LEFT = 50;

/* Fill dynamic text */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  const stockEl = document.getElementById('stock-left');
  if(stockEl) stockEl.textContent = STOCK_LEFT;
  const priceEl = document.getElementById('price-amount');
  if(priceEl) priceEl.textContent = PRICE_INR;
});

/* Accessible accordion */
document.querySelectorAll('.accordion-item').forEach(button=>{
  button.addEventListener('click', ()=>{
    const expanded = button.getAttribute('aria-expanded') === 'true';
    // close others
    document.querySelectorAll('.accordion-item').forEach(b=>b.setAttribute('aria-expanded','false'));
    document.querySelectorAll('.accordion-panel').forEach(p=>p.style.display='none');
    if(!expanded){
      button.setAttribute('aria-expanded','true');
      const panel = button.nextElementSibling;
      if(panel) panel.style.display = 'block';
    }
  });
});

/* Simple carousel logic */
function initSimpleCarousel(rootSelector, prevBtnSel, nextBtnSel, visible=1, auto=true, interval=4000){
  const root = document.querySelector(rootSelector);
  if(!root) return;
  const track = root.querySelector('.carousel-track') || root.querySelector('.ts-track');
  const prev = root.querySelector(prevBtnSel);
  const next = root.querySelector(nextBtnSel);
  if(!track) return;
  const items = Array.from(track.children);
  let index = 0;
  function render(){
    const gap = parseInt(getComputedStyle(track).gap || 0);
    const itemWidth = items[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * itemWidth}px)`;
  }
  window.addEventListener('resize', render);
  function nextItem(){ index = Math.min(index+1, Math.max(0, items.length - visible)); render(); }
  function prevItem(){ index = Math.max(0, index-1); render(); }
  if(next) next.addEventListener('click', nextItem);
  if(prev) prev.addEventListener('click', prevItem);
  let timer;
  if(auto){
    timer = setInterval(()=>{ index = (index+1) % items.length; render(); }, interval);
    root.addEventListener('mouseover', ()=>clearInterval(timer));
    root.addEventListener('mouseout', ()=>{ timer = setInterval(()=>{ index = (index+1) % items.length; render(); }, interval); });
  }
  setTimeout(render, 300);
}
initSimpleCarousel('#preview-carousel', '.prev', '.next', 1, false);
initSimpleCarousel('#test-slider', '.ts-prev', '.ts-next', window.innerWidth>900?3:1, true, 5000);

/* Sticky header on scroll */
window.addEventListener('scroll', ()=>{
  const header = document.querySelector('header');
  if(!header) return;
  if(window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});
