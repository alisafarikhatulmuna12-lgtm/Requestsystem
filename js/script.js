
// ═══ DATA & STATE ═══
let role = 'karyawan';
let prevPage = 'dashboard';
let openedId = null;
let pendAct = null;
let curRMFilter = 'all';

const ROLE_INFO = {
  karyawan:{ name:'Asna', label:'Karyawan', ic:'A', av:'av-blue' },
  atasan:  { name:'Rudi', label:'Atasan',   ic:'R', av:'av-green' },
  admin:   { name:'Admin', label:'Admin',   ic:'Ad', av:'av-purple' }
};

let reqs = [
  {id:1,nama:'Asna', jenis:'Izin Kerja',          tgl:'10/05/2026',tglA:'10/05/2026',status:'Pending',   cat:'-',                                      desc:'Saya izin tidak masuk kerja karena ada keperluan keluarga.'},
  {id:2,nama:'Asna', jenis:'Lembur',               tgl:'08/05/2026',tglA:'08/05/2026',status:'Disetujui', cat:'-',                                      desc:'Lembur menyelesaikan project deadline.'},
  {id:3,nama:'Asna', jenis:'Permintaan Alat Kerja',tgl:'05/05/2026',tglA:'05/05/2026',status:'Ditolak',   cat:'Stok tidak tersedia.',                   desc:'Membutuhkan laptop baru untuk pekerjaan.'},
  {id:4,nama:'Asna', jenis:'Reimbursement',        tgl:'02/05/2026',tglA:'02/05/2026',status:'Disetujui', cat:'-',                                      desc:'Reimbursement biaya transport dinas.'},
  {id:5,nama:'Dika', jenis:'Lembur',               tgl:'11/05/2026',tglA:'11/05/2026',status:'Pending',   cat:'-',                                      desc:'Lembur laporan keuangan akhir bulan.'},
  {id:6,nama:'Putri',jenis:'Cuti Tahunan',         tgl:'10/05/2026',tglA:'15/05/2026',status:'Pending',   cat:'-',                                      desc:'Mengambil jatah cuti tahunan.'},
  {id:7,nama:'Sari', jenis:'Izin Kerja',           tgl:'09/05/2026',tglA:'09/05/2026',status:'Disetujui', cat:'Izin disetujui, tetap jaga tanggung jawab.',desc:'Ada acara keluarga mendadak.'},
];

let users = [
  {id:1,nama:'Asna Pratiwi',email:'asna@co.com',  dept:'HRD',     rl:'Karyawan',status:'Aktif'},
  {id:2,nama:'Rudi Santoso', email:'rudi@co.com',  dept:'IT',      rl:'Atasan',  status:'Aktif'},
  {id:3,nama:'Dika Rahmat',  email:'dika@co.com',  dept:'Finance', rl:'Karyawan',status:'Aktif'},
  {id:4,nama:'Putri Ayu',    email:'putri@co.com', dept:'Marketing',rl:'Karyawan',status:'Aktif'},
  {id:5,nama:'Sari Dewi',    email:'sari@co.com',  dept:'Ops',     rl:'Atasan',  status:'Nonaktif'},
];

let notifs = [
  {id:1,title:'Request Lembur Disetujui',  desc:'Request Lembur Anda pada 8 Mei telah disetujui.',         time:'10 menit lalu',read:false},
  {id:2,title:'Request Ditolak',           desc:'Permintaan Alat Kerja ditolak. Stok tidak tersedia.',     time:'2 jam lalu',   read:false},
  {id:3,title:'Request Baru Masuk',        desc:'Dika mengajukan request Lembur untuk 11 Mei 2026.',       time:'5 jam lalu',   read:true},
  {id:4,title:'Pengingat Approval',        desc:'Ada 3 request menunggu persetujuan Anda.',                time:'1 hari lalu',  read:true},
  {id:5,title:'Update Sistem',             desc:'Sistem telah diperbarui ke versi terbaru.',               time:'2 hari lalu',  read:true},
];

const NAV = {
  karyawan:[
    {id:'dashboard',   ic:'🏠',label:'Dashboard'},
    {id:'ajukan',      ic:'📝',label:'Ajukan Request'},
    {id:'list-request',ic:'📋',label:'List Request'},
    {id:'absensi', label:'Absensi', ic:'📅'},
    {id:'riwayat',     ic:'📜',label:'Riwayat'},
    {id:'kpi-riwayat', ic:'📈',label:'Hasil KPI Saya'},
    {id:'notifikasi',  ic:'🔔',label:'Notifikasi',badge:2},
    {id:'pengaturan',  ic:'⚙️',label:'Pengaturan'},
  ],
  atasan:[
    {id:'dashboard',    ic:'🏠',label:'Dashboard'},
    {id:'request-masuk',ic:'📥',label:'Request Masuk',badge:3},
    {id:'absensi',      ic:'📍',label:'Absensi Karyawan'},
    {id:'kpi',          ic:'📊',label:'Penilaian KPI'},
    {id:'kpi-riwayat',  ic:'📈',label:'Riwayat KPI'},
    {id:'list-request', ic:'📋',label:'List Request'},
    {id:'riwayat',      ic:'📜',label:'Riwayat'},
    {id:'notifikasi',   ic:'🔔',label:'Notifikasi',badge:1},
    {id:'pengaturan',   ic:'⚙️',label:'Pengaturan'},
  ],
  admin:[
    {id:'dashboard',    ic:'🏠',label:'Dashboard'},
    {id:'request-masuk',ic:'📥',label:'Semua Request',badge:3},
    {id:'kelola-user',  ic:'👥',label:'Kelola User'},
    {id:'list-request', ic:'📋',label:'List Request'},
    {id:'notifikasi',   ic:'🔔',label:'Notifikasi'},
    {id:'pengaturan',   ic:'⚙️',label:'Pengaturan'},
  ]
};

// ═══ DARK MODE SYSTEM ═══
function initDarkMode(){
  const saved = localStorage.getItem('darkMode');
  const isDark = saved === 'true';
  const toggle = document.getElementById('t4');
  if(isDark){
    document.documentElement.setAttribute('data-theme', 'dark');
    if(toggle) toggle.classList.add('on');
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(toggle) toggle.classList.remove('on');
  }
}

function toggleDarkMode(){
  const toggle = document.getElementById('t4');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if(!isDark){
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkMode', 'true');
    if(toggle) toggle.classList.add('on');
    toast('🌙 Mode Gelap diaktifkan');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('darkMode', 'false');
    if(toggle) toggle.classList.remove('on');
    toast('☀️ Mode Terang diaktifkan');
  }
}
// ═══ KPI DATA ═══
const KPI_INDICATORS = [
  {id:'disiplin',    name:'Kedisiplinan',    desc:'Kehadiran, ketepatan waktu, kepatuhan aturan'},
  {id:'produktivitas',name:'Produktivitas',   desc:'Volume dan efisiensi pekerjaan yang diselesaikan'},
  {id:'kualitas',    name:'Kualitas Kerja',    desc:'Ketelitian, kecermatan, minim kesalahan'},
  {id:'kerjasama',   name:'Kerja Sama',        desc:'Kolaborasi dengan tim, komunikasi, sikap membantu'},
  {id:'inisiatif',   name:'Inisiatif',         desc:'Proaktif, kreativitas, inovasi dalam pekerjaan'},
];

const KPI_SCORE_LABELS = ['Buruk','Kurang','Cukup','Baik','Sangat Baik'];

let kpiRecords = [
  {id:1,karyawanId:3,karyawanNama:'Dika Rahmat',dept:'Finance',periode:'Q1 2026',status:'Sudah Dinilai',tanggal:'15/03/2026',
   scores:{disiplin:4,produktivitas:3,kualitas:4,kerjasama:5,inisiatif:4},catatan:'Perlu meningkatkan produktivitas kerja.',total:20},
  {id:2,karyawanId:4,karyawanNama:'Putri Ayu',dept:'Marketing',periode:'Q1 2026',status:'Sudah Dinilai',tanggal:'15/03/2026',
   scores:{disiplin:5,produktivitas:4,kualitas:4,kerjasama:4,inisiatif:5},catatan:'Performa sangat baik, terus pertahankan.',total:22},
  {id:3,karyawanId:1,karyawanNama:'Asna Pratiwi',dept:'HRD',periode:'Q2 2026',status:'Belum Dinilai',tanggal:'-',scores:{},catatan:'',total:0},
  {id:4,karyawanId:3,karyawanNama:'Dika Rahmat',dept:'Finance',periode:'Q2 2026',status:'Belum Dinilai',tanggal:'-',scores:{},catatan:'',total:0},
  {id:5,karyawanId:4,karyawanNama:'Putri Ayu',dept:'Marketing',periode:'Q2 2026',status:'Belum Dinilai',tanggal:'-',scores:{},catatan:'',total:0},
];

let currentKPIId = null;
let currentKPIScores = {};


// ═══ ABSENSI DATA ═══
const ABSENSI_STATUS = {
  'Hadir': {class:'t-appr', icon:'✅'},
  'Terlambat': {class:'t-pend', icon:'⏰'},
  'Izin': {class:'t-pend', icon:'📋'},
  'Sakit': {class:'t-pend', icon:'🏥'},
  'Alpha': {class:'t-rej', icon:'❌'}
};

let absensiData = [
  {id:1,nama:'Asna Pratiwi',dept:'HRD',tanggal:'06/05/2026',jamMasuk:'08:00',jamKeluar:'17:00',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:2,nama:'Asna Pratiwi',dept:'HRD',tanggal:'05/05/2026',jamMasuk:'08:15',jamKeluar:'17:00',status:'Terlambat',lokasi:'Kantor Pusat',keterangan:'Macet di jalan tol'},
  {id:3,nama:'Asna Pratiwi',dept:'HRD',tanggal:'02/05/2026',jamMasuk:'-',jamKeluar:'-',status:'Izin',lokasi:'-',keterangan:'Izin keluarga'},
  {id:4,nama:'Dika Rahmat',dept:'Finance',tanggal:'06/05/2026',jamMasuk:'07:55',jamKeluar:'17:05',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:5,nama:'Dika Rahmat',dept:'Finance',tanggal:'05/05/2026',jamMasuk:'08:00',jamKeluar:'17:00',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:6,nama:'Putri Ayu',dept:'Marketing',tanggal:'06/05/2026',jamMasuk:'08:30',jamKeluar:'17:00',status:'Terlambat',lokasi:'Kantor Pusat',keterangan:'Kendala transport'},
  {id:7,nama:'Putri Ayu',dept:'Marketing',tanggal:'05/05/2026',jamMasuk:'-',jamKeluar:'-',status:'Sakit',lokasi:'-',keterangan:'Sakit demam'},
  {id:8,nama:'Sari Dewi',dept:'Ops',tanggal:'06/05/2026',jamMasuk:'-',jamKeluar:'-',status:'Alpha',lokasi:'-',keterangan:'Tidak ada keterangan'},
  {id:9,nama:'Sari Dewi',dept:'Ops',tanggal:'05/05/2026',jamMasuk:'08:00',jamKeluar:'17:00',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:10,nama:'Rudi Santoso',dept:'IT',tanggal:'06/05/2026',jamMasuk:'07:45',jamKeluar:'17:10',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:11,nama:'Rudi Santoso',dept:'IT',tanggal:'05/05/2026',jamMasuk:'08:00',jamKeluar:'17:00',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:12,nama:'Asna Pratiwi',dept:'HRD',tanggal:'01/05/2026',jamMasuk:'-',jamKeluar:'-',status:'Izin',lokasi:'-',keterangan:'Libur nasional'},
  {id:13,nama:'Dika Rahmat',dept:'Finance',tanggal:'01/05/2026',jamMasuk:'-',jamKeluar:'-',status:'Izin',lokasi:'-',keterangan:'Libur nasional'},
  {id:14,nama:'Putri Ayu',dept:'Marketing',tanggal:'04/05/2026',jamMasuk:'08:00',jamKeluar:'17:00',status:'Hadir',lokasi:'Kantor Pusat',keterangan:'-'},
  {id:15,nama:'Sari Dewi',dept:'Ops',tanggal:'04/05/2026',jamMasuk:'08:20',jamKeluar:'17:00',status:'Terlambat',lokasi:'Kantor Pusat',keterangan:'Hujan deras'},
];

let currentAbsensiId = null;

// ═══ INIT ═══
function init(){ 
  initDarkMode();
  switchRole('karyawan'); 
}

function switchRole(r){
  role = r;
  const info = ROLE_INFO[r];
  document.getElementById('roleSelect').value = r;
  const av = document.getElementById('topAv');
  av.textContent = info.ic;
  av.className = 'av ' + info.av;
  document.getElementById('pNama').value = info.name;
  document.getElementById('pRole').value = info.label;
  buildNav(r);
  updateNotifDot();
  nav('dashboard');
}

function buildNav(r){
  const el = document.getElementById('sbNav');
  el.innerHTML = '';
  NAV[r].forEach(item=>{
    const d = document.createElement('div');
    d.className = 'sb-item';
    d.id = 'sbn-'+item.id;
    d.onclick = ()=>nav(item.id);
    d.innerHTML = `<span class="si">${item.ic}</span>${item.label}${item.badge?`<span class="sbadge">${item.badge}</span>`:''}`;
    el.appendChild(d);
  });
}

function nav(pageId){
  if(pageId !== 'detail') prevPage = pageId;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.sb-item').forEach(n=>n.classList.remove('act'));
  const p = document.getElementById('p-'+pageId);
  if(p){ p.classList.add('on'); }
  const nb = document.getElementById('sbn-'+pageId);
  if(nb) nb.classList.add('act');
  const lbls = {dashboard:'Dashboard',ajukan:'Ajukan Request','list-request':'List Request',
    riwayat:'Riwayat',notifikasi:'Notifikasi',pengaturan:'Pengaturan',
    'request-masuk':'Request Masuk','kelola-user':'Kelola User',detail:'Detail Request',
    'kpi':'Penilaian KPI','kpi-form':'Form Penilaian KPI','kpi-detail':'Detail Hasil KPI','kpi-riwayat':'Riwayat Penilaian KPI',
    'absensi':'Absensi Karyawan','absensi-detail':'Detail Absensi Karyawan'};
  document.getElementById('tbTitle').textContent = lbls[pageId]||pageId;

  if(pageId==='dashboard') renderDash();
  else if(pageId==='list-request') renderLR();
  else if(pageId==='riwayat') renderRiwayat();
  else if(pageId==='notifikasi') renderNotif();
  else if(pageId==='request-masuk') renderRM(curRMFilter);
  else if(pageId==='kelola-user') renderUsers();
  else if(pageId==='kpi') renderKPI();
  else if(pageId==='kpi-riwayat') renderKPIRiwayat();
  else if(pageId==='kpi-form') renderKPIForm();
  else if(pageId==='kpi-detail') renderKPIDetail();
  else if(pageId==='absensi') renderAbsensi();
  else if(pageId==='absensi-detail') renderAbsensiDetail();
}

function goBack(){
  nav(prevPage);
}

// ═══ DASHBOARD ═══
function renderDash(){
  const mine = myReqs();
  document.getElementById('stTotal').textContent = mine.length;
  document.getElementById('stPend').textContent  = mine.filter(r=>r.status==='Pending').length;
  document.getElementById('stAppr').textContent  = mine.filter(r=>r.status==='Disetujui').length;
  document.getElementById('stRej').textContent   = mine.filter(r=>r.status==='Ditolak').length;
  document.getElementById('wgText').textContent  = `Selamat datang, ${ROLE_INFO[role].name}! 👋`;
  const tb = document.getElementById('dashTb');
  tb.innerHTML = mine.slice(0,4).map((r,i)=>`<tr>
    <td>${i+1}</td><td><strong>${r.jenis}</strong></td><td>${r.tgl}</td>
    <td><span class="tag ${tc(r.status)}">${r.status}</span></td>
    <td><button class="btn btn-outline btn-sm" onclick="openDetail(${r.id})">Lihat</button></td>
  </tr>`).join('');
}

function myReqs(){
  return role==='karyawan'? reqs.filter(r=>r.nama===ROLE_INFO[role].name) : reqs;
}

// ═══ LIST REQUEST ═══
function renderLR(){
  const isSuper = role!=='karyawan';
  document.getElementById('lrSub').textContent = isSuper ? 'Semua request karyawan.' : 'Semua request yang pernah Anda ajukan.';
  document.getElementById('btnBaru').style.display = role==='karyawan'?'inline-flex':'none';
  const head = document.getElementById('lrHead');
  head.innerHTML = isSuper
    ? '<th>No</th><th>Nama</th><th>Jenis Request</th><th>Tanggal</th><th>Status</th><th>Aksi</th>'
    : '<th>No</th><th>Jenis Request</th><th>Tanggal</th><th>Status</th><th>Aksi</th>';

  const tabs = document.getElementById('lrTabs');
  const base = myReqs();
  if(role==='karyawan'){
    tabs.innerHTML = `
      <div class="tab act" onclick="lrTab('',this)">Semua <span class="tb">${base.length}</span></div>
      <div class="tab" onclick="lrTab('Pending',this)">Pending <span class="tb">${base.filter(r=>r.status==='Pending').length}</span></div>
      <div class="tab" onclick="lrTab('Disetujui',this)">Disetujui <span class="tb">${base.filter(r=>r.status==='Disetujui').length}</span></div>
      <div class="tab" onclick="lrTab('Ditolak',this)">Ditolak <span class="tb">${base.filter(r=>r.status==='Ditolak').length}</span></div>`;
    tabs.style.display='flex';
  } else { tabs.style.display='none'; }
  doRenderLR();
}

function lrTab(s,el){
  document.querySelectorAll('#lrTabs .tab').forEach(t=>t.classList.remove('act'));
  el.classList.add('act');
  document.getElementById('lrStatus').value=s;
  doRenderLR();
}

function doRenderLR(){
  const isSuper = role!=='karyawan';
  const base = myReqs();
  const fs = document.getElementById('lrStatus').value;
  const fj = document.getElementById('lrJenis').value;
  const sq = document.getElementById('lrSearch').value.toLowerCase();
  const list = base.filter(r=>{
    if(fs && r.status!==fs) return false;
    if(fj && r.jenis!==fj) return false;
    if(sq && !r.jenis.toLowerCase().includes(sq) && !r.nama.toLowerCase().includes(sq)) return false;
    return true;
  });
  const tb = document.getElementById('lrTb');
  if(!list.length){ tb.innerHTML=`<tr><td colspan="${isSuper?6:5}" style="text-align:center;padding:28px;color:var(--text-light)">Tidak ada data</td></tr>`; return; }
  tb.innerHTML = list.map((r,i)=>{
    const acts = buildActs(r,'lr');
    return isSuper
      ? `<tr><td>${i+1}</td><td><strong>${r.nama}</strong></td><td>${r.jenis}</td><td>${r.tgl}</td><td><span class="tag ${tc(r.status)}">${r.status}</span></td><td><div class="abtns">${acts}</div></td></tr>`
      : `<tr><td>${i+1}</td><td>${r.jenis}</td><td>${r.tgl}</td><td><span class="tag ${tc(r.status)}">${r.status}</span></td><td><div class="abtns">${acts}</div></td></tr>`;
  }).join('');
}

function buildActs(r,src){
  let b = `<button class="btn btn-outline btn-sm" onclick="openDetail(${r.id})">Lihat</button>`;
  if(r.status==='Pending' && role!=='karyawan'){
    b += `<button class="ib ib-g" onclick="triggerAction(${r.id},'approve')" title="Setujui">✓</button>`;
    b += `<button class="ib ib-r" onclick="triggerAction(${r.id},'reject')" title="Tolak">✗</button>`;
  }
  if(r.status==='Pending' && role==='karyawan'){
    b += `<button class="btn btn-ghost btn-sm" onclick="cancelReq(${r.id})">Batal</button>`;
  }
  return b;
}

// ═══ REQUEST MASUK ═══
function renderRM(filter){
  curRMFilter = filter;
  const list = filter==='all' ? reqs : reqs.filter(r=>r.status===filter);

  document.getElementById('rmTabAll').textContent = reqs.length;
  document.getElementById('rmTabPend').textContent = reqs.filter(r=>r.status==='Pending').length;
  document.getElementById('rmTabAppr').textContent = reqs.filter(r=>r.status==='Disetujui').length;
  document.getElementById('rmTabRej').textContent = reqs.filter(r=>r.status==='Ditolak').length;

  const tb = document.getElementById('rmTb');
  if(!list.length){ tb.innerHTML='<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text-light)">Tidak ada data</td></tr>'; return; }
  tb.innerHTML = list.map((r,i)=>`<tr>
    <td>${i+1}</td><td><strong>${r.nama}</strong></td><td>${r.jenis}</td><td>${r.tgl}</td>
    <td><span class="tag ${tc(r.status)}">${r.status}</span></td>
    <td><div class="abtns">
      <button class="btn btn-outline btn-sm" onclick="openDetail(${r.id})">Detail</button>
      ${r.status==='Pending'?`<button class="ib ib-g" onclick="triggerAction(${r.id},'approve')" title="Setujui">✓</button><button class="ib ib-r" onclick="triggerAction(${r.id},'reject')" title="Tolak">✗</button>`:''}
    </div></td>
  </tr>`).join('');
}

function filterRM(f,el){
  document.querySelectorAll('#rmTabs .tab').forEach(t=>t.classList.remove('act'));
  el.classList.add('act');
  renderRM(f);
}

// ═══ RIWAYAT ═══
function renderRiwayat(){
  const base = myReqs();
  const fs = document.getElementById('riwStatus').value;
  const fj = document.getElementById('riwJenis').value;
  const list = base.filter(r=>(!fs||r.status===fs)&&(!fj||r.jenis===fj));
  const tb = document.getElementById('riwTb');
  if(!list.length){ tb.innerHTML='<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text-light)">Tidak ada data</td></tr>'; return; }
  tb.innerHTML = list.map((r,i)=>`<tr>
    <td>${i+1}</td><td>${r.jenis}</td><td>${r.tgl}</td>
    <td><span class="tag ${tc(r.status)}">${r.status}</span></td>
    <td style="font-size:11.5px;color:var(--text-muted);max-width:160px">${r.cat}</td>
    <td><button class="btn btn-outline btn-sm" onclick="openDetail(${r.id})">Detail</button></td>
  </tr>`).join('');
}

// ═══ NOTIFIKASI ═══
function renderNotif(){
  document.getElementById('notifList').innerHTML = notifs.map(n=>`
    <div class="ni">
      <div class="ndot2 ${n.read?'nd-old':'nd-new'}" style="margin-top:5px"></div>
      <div style="flex:1">
        <div class="nt" style="${n.read?'font-weight:500;color:var(--text-muted)':''}">${n.title}</div>
        <div class="nd">${n.desc}</div>
        <div class="ntime">🕐 ${n.time}</div>
      </div>
      ${!n.read?`<button class="btn btn-ghost btn-sm" onclick="readN(${n.id})">Baca</button>`:''}
    </div>`).join('');
}
function readN(id){ const n=notifs.find(x=>x.id===id); if(n){n.read=true; renderNotif(); updateNotifDot(); toast('✓ Ditandai dibaca');} }
function markAll(){ notifs.forEach(n=>n.read=true); renderNotif(); updateNotifDot(); toast('✓ Semua dibaca'); }

function updateNotifDot(){
  const dot = document.getElementById('topNotifDot');
  const unread = notifs.filter(n=>!n.read).length;
  if(unread > 0) dot.classList.remove('hidden');
  else dot.classList.add('hidden');
}

// ═══ DETAIL ═══
function openDetail(id){
  const r = reqs.find(x=>x.id===id);
  if(!r) return;
  openedId = id;

  const info = document.getElementById('detailInfo');
  info.innerHTML = `
    <div class="dr"><span class="dl">Nama Pengaju</span><span class="dv">${r.nama}</span></div>
    <div class="dr"><span class="dl">Jenis Request</span><span class="dv">${r.jenis}</span></div>
    <div class="dr"><span class="dl">Tanggal Pengajuan</span><span class="dv">${r.tgl}</span></div>
    <div class="dr"><span class="dl">Tanggal Required</span><span class="dv">${r.tglA}</span></div>
    <div class="dr"><span class="dl">Status</span><span class="dv"><span class="tag ${tc(r.status)}">${r.status}</span></span></div>
    <div class="dr"><span class="dl">Catatan</span><span class="dv">${r.cat}</span></div>
    <hr style="border:none;border-top:1px solid var(--border-color);margin:12px 0">
    <div style="font-size:12px;font-weight:600;color:var(--text-light);margin-bottom:6px">Deskripsi</div>
    <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.65;background:var(--bg-hover);padding:12px;border-radius:7px">${r.desc}</div>
    ${r.cat!=='-'&&r.status!=='Pending'?`<div style="margin-top:12px;font-size:12px;font-weight:600;color:var(--text-light);margin-bottom:6px">Catatan Atasan</div><div style="font-size:12.5px;color:var(--text-secondary);background:${r.status==='Disetujui'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)'};padding:10px;border-radius:7px">${r.cat}</div>`:''}`;

  const actBody = document.getElementById('detailActionBody');
  if(r.status==='Pending' && role!=='karyawan'){
    actBody.innerHTML = `
      <div class="dr"><span class="dl">Status</span><span class="dv"><span class="tag t-pend">Pending</span></span></div>
      <div style="margin-top:12px">
        <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:8px">Catatan (opsional)</div>
        <textarea class="fc" id="detNote" style="min-height:70px" placeholder="Tambahkan catatan..."></textarea>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-red" style="flex:1" onclick="doAction(${r.id},'reject')">✗ Tolak</button>
        <button class="btn btn-green" style="flex:1" onclick="doAction(${r.id},'approve')">✓ Setujui</button>
      </div>`;
  } else {
    actBody.innerHTML = `
      <div class="dr"><span class="dl">Status Akhir</span><span class="dv"><span class="tag ${tc(r.status)}">${r.status}</span></span></div>
      ${r.status==='Disetujui'?`<div style="margin-top:10px;background:var(--tag-appr-bg);color:var(--tag-appr-text);padding:10px;border-radius:7px;font-size:12.5px">✅ Request telah disetujui</div>`:r.status==='Ditolak'?`<div style="margin-top:10px;background:var(--tag-rej-bg);color:var(--tag-rej-text);padding:10px;border-radius:7px;font-size:12.5px">❌ Request ditolak: ${r.cat}</div>`:''}`;
  }

  nav('detail');
}

function doAction(id,type){
  const note = document.getElementById('detNote')?document.getElementById('detNote').value.trim():'';
  processAction(id,type,note);
  goBack();
}

// ═══ TRIGGER ACTION (MODAL) ═══
function triggerAction(id,type){
  pendAct = {id,type};
  const r = reqs.find(x=>x.id===id);
  document.getElementById('mActTitle').textContent = type==='approve'?'✓ Setujui Request':'✗ Tolak Request';
  document.getElementById('mActDesc').textContent = `Anda akan ${type==='approve'?'menyetujui':'menolak'} request "${r.jenis}" dari ${r.nama}.`;
  const btn = document.getElementById('mActBtn');
  btn.className = `btn ${type==='approve'?'btn-green':'btn-red'}`;
  btn.textContent = type==='approve'?'✓ Setujui':'✗ Tolak';
  document.getElementById('mActNote').value='';
  openModal('mAction');
}

function confirmAction(){
  if(!pendAct) return;
  const note = document.getElementById('mActNote').value.trim();
  processAction(pendAct.id,pendAct.type,note);
  closeModal('mAction');
  pendAct=null;
  if(document.getElementById('p-request-masuk').classList.contains('on')) renderRM(curRMFilter);
  else if(document.getElementById('p-list-request').classList.contains('on')) doRenderLR();
  else if(document.getElementById('p-riwayat').classList.contains('on')) renderRiwayat();
  else if(document.getElementById('p-dashboard').classList.contains('on')) renderDash();
}

function processAction(id,type,note){
  const r = reqs.find(x=>x.id===id);
  r.status = type==='approve'?'Disetujui':'Ditolak';
  r.cat = note||(type==='approve'?'Disetujui oleh atasan.':'Ditolak oleh atasan.');
  notifs.unshift({id:Date.now(),title:type==='approve'?`Request ${r.jenis} Disetujui`:`Request ${r.jenis} Ditolak`,desc:`${r.jenis} dari ${r.nama} telah ${type==='approve'?'disetujui':'ditolak'}.`,time:'Baru saja',read:false});
  updateNotifDot();
  toast(type==='approve'?'✅ Request disetujui':'❌ Request ditolak');
}

// ═══ SUBMIT REQUEST ═══
function submitRequest(){
  const jenis = document.getElementById('ajJenis').value;
  const tgl = document.getElementById('ajTgl').value;
  const desc = document.getElementById('ajDesc').value.trim();
  const al = document.getElementById('ajAlert');
  if(!jenis||!tgl||!desc){ al.innerHTML=`<div class="alert al-e">⚠️ Harap isi semua field wajib.</div>`; return; }
  const d=new Date(tgl);
  const ft=`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  reqs.unshift({id:Date.now(),nama:ROLE_INFO[role].name,jenis,tgl:ft,tglA:ft,status:'Pending',cat:'-',desc});
  al.innerHTML=''; resetAjukan();
  toast('✅ Request berhasil dikirim!');
  notifs.unshift({id:Date.now(),title:`Request ${jenis} Dikirim`,desc:`Request Anda menunggu persetujuan atasan.`,time:'Baru saja',read:false});
  updateNotifDot();
  nav('list-request');
}
function resetAjukan(){
  document.getElementById('ajJenis').value='';
  document.getElementById('ajTgl').value='2026-05-12';
  document.getElementById('ajDesc').value='';
  document.getElementById('ajFileLbl').textContent='📎 Choose File   Tidak ada file chosen';
  document.getElementById('ajAlert').innerHTML='';
}

function cancelReq(id){ if(confirm('Batalkan request ini?')){ reqs=reqs.filter(r=>r.id!==id); doRenderLR(); renderDash(); toast('🗑️ Request dibatalkan'); } }

// ═══ USERS ═══
function renderUsers(){
  document.getElementById('userTb').innerHTML = users.map((u,i)=>`<tr>
    <td>${i+1}</td><td><strong>${u.nama}</strong></td><td style="font-size:11.5px">${u.email}</td><td>${u.dept}</td>
    <td><span class="rb ${u.rl==='Admin'?'rb-ad':u.rl==='Atasan'?'rb-a':'rb-k'}">${u.rl}</span></td>
    <td><span class="tag ${u.status==='Aktif'?'t-appr':'t-rej'}">${u.status}</span></td>
    <td><div class="abtns"><button class="btn btn-outline btn-sm" onclick="toast('✏️ Edit user segera hadir')">Edit</button><button class="btn btn-sm btn-red" onclick="delUser(${u.id})">Hapus</button></div></td>
  </tr>`).join('');
}
function addUser(){
  const n=document.getElementById('nuName').value.trim();
  const e=document.getElementById('nuEmail').value.trim();
  if(!n||!e){toast('⚠️ Nama & email wajib diisi');return;}
  users.push({id:Date.now(),nama:n,email:e,dept:document.getElementById('nuDept').value,rl:document.getElementById('nuRole').value,status:'Aktif'});
  closeModal('mAddUser'); renderUsers(); toast('✅ User ditambahkan');
}
function delUser(id){ if(confirm('Hapus user ini?')){ users=users.filter(u=>u.id!==id); renderUsers(); toast('🗑️ User dihapus'); } }

// ═══ HELPERS ═══
function tc(s){ return s==='Pending'?'t-pend':s==='Disetujui'?'t-appr':'t-rej'; }
function openModal(id){ document.getElementById(id).classList.add('on'); }
function closeModal(id){ document.getElementById(id).classList.remove('on'); }
function handleFile(input,lblId){ const f=input.files[0]; if(f) document.getElementById(lblId).innerHTML=`<span class="fi-sel">📎 ${f.name}</span>`; }
function togSet(id){ const e=document.getElementById(id); e.classList.toggle('on'); toast(e.classList.contains('on')?'🔔 Diaktifkan':'🔕 Dinonaktifkan'); }
function toast(msg){
  const t=document.getElementById('toast');
  const d=document.createElement('div'); d.className='toast-i'; d.textContent=msg; t.appendChild(d);
  setTimeout(()=>{ d.style.opacity='0'; d.style.transform='translateX(20px)'; d.style.transition='.3s'; setTimeout(()=>d.remove(),300); },3000);
}


function renderKPI(){
  const dept = document.getElementById('kpiDept').value;
  const search = document.getElementById('kpiSearch').value.toLowerCase();
  
  // Filter records untuk atasan (semua karyawan) atau karyawan (hanya dirinya)
  let list = role === 'karyawan' 
    ? kpiRecords.filter(r => r.karyawanNama === ROLE_INFO[role].name)
    : [...kpiRecords];
  
  if(dept) list = list.filter(r => r.dept === dept);
  if(search) list = list.filter(r => r.karyawanNama.toLowerCase().includes(search));
  
  const tb = document.getElementById('kpiTb');
  if(!list.length){ tb.innerHTML='<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--text-light)">Tidak ada data</td></tr>'; return; }
  
  tb.innerHTML = list.map((r,i) => {
    const scoreClass = r.total >= 23 ? 'score-excellent' : r.total >= 18 ? 'score-good' : r.total >= 13 ? 'score-average' : 'score-poor';
    const scoreDisplay = r.status === 'Sudah Dinilai' ? `<span class="${scoreClass}" style="font-weight:700">${r.total}/25</span>` : '-';
    const statusTag = r.status === 'Sudah Dinilai' 
      ? '<span class="tag t-appr">Sudah Dinilai</span>' 
      : '<span class="tag t-pend">Belum Dinilai</span>';
    
    let actions = `<button class="btn btn-outline btn-sm" onclick="openKPIDetail(${r.id})">Lihat</button>`;
    if(r.status === 'Belum Dinilai' && role !== 'karyawan'){
      actions += ` <button class="btn btn-primary btn-sm" onclick="openKPIForm(${r.id})">Nilai</button>`;
    }
    
    return `<tr>
      <td>${i+1}</td>
      <td><strong>${r.karyawanNama}</strong></td>
      <td>${r.dept}</td>
      <td>${r.periode}</td>
      <td>${statusTag}</td>
      <td>${scoreDisplay}</td>
      <td><div class="abtns">${actions}</div></td>
    </tr>`;
  }).join('');
}

function openKPIForm(id){
  currentKPIId = id;
  currentKPIScores = {};
  const r = kpiRecords.find(x => x.id === id);
  if(!r) return;
  
  document.getElementById('kpiFormInfo').innerHTML = `
    <div class="dr"><span class="dl">Nama Karyawan</span><span class="dv">${r.karyawanNama}</span></div>
    <div class="dr"><span class="dl">Departemen</span><span class="dv">${r.dept}</span></div>
    <div class="dr"><span class="dl">Periode</span><span class="dv">${r.periode}</span></div>
    <div class="dr"><span class="dl">Status</span><span class="dv"><span class="tag t-pend">Belum Dinilai</span></span></div>
    <hr style="border:none;border-top:1px solid var(--border-color);margin:12px 0">
    <div style="font-size:12px;color:var(--text-light)">Silakan berikan skor 1-5 untuk setiap indikator di bawah ini.</div>
  `;
  
  document.getElementById('kpiFormBody').innerHTML = `
    ${KPI_INDICATORS.map((ind, idx) => `
      <div class="kpi-indicator-row">
        <div class="kpi-ind-info">
          <div class="kpi-ind-name">${idx+1}. ${ind.name}</div>
          <div class="kpi-ind-desc">${ind.desc}</div>
        </div>
        <div class="kpi-ind-score">
          ${[1,2,3,4,5].map(s => `<button class="kpi-score-btn" id="kpi-btn-${ind.id}-${s}" onclick="setKPIScore('${ind.id}',${s})">${s}</button>`).join('')}
        </div>
      </div>
      <div class="kpi-score-labels">
        <span>Buruk</span><span>Kurang</span><span>Cukup</span><span>Baik</span><span>Sangat Baik</span>
      </div>
      ${idx < KPI_INDICATORS.length - 1 ? '<hr style="border:none;border-top:1px solid var(--border-color);margin:8px 0">' : ''}
    `).join('')}
    <div class="fg" style="margin-top:16px">
      <label class="fl">Catatan Penilaian (opsional)</label>
      <textarea class="fc" id="kpiCatatan" style="min-height:80px" placeholder="Tambahkan catatan untuk karyawan..."></textarea>
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-ghost" onclick="nav('kpi')">Batal</button>
      <button class="btn btn-primary btn-lg" onclick="submitKPI()">Simpan Penilaian</button>
    </div>
  `;
  
  nav('kpi-form');
}

function setKPIScore(indicatorId, score){
  currentKPIScores[indicatorId] = score;
  // Update visual
  [1,2,3,4,5].forEach(s => {
    const btn = document.getElementById(`kpi-btn-${indicatorId}-${s}`);
    if(btn){
      if(s === score) btn.classList.add('sel');
      else btn.classList.remove('sel');
    }
  });
}

function submitKPI(){
  const r = kpiRecords.find(x => x.id === currentKPIId);
  if(!r) return;
  
  // Cek semua indikator sudah dinilai
  const missing = KPI_INDICATORS.filter(ind => !currentKPIScores[ind.id]);
  if(missing.length > 0){
    toast(`⚠️ Harap nilai semua indikator: ${missing.map(m => m.name).join(', ')}`);
    return;
  }
  
  const catatan = document.getElementById('kpiCatatan').value.trim();
  const total = Object.values(currentKPIScores).reduce((a,b) => a+b, 0);
  
  r.scores = {...currentKPIScores};
  r.catatan = catatan || 'Tidak ada catatan.';
  r.total = total;
  r.status = 'Sudah Dinilai';
  r.tanggal = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'/');
  
  toast('✅ Penilaian KPI berhasil disimpan!');
  notifs.unshift({
    id: Date.now(),
    title: `KPI ${r.karyawanNama} Dinilai`,
    desc: `Penilaian KPI ${r.periode} untuk ${r.karyawanNama} telah selesai. Total score: ${total}/25`,
    time: 'Baru saja',
    read: false
  });
  updateNotifDot();
  nav('kpi');
}

function openKPIDetail(id){
  const r = kpiRecords.find(x => x.id === id);
  if(!r) return;
  openedId = id;
  
  const avg = r.status === 'Sudah Dinilai' ? (r.total / 5).toFixed(1) : 0;
  const category = r.total >= 23 ? 'Sangat Baik' : r.total >= 18 ? 'Baik' : r.total >= 13 ? 'Cukup' : 'Kurang';
  const catClass = r.total >= 23 ? 'kpi-c-excellent' : r.total >= 18 ? 'kpi-c-good' : r.total >= 13 ? 'kpi-c-average' : 'kpi-c-poor';
  const progressClass = r.total >= 23 ? 'kpi-progress-excellent' : r.total >= 18 ? 'kpi-progress-good' : r.total >= 13 ? 'kpi-progress-average' : 'kpi-progress-poor';
  
  document.getElementById('kpiDetailInfo').innerHTML = `
    <div class="dr"><span class="dl">Nama Karyawan</span><span class="dv">${r.karyawanNama}</span></div>
    <div class="dr"><span class="dl">Departemen</span><span class="dv">${r.dept}</span></div>
    <div class="dr"><span class="dl">Periode</span><span class="dv">${r.periode}</span></div>
    <div class="dr"><span class="dl">Tanggal Dinilai</span><span class="dv">${r.tanggal}</span></div>
    <div class="dr"><span class="dl">Status</span><span class="dv"><span class="tag ${r.status==='Sudah Dinilai'?'t-appr':'t-pend'}">${r.status}</span></span></div>
    <div class="dr"><span class="dl">Dinilai Oleh</span><span class="dv">${ROLE_INFO.atasan.name} (Atasan)</span></div>
    ${r.catatan ? `<hr style="border:none;border-top:1px solid var(--border-color);margin:12px 0"><div style="font-size:12px;font-weight:600;color:var(--text-light);margin-bottom:6px">Catatan Atasan</div><div class="kpi-comment-box">${r.catatan}</div>` : ''}
  `;
  
  if(r.status === 'Sudah Dinilai'){
    document.getElementById('kpiDetailSummary').innerHTML = `
      <div class="kpi-score-big">${r.total}<span style="font-size:20px;color:var(--text-muted)">/25</span></div>
      <div class="kpi-score-label">Total Score</div>
      <div style="text-align:center;margin-top:8px">
        <span class="kpi-category ${catClass}">${category}</span>
      </div>
      <div style="margin-top:12px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">
          <span>Rata-rata: ${avg}/5</span>
          <span>${Math.round((r.total/25)*100)}%</span>
        </div>
        <div class="kpi-progress-bar">
          <div class="kpi-progress-fill ${progressClass}" style="width:${(r.total/25)*100}%"></div>
        </div>
      </div>
    `;
    
    document.getElementById('kpiDetailBody').innerHTML = `
      <div class="kpi-radar-container">
        ${KPI_INDICATORS.map(ind => `
          <div class="kpi-radar-item">
            <div class="kpi-radar-val" style="color:${r.scores[ind.id]>=4?'#10b981':r.scores[ind.id]>=3?'#3b82f6':'#f59e0b'}">${r.scores[ind.id]}</div>
            <div class="kpi-radar-label">${ind.name}</div>
          </div>
        `).join('')}
      </div>
      <hr style="border:none;border-top:1px solid var(--border-color);margin:16px 0">
      ${KPI_INDICATORS.map((ind, idx) => {
        const score = r.scores[ind.id];
        const pct = (score/5)*100;
        const barColor = score >= 4 ? '#10b981' : score >= 3 ? '#3b82f6' : '#f59e0b';
        return `
          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:12.5px;font-weight:600;color:var(--text-primary)">${idx+1}. ${ind.name}</span>
              <span style="font-size:13px;font-weight:700;color:${barColor}">${score}/5 - ${KPI_SCORE_LABELS[score-1]}</span>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${ind.desc}</div>
            <div class="kpi-progress-bar" style="height:6px">
              <div class="kpi-progress-fill" style="width:${pct}%;background:${barColor}"></div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  } else {
    document.getElementById('kpiDetailSummary').innerHTML = `
      <div style="text-align:center;padding:20px;color:var(--text-muted)">
        <div style="font-size:14px;font-weight:600;margin-bottom:8px">Belum Dinilai</div>
        <div style="font-size:12px">Penilaian KPI untuk periode ini belum dilakukan.</div>
      </div>
    `;
    document.getElementById('kpiDetailBody').innerHTML = `
      <div style="text-align:center;padding:20px;color:var(--text-muted)">
        Data penilaian belum tersedia.
      </div>
    `;
  }
  
  nav('kpi-detail');
}

function renderKPIRiwayat(){
  const period = document.getElementById('kpiRPeriod').value;
  const status = document.getElementById('kpiRStatus').value;
  
  let list = role === 'karyawan'
    ? kpiRecords.filter(r => r.karyawanNama === ROLE_INFO[role].name)
    : [...kpiRecords];
  
  if(period) list = list.filter(r => r.periode === period);
  if(status) list = list.filter(r => r.status === status);
  
  const tb = document.getElementById('kpiRTb');
  if(!list.length){ tb.innerHTML='<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--text-light)">Tidak ada data</td></tr>'; return; }
  
  tb.innerHTML = list.map((r,i) => {
    const catClass = r.total >= 23 ? 'kpi-c-excellent' : r.total >= 18 ? 'kpi-c-good' : r.total >= 13 ? 'kpi-c-average' : 'kpi-c-poor';
    const category = r.total >= 23 ? 'Sangat Baik' : r.total >= 18 ? 'Baik' : r.total >= 13 ? 'Cukup' : 'Kurang';
    const scoreDisplay = r.status === 'Sudah Dinilai' ? `<span style="font-weight:700">${r.total}/25</span>` : '-';
    const catDisplay = r.status === 'Sudah Dinilai' ? `<span class="kpi-category ${catClass}" style="padding:2px 10px;font-size:11px">${category}</span>` : '-';
    
    return `<tr>
      <td>${i+1}</td>
      <td><strong>${r.karyawanNama}</strong></td>
      <td>${r.periode}</td>
      <td>${scoreDisplay}</td>
      <td>${catDisplay}</td>
      <td>${r.tanggal}</td>
      <td><button class="btn btn-outline btn-sm" onclick="openKPIDetail(${r.id})">Detail</button></td>
    </tr>`;
  }).join('');
}


// ═══ ABSENSI FUNCTIONS ═══
function renderAbsensi(){
  const dept = document.getElementById('absDept').value;
  const status = document.getElementById('absStatus').value;
  const search = document.getElementById('absSearch').value.toLowerCase();
  const dateStr = document.getElementById('absDate').value;

  // Format date from input (YYYY-MM-DD) to display format (DD/MM/YYYY)
  let filterDate = '';
  if(dateStr){
    const d = new Date(dateStr);
    filterDate = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  let list = [...absensiData];
  if(filterDate) list = list.filter(r => r.tanggal === filterDate);
  if(dept) list = list.filter(r => r.dept === dept);
  if(status) list = list.filter(r => r.status === status);
  if(search) list = list.filter(r => r.nama.toLowerCase().includes(search));

  // Update summary stats
  const allForDate = filterDate ? absensiData.filter(r => r.tanggal === filterDate) : [...absensiData];
  const uniqueKaryawan = [...new Set(allForDate.map(r => r.nama))];
  document.getElementById('absTotalKaryawan').textContent = uniqueKaryawan.length;
  document.getElementById('absTotalHadir').textContent = allForDate.filter(r => r.status === 'Hadir').length;
  document.getElementById('absTotalTerlambat').textContent = allForDate.filter(r => r.status === 'Terlambat').length;
  document.getElementById('absTotalAlpha').textContent = allForDate.filter(r => r.status === 'Alpha' || r.status === 'Sakit' || r.status === 'Izin').length;

  // Render table
  const tb = document.getElementById('absTb');
  if(!list.length){ 
    tb.innerHTML='<tr><td colspan="9" style="text-align:center;padding:28px;color:#9ca3af">Tidak ada data absensi untuk tanggal ini</td></tr>'; 
    return; 
  }

  tb.innerHTML = list.map((r,i) => {
    const st = ABSENSI_STATUS[r.status] || {class:'t-pend', icon:'⚪'};
    return `<tr>
      <td>${i+1}</td>
      <td><strong>${r.nama}</strong></td>
      <td>${r.dept}</td>
      <td>${r.jamMasuk}</td>
      <td>${r.jamKeluar}</td>
      <td><span class="tag ${st.class}">${st.icon} ${r.status}</span></td>
      <td>${r.lokasi}</td>
      <td style="font-size:11.5px;color:#6b7280;max-width:140px">${r.keterangan}</td>
      <td>
        <div class="abtns">
          <button class="btn btn-outline btn-sm" onclick="openAbsensiDetail('${r.nama}')">Detail</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  // Render weekly chart
  renderAbsensiChart();
}

function renderAbsensiChart(){
  const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  const hadir = [12,11,13,12,10,5,0];
  const terlambat = [2,1,3,2,4,0,0];
  const alpha = [1,2,0,1,1,0,0];

  const chartEl = document.getElementById('absChart');
  chartEl.innerHTML = days.map((day,i) => {
    const total = hadir[i] + terlambat[i] + alpha[i];
    const hPct = total ? (hadir[i]/total)*100 : 0;
    const tPct = total ? (terlambat[i]/total)*100 : 0;
    const aPct = total ? (alpha[i]/total)*100 : 0;

    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
        <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:1px;height:120px;justify-content:flex-end">
          <div style="width:100%;background:#10b981;border-radius:3px 3px 0 0;transition:height .5s;height:${hPct}%" title="Hadir: ${hadir[i]}"></div>
          <div style="width:100%;background:#f59e0b;border-radius:0;transition:height .5s;height:${tPct}%" title="Terlambat: ${terlambat[i]}"></div>
          <div style="width:100%;background:#ef4444;border-radius:0 0 3px 3px;transition:height .5s;height:${aPct}%" title="Tidak Hadir: ${alpha[i]}"></div>
        </div>
        <span style="font-size:11px;font-weight:600;color:#6b7280">${day}</span>
        <span style="font-size:10px;color:#9ca3af">${total}</span>
      </div>
    `;
  }).join('');
}

function openAbsensiDetail(nama){
  currentAbsensiId = nama;
  const records = absensiData.filter(r => r.nama === nama);
  const user = users.find(u => u.nama === nama) || {nama:nama, dept:'-', email:'-', rl:'Karyawan'};

  // Calculate monthly stats
  const hadir = records.filter(r => r.status === 'Hadir').length;
  const terlambat = records.filter(r => r.status === 'Terlambat').length;
  const izin = records.filter(r => r.status === 'Izin').length;
  const sakit = records.filter(r => r.status === 'Sakit').length;
  const alpha = records.filter(r => r.status === 'Alpha').length;
  const total = records.length;
  const rate = total ? Math.round((hadir/total)*100) : 0;

  document.getElementById('absDetailInfo').innerHTML = `
    <div class="dr"><span class="dl">Nama</span><span class="dv">${user.nama}</span></div>
    <div class="dr"><span class="dl">Departemen</span><span class="dv">${user.dept}</span></div>
    <div class="dr"><span class="dl">Email</span><span class="dv">${user.email}</span></div>
    <div class="dr"><span class="dl">Role</span><span class="dv"><span class="rb rb-k">${user.rl}</span></span></div>
    <div class="dr"><span class="dl">Total Hari Kerja</span><span class="dv">${total} hari</span></div>
  `;

  document.getElementById('absDetailSummary').innerHTML = `
    <div style="text-align:center;margin-bottom:12px">
      <div style="font-size:36px;font-weight:800;color:${rate >= 90 ? '#10b981' : rate >= 75 ? '#3b82f6' : '#f59e0b'}">${rate}%</div>
      <div style="font-size:12px;color:#6b7280">Rate Kehadiran</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div style="background:#d1fae5;padding:8px;border-radius:6px;text-align:center">
        <div style="font-size:18px;font-weight:700;color:#065f46">${hadir}</div>
        <div style="font-size:10px;color:#065f46">Hadir</div>
      </div>
      <div style="background:#fef3c7;padding:8px;border-radius:6px;text-align:center">
        <div style="font-size:18px;font-weight:700;color:#92400e">${terlambat}</div>
        <div style="font-size:10px;color:#92400e">Terlambat</div>
      </div>
      <div style="background:#dbeafe;padding:8px;border-radius:6px;text-align:center">
        <div style="font-size:18px;font-weight:700;color:#1d4ed8">${izin}</div>
        <div style="font-size:10px;color:#1d4ed8">Izin</div>
      </div>
      <div style="background:#fee2e2;padding:8px;border-radius:6px;text-align:center">
        <div style="font-size:18px;font-weight:700;color:#991b1b">${alpha + sakit}</div>
        <div style="font-size:10px;color:#991b1b">Tidak Hadir</div>
      </div>
    </div>
  `;

  const tb = document.getElementById('absDetailTb');
  if(!records.length){
    tb.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:28px;color:#9ca3af">Tidak ada data</td></tr>';
  } else {
    tb.innerHTML = records.map(r => {
      const st = ABSENSI_STATUS[r.status] || {class:'t-pend', icon:'⚪'};
      return `<tr>
        <td>${r.tanggal}</td>
        <td>${r.jamMasuk}</td>
        <td>${r.jamKeluar}</td>
        <td><span class="tag ${st.class}">${st.icon} ${r.status}</span></td>
        <td>${r.lokasi}</td>
        <td style="font-size:11.5px;color:#6b7280">${r.keterangan}</td>
      </tr>`;
    }).join('');
  }

  nav('absensi-detail');
}

function renderAbsensiDetail(){
  // This is called by nav(), content is rendered in openAbsensiDetail
}


// Close modal on overlay click
document.querySelectorAll('.ov').forEach(o=>o.addEventListener('click',function(e){ if(e.target===this) this.classList.remove('on'); }));

// ═══ AUTH & SESSION ═══
function checkAuth() {
    const session = localStorage.getItem('ras_session');
    if (!session) {
        console.log('No session found, redirecting to login');
        window.location.href = 'login.html';
        return null;
    }
    try {
        const parsed = JSON.parse(session);
        console.log('Session found:', parsed);
        return parsed;
    } catch(e) {
        console.error('Invalid session:', e);
        localStorage.removeItem('ras_session');
        window.location.href = 'login.html';
        return null;
    }
}

function logout() {
    localStorage.removeItem('ras_session');
    window.location.href = 'login.html';
}

function getCurrentUser() {
    const session = localStorage.getItem('ras_session');
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch(e) {
        return null;
    }
}

// ═══ INIT ═══
function init(){ 
    // Check auth first
    const session = checkAuth();
    if (!session) return;
    
    currentUser = session;
    role = session.role;
    
    // Update UI with user data
    ROLE_INFO[role] = {
        name: session.name,
        label: role.charAt(0).toUpperCase() + role.slice(1),
        ic: session.name.charAt(0),
        av: role === 'karyawan' ? 'av-blue' : role === 'atasan' ? 'av-green' : 'av-purple'
    };
    
    // Update avatar and name in sidebar
    const topAv = document.getElementById('topAv');
    if (topAv) {
        topAv.textContent = ROLE_INFO[role].ic;
        topAv.className = 'av ' + ROLE_INFO[role].av;
    }
    
    const pNama = document.getElementById('pNama');
    if (pNama) pNama.value = session.name;
    
    const pRole = document.getElementById('pRole');
    if (pRole) pRole.value = ROLE_INFO[role].label;
    
    initDarkMode();
    buildNav(role);
    updateNotifDot();
    nav('dashboard');
    
    // Add logout button
    const topbar = document.querySelector('.topbar');
    if (topbar && !document.getElementById('logoutBtn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.className = 'btn btn-ghost btn-sm';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Keluar';
        logoutBtn.onclick = logout;
        logoutBtn.style.marginLeft = '8px';
        topbar.appendChild(logoutBtn);
    }
    
    console.log('App initialized for:', session);
}

init();