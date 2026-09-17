const steps=[...document.querySelectorAll('.step')];
const stages=[{kicker:'01 / ASSESS & APPROVE',title:'A skill assessed.<br>A credential signed.',text:'Testers assess the candidate’s practical ability. Superintendents approve the result. The issuer signs the digital credential with a protected signing key.',process:['Assessment','Approval','Signed credential'],label:'ISSUER PORTAL',result:'Signed and ready to anchor',detail:'Only the credential hash goes on-chain.',next:'Next: Worker Wallet'}, {kicker:'02 / HOLD & SHARE',title:'Your achievement.<br>In your hands.',text:'The candidate holds the signed credential in the Worker Wallet. Its fingerprint is anchored on Polygon PoS. Share the credential with an employer while personal details remain off-chain.',process:['Signed credential','Worker Wallet','Share proof'],label:'WORKER WALLET',result:'Credential held by the worker',detail:'The sample fingerprint remains unchanged.',next:'Next: Verifier DApp'}, {kicker:'03 / CHECK & TRUST',title:'Trust the proof.<br>Not just the paper.',text:'Any employer can verify for free, with no login. The platform checks the issuer’s signature and compares the credential’s fingerprint with its on-chain anchor. Try changing the sample below.',process:['Check signature','Compare hash','Verification result'],label:'VERIFIER DAPP',result:'Fingerprint matches',detail:'The sample credential matches its original hash.',next:'Replay the journey'}];
let current=0,altered=false,originalHash='';
const el=id=>document.getElementById(id);
async function digest(level){const data=JSON.stringify({name:'Ayesha Khan',skill:'Industrial Electrician',level,credentialId:'NSP-000300'});const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(data));return Array.from(new Uint8Array(bytes),v=>v.toString(16).padStart(2,'0')).join('');}
function showStage(n){current=n;altered=false;const s=stages[n];steps.forEach((b,i)=>{b.classList.toggle('active',i===n);b.setAttribute('aria-pressed',String(i===n));});el('demo-kicker').textContent=s.kicker;el('demo-title').innerHTML=s.title;el('demo-text').textContent=s.text;s.process.forEach((v,i)=>el(['process-a','process-b','process-c'][i]).textContent=v);el('surface-label').textContent=s.label;el('result-title').textContent=s.result;el('result-detail').textContent=s.detail;el('next').innerHTML=s.next+' <span>→</span>';el('tamper').hidden=n!==2;el('tamper').textContent='Alter sample credential →';el('sample-skill').textContent='Industrial Electrician · Level 3';el('record-check').textContent='✓';el('demo-surface').classList.remove('altered');el('anchor-hash').textContent=originalHash||'Calculating sample fingerprint…';}
steps.forEach((b,i)=>b.addEventListener('click',()=>showStage(i)));el('next').addEventListener('click',()=>showStage((current+1)%3));
el('tamper').addEventListener('click',async()=>{altered=!altered;el('demo-surface').classList.toggle('altered',altered);el('sample-skill').textContent='Industrial Electrician · Level '+(altered?4:3);el('record-check').textContent=altered?'×':'✓';el('tamper').textContent=altered?'Restore original credential ↺':'Alter sample credential →';const hash=await digest(altered?4:3);el('result-title').textContent=hash===originalHash?'Fingerprint matches':'Change detected — fingerprint mismatch';el('result-detail').textContent=altered?'Changing Level 3 to Level 4 produces a different hash.':'The restored credential matches its original hash.';el('anchor-hash').textContent=originalHash+(altered?'\nNEW: '+hash:'');});
digest(3).then(hash=>{originalHash=hash;el('anchor-hash').textContent=hash;}).catch(()=>{el('anchor-hash').textContent='Fingerprint calculation is unavailable in this browser.';el('tamper').disabled=true;});
if(matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches){const area=el('card-stage'),card=el('credential');area.addEventListener('pointermove',e=>{const r=area.getBoundingClientRect();card.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*16}deg) rotateX(${((e.clientY-r.top)/r.height-.5)*-12}deg)`;});area.addEventListener('pointerleave',()=>card.style.transform='');}

// Shared scroll scheduler: one measurement pass per rendered scroll frame.
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const workflow = document.getElementById('scroll-workflow');
  const nodes = [...workflow.querySelectorAll('li')];
  const progress = document.getElementById('reading-progress-fill');
  const clamp = n => Math.max(0, Math.min(1, n));
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const height = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - height;
    progress.style.transform = `scaleY(${maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 1})`;
    const bounds = workflow.getBoundingClientRect();
    const fraction = reduceMotion.matches ? 1 : clamp((height * .8 - bounds.top) / (bounds.height + height * .25));
    nodes.forEach((node, index) => {
      node.style.setProperty('--link', clamp(fraction * 3 - index).toFixed(4));
      node.classList.toggle('is-lit', reduceMotion.matches || (bounds.top < height * .8 && fraction * 3 >= index));
    });
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  addEventListener('load', scheduleScroll);
  if (document.fonts) document.fonts.ready.then(scheduleScroll);
  reduceMotion.addEventListener('change', scheduleScroll);
  updateScroll();

  // Small tilt on precise pointers; brief lift feedback on touch, never blocking scrolling.
  document.querySelectorAll('.trust-grid article').forEach(badge => {
    let timer;
    function reset() {
      badge.classList.remove('is-engaged');
      badge.style.removeProperty('--badge-x');
      badge.style.removeProperty('--badge-y');
    }
    badge.addEventListener('pointermove', event => {
      if (reduceMotion.matches || !finePointer.matches) return;
      const box = badge.getBoundingClientRect();
      badge.style.setProperty('--badge-x', `${((event.clientY - box.top) / box.height - .5) * -6}deg`);
      badge.style.setProperty('--badge-y', `${((event.clientX - box.left) / box.width - .5) * 8}deg`);
      badge.classList.add('is-engaged');
    }, { passive: true });
    badge.addEventListener('pointerleave', reset);
    badge.addEventListener('pointercancel', reset);
    badge.addEventListener('pointerdown', () => {
      clearTimeout(timer);
      badge.classList.add('is-engaged');
      timer = setTimeout(reset, 550);
    }, { passive: true });
  });

  // Fixed-size canvas: capped resolution, particle count, link distance and frame rate.
  const canvas = document.getElementById('network-mesh');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = 0, height = 0, particles = [], frame = 0, last = 0, elapsed = 0;
  let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;
  function resizeMesh() {
    width = window.innerWidth; height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = width < 760 ? 18 : 32;
    particles = Array.from({ length: count }, (_, i) => ({
      x: ((i * .61803398875 + .11) % 1) * width,
      y: ((i * .41421356237 + .19) % 1) * height,
      phase: i * 2.399, depth: .5 + (i % 4) * .16
    }));
    renderMesh();
  }
  function renderMesh() {
    ctx.clearRect(0, 0, width, height);
    const still = reduceMotion.matches;
    cursorX += (targetX - cursorX) * .055;
    cursorY += (targetY - cursorY) * .055;
    const points = particles.map(p => ({
      x: p.x + (still ? 0 : Math.sin(elapsed * .00017 + p.phase) * 17 + cursorX * p.depth),
      y: p.y + (still ? 0 : Math.cos(elapsed * .00013 + p.phase) * 15 + cursorY * p.depth)
    }));
    const reach = width < 760 ? 160 : 220;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < reach) {
          ctx.strokeStyle = `rgba(156,151,101,${(1 - distance / reach) * .34})`;
          ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(168,153,94,.45)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  function tick(time) {
    frame = 0;
    if (document.hidden || reduceMotion.matches) return;
    const interval = width < 760 ? 50 : 33.3;
    if (time - last >= interval) {
      elapsed += Math.min(time - last, 100); last = time; renderMesh();
    }
    frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    cancelAnimationFrame(frame); frame = 0; last = performance.now();
    if (!document.hidden && !reduceMotion.matches) frame = requestAnimationFrame(tick);
    else if (!document.hidden) renderMesh();
  }
  addEventListener('pointermove', event => {
    if (!finePointer.matches || reduceMotion.matches) return;
    targetX = (event.clientX / width - .5) * 22;
    targetY = (event.clientY / height - .5) * 22;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
  let resizeFrame = 0;
  addEventListener('resize', () => {
    if (!resizeFrame) resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; resizeMesh(); });
  }, { passive: true });
  document.addEventListener('visibilitychange', syncMotion);
  reduceMotion.addEventListener('change', syncMotion);
  resizeMesh(); syncMotion();
})();
