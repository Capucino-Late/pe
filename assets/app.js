const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

function showRoute(r){
  qsa('.view').forEach(v=>v.classList.add('hidden'));
  const el = qs('#'+r);
  if(el) el.classList.remove('hidden');
}

qsa('.navbtn').forEach(btn=>btn.addEventListener('click',e=>{
  showRoute(e.target.dataset.route);
  if(e.target.dataset.route==='home') loadBalance();
  if(e.target.dataset.route==='packages') loadPackages();
  if(e.target.dataset.route==='buy') prepareBuy();
  if(e.target.dataset.route==='history') loadHistory();
}));

// default
showRoute('home');
loadBalance();
loadPackages();

async function api(path, opts={}){
  const res = await fetch('/api/'+path, opts);
  if(!res.ok) throw new Error('Network error');
  return res.json();
}

async function loadBalance(){
  try{
    const data = await api('balance');
    qs('#balance').textContent = 'Saldo: '+(data.balance||'-');
  }catch(e){qs('#balance').textContent = 'Gagal memuat saldo';}
}

async function loadPackages(){
  try{
    const data = await api('packages');
    const list = qs('#packages-list'); list.innerHTML='';
    data.packages.forEach(p=>{
      const d = document.createElement('div'); d.className='card';
      d.innerHTML = `<strong>${p.name}</strong> — ${p.price}<div>${p.description||''}</div>`;
      list.appendChild(d);
    });
    // fill buy select
    const sel = qs('#buy-pack-select'); if(sel){ sel.innerHTML=''; data.packages.forEach(p=>{
      const o = document.createElement('option'); o.value=p.id; o.textContent=`${p.name} — ${p.price}`; sel.appendChild(o);
    }); }
  }catch(e){qs('#packages-list').textContent='Gagal memuat paket';}
}

async function prepareBuy(){
  // ensure packages loaded
  await loadPackages();
}

qs('#buy-form').addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const fm = new FormData(ev.target);
  const body = { phone: fm.get('phone'), package_id: fm.get('package_id') };
  qs('#buy-result').textContent='Memproses...';
  try{
    const res = await api('buy', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    qs('#buy-result').textContent = res.message || JSON.stringify(res);
  }catch(e){qs('#buy-result').textContent='Gagal: '+e.message}
});

async function loadHistory(){
  try{
    const data = await api('history');
    const list = qs('#history-list'); list.innerHTML='';
    data.history.forEach(h=>{
      const d = document.createElement('div'); d.className='card';
      d.innerHTML = `<strong>${h.order_id}</strong> — ${h.package_name||h.package_id} — ${h.status}`;
      list.appendChild(d);
    });
  }catch(e){qs('#history-list').textContent='Gagal memuat riwayat';}
}
