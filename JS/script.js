'use strict';

/* ── DATA ── */
const ST = {
  mini:false, page:'dashboard',
  dragId:null,
  tRun:false, tPaused:false, tSec:0, tInt:null, tSes:0,
  tProj:'TaskFlow MVP', tTask:'Diseño de API REST',
  tasks: JSON.parse(localStorage.getItem('tf_t')||'null') || [
    {id:1,title:'Diseño de API REST',        col:'progress',prio:'alta', proj:'TaskFlow MVP',        assign:'VF',date:'24 Mar',prog:60, desc:'Diseñar endpoints de auth y proyectos.'},
    {id:2,title:'Implementar RBAC backend',  col:'progress',prio:'media',proj:'TaskFlow MVP',        assign:'EC',date:'28 Mar',prog:30, desc:'Control de acceso por roles en Node.js.'},
    {id:3,title:'Maquetado módulo login',    col:'todo',    prio:'alta', proj:'TaskFlow MVP',        assign:'CC',date:'26 Mar',prog:0,  desc:'Login, registro y recuperación.'},
    {id:4,title:'Integración notificaciones',col:'todo',    prio:'media',proj:'TaskFlow MVP',        assign:'EC',date:'02 Abr',prog:0,  desc:'Sistema de alertas y notificaciones.'},
    {id:5,title:'Documentación técnica API', col:'todo',    prio:'baja', proj:'CreativeHub Intranet',assign:'VF',date:'10 Abr',prog:0,  desc:'Documentar endpoints con Swagger.'},
    {id:6,title:'Setup base de datos',       col:'done',    prio:'alta', proj:'TaskFlow MVP',        assign:'EC',date:'20 Mar',prog:100,desc:'Configurar PostgreSQL y schema.'},
    {id:7,title:'Config entorno Node.js',    col:'done',    prio:'alta', proj:'TaskFlow MVP',        assign:'CC',date:'18 Mar',prog:100,desc:'Instalar entorno desarrollo backend.'},
    {id:8,title:'Testing módulo auth',       col:'todo',    prio:'baja', proj:'CreativeHub Intranet',assign:'VF',date:'30 Mar',prog:0,  desc:'Pruebas unitarias auth.'},
  ],
  projs: JSON.parse(localStorage.getItem('tf_p')||'null') || [
    {id:1,name:'TaskFlow MVP',        color:'#2462E9',status:'Activo',   prog:68,members:['VF','EC','CC','AM'],start:'2026-02-01',end:'2026-05-31',prio:'Alta'},
    {id:2,name:'CreativeHub Intranet',color:'#7C3AED',status:'Activo',   prog:42,members:['AM','VF'],          start:'2026-01-10',end:'2026-04-30',prio:'Media'},
    {id:3,name:'Rediseño Portal Web', color:'#D97706',status:'Activo',   prog:18,members:['AM','CC'],          start:'2026-03-01',end:'2026-06-30',prio:'Media'},
    {id:4,name:'App Gestión RRHH',    color:'#94A3B8',status:'Completado',prog:100,members:['VF','EC'],        start:'2025-10-01',end:'2026-02-28',prio:'Baja'},
  ],
  logs: JSON.parse(localStorage.getItem('tf_l')||'null') || [
    {id:1,date:'22 Mar 2026',task:'Diseño de API REST',  proj:'TaskFlow MVP',        start:'10:28',end:'—',   dur:'01:32',active:true},
    {id:2,date:'22 Mar 2026',task:'Setup base de datos', proj:'TaskFlow MVP',        start:'08:00',end:'10:15',dur:'02:15',active:false},
    {id:3,date:'21 Mar 2026',task:'Testing módulo auth', proj:'CreativeHub Intranet',start:'14:00',end:'16:15',dur:'02:15',active:false},
    {id:4,date:'21 Mar 2026',task:'Maquetado dashboard', proj:'TaskFlow MVP',        start:'09:00',end:'13:30',dur:'04:30',active:false},
  ],
};
const save=()=>{localStorage.setItem('tf_t',JSON.stringify(ST.tasks));localStorage.setItem('tf_p',JSON.stringify(ST.projs));localStorage.setItem('tf_l',JSON.stringify(ST.logs))};

/* ── AUTH ── */
function showAuth(screen){
  const ov=document.getElementById('auth-overlay');
  ov.style.display='block'; ov.style.opacity='1';
  document.querySelectorAll('.auth-screen').forEach(s=>{s.classList.remove('show');s.style.display='none'});
  const el=document.getElementById('auth-'+screen);
  if(!el) return;
  if(screen==='recover'){el.style.display='flex';el.style.alignItems='center';el.style.justifyContent='center';el.style.background='var(--bg)'}
  else{el.style.display='flex'}
  el.classList.add('show');
}

function hideAuth(){
  const ov=document.getElementById('auth-overlay');
  ov.style.transition='opacity .4s';
  ov.style.opacity='0';
  setTimeout(()=>{ov.style.display='none'},400);
}

function togglePass(id,btn){
  const inp=document.getElementById(id);
  if(inp.type==='password'){inp.type='text';btn.textContent='🙈'}
  else{inp.type='password';btn.textContent='👁'}
}

function doLogin(e){
  e.preventDefault();
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value;
  const err=document.getElementById('login-err');
  if(!email||!pass){err.style.display='block';err.textContent='Completa todos los campos.';return}
  if(pass.length<4){err.style.display='block';err.textContent='Contraseña muy corta (mínimo 4 caracteres).';return}
  err.style.display='none';
  const initials=email.split('@')[0].slice(0,2).toUpperCase();
  const user={name:email.split('@')[0],email,initials,role:'Empleado'};
  localStorage.setItem('tf_user',JSON.stringify(user));
  updateUserUI(user);
  hideAuth();
  toast('✓ Sesión iniciada','s');
  renderDash();
}

function doRegister(e){
  e.preventDefault();
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value;
  const pass2=document.getElementById('reg-pass2').value;
  const role=document.getElementById('reg-role').value;
  const err=document.getElementById('reg-err');
  if(pass!==pass2){err.style.display='block';err.textContent='Las contraseñas no coinciden.';return}
  if(pass.length<8){err.style.display='block';err.textContent='La contraseña debe tener al menos 8 caracteres.';return}
  err.style.display='none';
  const initials=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const user={name,email,initials,role};
  localStorage.setItem('tf_user',JSON.stringify(user));
  updateUserUI(user);
  hideAuth();
  toast('✓ Cuenta creada. ¡Bienvenido/a '+name+'!','s');
  renderDash();
}

function doRecover(e){
  e.preventDefault();
  document.getElementById('rec-form').style.display='none';
  document.getElementById('rec-ok').style.display='block';
  setTimeout(()=>{
    document.getElementById('rec-form').style.display='flex';
    document.getElementById('rec-ok').style.display='none';
    document.getElementById('rec-email').value='';
    showAuth('login');
  },3000);
}

function updateUserUI(u){
  if(!u) return;
  const in2=u.initials||u.name.slice(0,2).toUpperCase();
  ['sb-av','tb-av'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=in2});
  ['sb-uname'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=u.name});
  const role=document.getElementById('sb-urole');if(role)role.textContent=(u.role||'Empleado')+' · IUJO';
  document.getElementById('dash-greeting').textContent='¡Buenos días, '+u.name.split(' ')[0]+' 👋';
  const pa=document.getElementById('prof-av');if(pa)pa.textContent=in2;
  const pn=document.getElementById('prof-name');if(pn)pn.textContent=u.name;
  const pr=document.getElementById('prof-role');if(pr)pr.textContent=u.role||'Empleado';
  const pe=document.getElementById('prof-email');if(pe)pe.textContent=u.email;
}

/* Check session */
(function(){
  const saved=localStorage.getItem('tf_user');
  if(saved){updateUserUI(JSON.parse(saved));document.getElementById('auth-overlay').style.display='none'}
})();

/* ── SIDEBAR TOGGLE ── */
document.getElementById('sb-tog').addEventListener('click',()=>{
  ST.mini=!ST.mini;
  document.getElementById('sidebar').classList.toggle('mini',ST.mini);
  document.getElementById('main').classList.toggle('wide',ST.mini);
});

/* ── NAVIGATION ── */
const TITLES={dashboard:'Dashboard',projects:'Proyectos','create-project':'Nuevo Proyecto',
  'project-detail':'Detalle del Proyecto',kanban:'Tablero Kanban','task-detail':'Detalle de Tarea',
  timer:'Cronómetro',timelog:'Historial de Tiempo',reports:'Reportes & Usuarios',
  profile:'Mi Perfil',access:'Accesibilidad'};

function nav(el,pageId){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));
  const pg=document.getElementById('pg-'+pageId);
  if(pg){pg.classList.add('active');ST.page=pageId}
  if(el)el.classList.add('active');
  document.getElementById('tb-title').textContent=TITLES[pageId]||pageId;
  window.scrollTo(0,0);
  if(pageId==='dashboard')  renderDash();
  if(pageId==='projects')   renderProjs();
  if(pageId==='kanban')     renderKanban();
  if(pageId==='timelog')    renderLog();
  if(pageId==='reports')    renderRep('week');
  if(pageId==='timer')      renderTmrLog();
  if(pageId==='profile')    renderProfile();
  if(pageId==='project-detail') renderProjDetail();
}

/* ── TOAST ── */
function toast(msg,type='i'){
  const w=document.getElementById('toast-wrap');
  const t=document.createElement('div');
  t.className='toast t'+type;t.textContent=msg;
  w.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(20px)';t.style.transition='.3s';setTimeout(()=>t.remove(),300)},3200);
}

/* ── MODAL ── */
function openM(id){document.getElementById(id).classList.add('open')}
function closeM(id){document.getElementById(id).classList.remove('open')}
document.querySelectorAll('.modal-over').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-over.open').forEach(o=>o.classList.remove('open'))});

/* ── TIMER ── */
const CIRC=2*Math.PI*85;
const fmt=s=>[Math.floor(s/3600),Math.floor((s%3600)/60),s%60].map(n=>String(n).padStart(2,'0')).join(':');

function updateTmr(){
  const d=document.getElementById('tmr-dig');if(d)d.textContent=fmt(ST.tSec);
  const pct=Math.min(ST.tSec/28800,1);
  const off=CIRC-pct*CIRC;
  ['tc-prog','tc-glow'].forEach(id=>{const el=document.getElementById(id);if(el){el.style.strokeDasharray=CIRC;el.style.strokeDashoffset=off}});
  const lbl=document.getElementById('tmr-lbl');
  if(lbl)lbl.textContent=ST.tRun?'en progreso':ST.tPaused?'pausado':'detenido';
  const tod=document.getElementById('d-today');if(tod)tod.textContent=fmt(ST.tSec);
  const ses=document.getElementById('d-ses');if(ses)ses.textContent=ST.tSes;
  const dh=document.getElementById('d-hours');if(dh&&ST.tSec>0){const m=Math.floor(ST.tSec/60);dh.textContent=Math.floor(m/60)+'h '+('0'+m%60).slice(-2)+'m'}
}

function tStart(){
  if(ST.tRun)return;
  ST.tRun=true;ST.tPaused=false;ST.tSes++;
  localStorage.setItem('tf_ts',new Date().toISOString());
  document.getElementById('t-s').style.display='none';
  document.getElementById('t-p').style.display='';
  document.getElementById('t-x').style.display='';
  ST.tInt=setInterval(()=>{ST.tSec++;updateTmr()},1000);
  toast('⏱ Cronómetro iniciado','i');
}
function tPause(){
  if(!ST.tRun)return;
  clearInterval(ST.tInt);ST.tRun=false;ST.tPaused=true;
  document.getElementById('t-s').style.display='';
  document.getElementById('t-s').textContent='▶';
  document.getElementById('t-p').style.display='none';
  updateTmr();toast('⏸ Pausado','i');
}
function tStop(){
  clearInterval(ST.tInt);ST.tRun=false;ST.tPaused=false;
  if(ST.tSec>0){
    const dur=fmt(ST.tSec).slice(0,5);
    const now=new Date();
    ST.logs.unshift({id:Date.now(),date:now.toLocaleDateString('es-VE',{day:'2-digit',month:'short',year:'numeric'}),task:ST.tTask,proj:ST.tProj,start:now.toLocaleTimeString('es-VE',{hour:'2-digit',minute:'2-digit'}),end:'—',dur,active:false});
    save();toast('✓ Registro guardado: '+dur,'s');renderTmrLog();
  }
  ST.tSec=0;updateTmr();localStorage.removeItem('tf_ts');
  document.getElementById('t-s').style.display='';
  document.getElementById('t-s').textContent='▶';
  document.getElementById('t-p').style.display='none';
  document.getElementById('t-x').style.display='none';
}

function renderTmrLog(){
  const el=document.getElementById('tmr-log');if(!el)return;
  el.innerHTML=ST.logs.slice(0,4).map(l=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--bdr)"><div><div style="font-size:.79rem;font-weight:600">${l.task}</div><div style="font-size:.64rem;color:var(--t2)">${l.proj}</div></div><span style="font-family:var(--mono);font-size:.79rem;font-weight:700;color:${l.active?'var(--blue)':'var(--t1)'}">${l.dur}${l.active?' ●':''}</span></div>`).join('');
}

(()=>{const s=localStorage.getItem('tf_ts');if(s){ST.tSec=Math.floor((Date.now()-new Date(s))/1000);tStart()}})();

/* ── KANBAN ── */
const AVC={VF:'av-blue',EC:'av-amb',CC:'av-vio',AM:'av-ros'};
const TAGC={alta:'t-ros',media:'t-amb',baja:'t-grn'};
const TAGL={alta:'Alta',media:'Media',baja:'Baja'};
const COLN={todo:'Por hacer',progress:'En progreso',done:'Completado'};

function renderKanban(){
  ['todo','progress','done'].forEach(col=>{
    const wrap=document.getElementById('cards-'+col);
    const cnt=document.getElementById('cnt-'+col);
    if(!wrap||!cnt)return;
    const tasks=ST.tasks.filter(t=>t.col===col);
    cnt.textContent=tasks.length;
    wrap.innerHTML='';
    tasks.forEach(t=>{
      const card=document.createElement('div');
      card.className='kcard '+t.prio;
      card.draggable=true;card.dataset.id=t.id;
      const done=col==='done';
      card.innerHTML=`<div class="kcard-t" style="${done?'text-decoration:line-through;color:var(--t2)':''}">${t.title}</div>
        <div class="row ai-c g6 wrap"><span class="tag ${TAGC[t.prio]}">${TAGL[t.prio]}</span>${t.proj!=='TaskFlow MVP'?`<span class="tag t-vio" style="font-size:.59rem">${t.proj.split(' ')[0]}</span>`:''}</div>
        ${t.prog>0&&t.prog<100?`<div class="pt h4 mt8"><div class="pf" style="width:${t.prog}%;background:var(--blue)"></div></div>`:''}
        <div class="kcard-f"><span class="kdate">${t.date}</span><div class="row ai-c g8"><div class="av av-s ${AVC[t.assign]||'av-blue'}">${t.assign}</div><button class="btn btn-g btn-xs" style="padding:2px 7px" data-eid="${t.id}">···</button></div></div>`;
      card.addEventListener('dragstart',e=>{ST.dragId=t.id;card.classList.add('dragging');e.dataTransfer.effectAllowed='move'});
      card.addEventListener('dragend',()=>card.classList.remove('dragging'));
      card.querySelector('[data-eid]').addEventListener('click',ev=>{ev.stopPropagation();editTask(t.id)});
      wrap.appendChild(card);
    });
  });
  const pen=ST.tasks.filter(t=>t.col!=='done').length;
  const sb=document.getElementById('sb-cnt');if(sb)sb.textContent=pen;
  const dt=document.getElementById('d-tasks');if(dt)dt.textContent=pen;
}

function initKanbanDrop(){
  ['todo','progress','done'].forEach(col=>{
    const el=document.getElementById('col-'+col);if(!el)return;
    el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('over')});
    el.addEventListener('dragleave',()=>el.classList.remove('over'));
    el.addEventListener('drop',e=>{
      e.preventDefault();el.classList.remove('over');
      if(ST.dragId===null)return;
      const t=ST.tasks.find(x=>x.id===ST.dragId);
      if(t&&t.col!==col){t.col=col;if(col==='done')t.prog=100;if(col==='todo')t.prog=0;save();renderKanban();toast('Tarea → "'+COLN[col]+'"','s')}
      ST.dragId=null;
    });
  });
}

function editTask(id){
  const t=ST.tasks.find(x=>x.id===id);if(!t)return;
  document.getElementById('mt-name').value=t.title;
  document.getElementById('mt-desc').value=t.desc||'';
  document.getElementById('mt-prio').value=t.prio;
  document.getElementById('mt-date').value=t.date;
  document.getElementById('mt-save').onclick=()=>{
    t.title=document.getElementById('mt-name').value.trim()||t.title;
    t.desc=document.getElementById('mt-desc').value;
    t.prio=document.getElementById('mt-prio').value;
    t.date=document.getElementById('mt-date').value;
    save();renderKanban();closeM('m-task');toast('Tarea actualizada','s');
  };
  document.getElementById('mt-del').onclick=()=>{
    ST.tasks=ST.tasks.filter(x=>x.id!==id);save();renderKanban();closeM('m-task');toast('Tarea eliminada','i');
  };
  openM('m-task');
}

function openNewTask(col='todo'){document.getElementById('nt-col').value=col;document.getElementById('nt-form').reset();openM('m-newtask')}
function doNewTask(e){
  e.preventDefault();
  const title=document.getElementById('nt-name').value.trim();if(!title)return;
  ST.tasks.push({id:Date.now(),title,col:document.getElementById('nt-col').value,prio:document.getElementById('nt-prio').value,proj:'TaskFlow MVP',assign:'VF',date:document.getElementById('nt-date').value||'—',prog:0,desc:document.getElementById('nt-desc').value});
  save();renderKanban();closeM('m-newtask');toast('✓ Tarea creada','s');
}
document.getElementById('nt-form').addEventListener('submit',doNewTask);

/* ── DASHBOARD ── */
function renderDash(){
  const tb=document.getElementById('d-tbody');if(!tb)return;
  const pen=ST.tasks.filter(t=>t.col!=='done').slice(0,6);
  tb.innerHTML=pen.map(t=>`<tr><td class="td-p">${t.title}</td><td style="font-size:.75rem">${t.proj}</td><td><span class="tag ${TAGC[t.prio]}">${TAGL[t.prio]}</span></td><td style="font-family:var(--mono);font-size:.71rem">${t.date}</td><td><span class="tag ${t.col==='progress'?'t-blue':'t-gray'}">${t.col==='progress'?'En progreso':'Por hacer'}</span></td></tr>`).join('');
  const dp=document.getElementById('d-projs');if(dp)dp.textContent=ST.projs.filter(p=>p.status==='Activo').length;
  const dt=document.getElementById('d-tasks');if(dt)dt.textContent=ST.tasks.filter(t=>t.col!=='done').length;
}

/* ── PROJECTS ── */
let pfil='all';
function filterP(f,el){pfil=f;document.querySelectorAll('#pg-projects .btn-sm').forEach(b=>{b.className='btn btn-g btn-sm'});if(el)el.className='btn btn-p btn-sm';renderProjs()}
function renderProjs(){
  const w=document.getElementById('proj-list');if(!w)return;
  const list=pfil==='all'?ST.projs:ST.projs.filter(p=>p.status===pfil);
  w.innerHTML=list.map(p=>{
    const avs=p.members.map(m=>`<div class="av av-s ${AVC[m]||'av-blue'}">${m}</div>`).join('');
    const old=p.status==='Completado';
    return `<div class="prow" onclick="nav(document.querySelector('[data-page=project-detail]'),'project-detail')" style="${old?'opacity:.6':''}">
      <div class="prow-color" style="background:${p.color}"></div>
      <div class="f1 mw0"><div class="prow-name">${p.name}</div><div class="prow-meta">${p.start} → ${p.end} · ${p.members.length} miembros · ${p.prio} prioridad</div></div>
      <div class="prow-prog"><div class="row jb mb8"><span style="font-size:.69rem;color:var(--t1)">Avance</span><span style="font-size:.69rem;font-weight:700;color:${p.color}">${p.prog}%</span></div><div class="pt h4"><div class="pf" style="width:${p.prog}%;background:${p.color}"></div></div></div>
      <span class="tag ${old?'t-gray':'t-blue'}">${p.status}</span>
      <div class="av-stack">${avs}</div>
      <button class="btn btn-g btn-sm" onclick="event.stopPropagation();nav(document.querySelector('[data-page=kanban]'),'kanban')">Ver →</button>
    </div>`;
  }).join('');
}

/* ── PROJECT DETAIL ── */
function renderProjDetail(){
  const done=ST.tasks.filter(t=>t.col==='done').length;
  const total=ST.tasks.length;
  const pct=Math.round(done/total*100);
  const pc=document.getElementById('pd-pct');if(pc)pc.textContent=pct+'%';
  const pb=document.getElementById('pd-bar');if(pb)pb.style.width=pct+'%';
  const tc=document.getElementById('pd-tcnt');if(tc)tc.textContent=done+' / '+total;
  const tb=document.getElementById('pd-tbody');
  if(tb)tb.innerHTML=ST.tasks.slice(0,5).map(t=>`<tr><td class="td-p">${t.title}</td><td><div class="row ai-c g8"><div class="av av-s ${AVC[t.assign]||'av-blue'}">${t.assign}</div>${t.assign}</div></td><td><span class="tag ${TAGC[t.prio]}">${TAGL[t.prio]}</span></td><td style="font-family:var(--mono);font-size:.72rem">${t.date}</td><td><span class="tag ${t.col==='done'?'t-grn':t.col==='progress'?'t-blue':'t-gray'}">${t.col==='done'?'Completada':t.col==='progress'?'En progreso':'Por hacer'}</span></td></tr>`).join('');
}

/* ── NEW PROJECT ── */
document.getElementById('proj-form').addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('pf-name').value.trim();if(!name)return;
  ST.projs.push({id:Date.now(),name,color:document.getElementById('pf-color').value,status:'Activo',prog:0,members:['VF'],start:document.getElementById('pf-start').value,end:document.getElementById('pf-end').value,prio:document.getElementById('pf-prio').value});
  save();toast('✓ Proyecto "'+name+'" creado','s');
  nav(document.querySelector('[data-page=projects]'),'projects');
});

/* ── TIMELOG ── */
function renderLog(){
  const tb=document.getElementById('log-tbody');if(!tb)return;
  tb.innerHTML=ST.logs.map(l=>`<tr><td style="font-family:var(--mono);font-size:.7rem">${l.date}</td><td class="td-p">${l.task}</td><td><span class="tag ${l.proj.includes('Intranet')?'t-vio':'t-blue'}">${l.proj.split(' ')[0]}</span></td><td style="font-family:var(--mono);font-size:.7rem">${l.start}</td><td style="font-family:var(--mono);font-size:.7rem">${l.end}</td><td><span style="font-family:var(--mono);font-size:.78rem;font-weight:700;color:${l.active?'var(--blue)':'var(--t1)'}">${l.dur}${l.active?' ●':''}</span></td><td><button class="btn btn-g btn-xs" onclick="toast('Edición guardada','s')">Editar</button></td></tr>`).join('');
  const tot=document.getElementById('log-tot');if(tot)tot.textContent=ST.logs.length+' registros';
}

/* ── REPORTS ── */
function renderRep(period,btn){
  if(btn){document.querySelectorAll('#pg-reports .row.g6 .btn').forEach(b=>b.className='btn btn-g btn-sm');btn.className='btn btn-p btn-sm'}
  const ch=document.getElementById('rep-chart');if(!ch)return;
  const d=period==='month'
    ?[{l:'MVP',v:248,c:'var(--blue)'},{l:'Intranet',v:152,c:'var(--vio)'},{l:'Portal',v:56,c:'var(--amb)'}]
    :[{l:'MVP',v:62,c:'var(--blue)'},{l:'Intranet',v:38,c:'var(--vio)'},{l:'Portal',v:14,c:'var(--amb)'}];
  const max=Math.max(...d.map(x=>x.v));
  ch.innerHTML=d.map(x=>`<div class="bch-item"><span class="bch-val">${x.v}h</span><div class="bch-bar" style="height:${(x.v/max)*100}%;background:${x.c}"></div><span class="bch-lbl">${x.l}</span></div>`).join('');
}

/* ── PROFILE ── */
function renderProfile(){
  const pc=document.getElementById('p-pcount');if(pc)pc.textContent=ST.projs.filter(p=>p.status==='Activo').length;
  const tc=document.getElementById('p-tcount');if(tc)tc.textContent=ST.tasks.filter(t=>t.col!=='done').length;
}

/* ── COMMENTS ── */
function addComment(){
  const inp=document.getElementById('cmt-in');
  const v=inp.value.trim();if(!v)return;
  const list=document.getElementById('cmt-list');
  const item=document.createElement('div');
  item.className='cmt-item';
  const user=JSON.parse(localStorage.getItem('tf_user')||'{}');
  const init=(user.initials||'VF');
  item.innerHTML=`<div class="av av-s av-blue" style="flex-shrink:0">${init}</div><div class="cmt-bub f1"><div class="cmt-txt">${v}</div><div class="cmt-meta">${user.name||'Valeria Fonseca'} · ahora mismo</div></div>`;
  list.appendChild(item);
  inp.value='';toast('Comentario enviado','s');
}

/* ── TOGGLES ── */
document.querySelectorAll('.tog').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));

/* ── FONT SIZE / SPACING ── */
function setSz(el){document.querySelectorAll('#fsz-grp .fsz-btn').forEach(b=>b.classList.remove('on'));el.classList.add('on');toast('Tamaño actualizado','i')}
function setSpc(el){document.querySelectorAll('#spc-grp .fsz-btn').forEach(b=>b.classList.remove('on'));el.classList.add('on')}

/* ── CHAT ── */
function toggleChat(){document.getElementById('chat-panel').classList.toggle('open')}
function setCI(el){document.getElementById('chat-in').value=el.textContent;document.getElementById('chat-in').focus()}
function sendChat(){const v=document.getElementById('chat-in').value.trim();if(!v)return;toast('🤖 Procesando...','i');document.getElementById('chat-in').value=''}

/* ── SEARCH ── */
document.getElementById('s-input').addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();if(!q)return;
  const t=ST.tasks.find(x=>x.title.toLowerCase().includes(q));
  const p=ST.projs.find(x=>x.name.toLowerCase().includes(q));
  if(t)toast('Tarea: "'+t.title+'"','i');
  else if(p)toast('Proyecto: "'+p.name+'"','i');
});

/* ── TOPBAR NOTIF ── */
document.getElementById('tb-notif').addEventListener('click',()=>toast('3 notificaciones pendientes','i'));

/* ── INIT ── */
initKanbanDrop();
renderDash();
renderKanban();
renderLog();
renderRep('week');
renderTmrLog();
updateTmr();