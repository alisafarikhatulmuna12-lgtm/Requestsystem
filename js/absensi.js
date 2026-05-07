// State Management
const attState = {
  checkedIn: false,
  checkInTime: null,
  checkOutTime: null,
  currentMonth: new Date(),
  selectedDate: null,
  attendanceData: [],
  weeklyData: [],
  currentRole: 'karyawan'
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  generateDummyData();
  startClock();
  renderCalendar();
  renderTimeline();
  renderStats();
  renderWeeklyChart();
  renderAttendanceTable();
  updateRoleUI();
  
  // Set default filter dates
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const attFilterFrom = document.getElementById('attFilterFrom');
  const attFilterTo = document.getElementById('attFilterTo');
  if (attFilterFrom) attFilterFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
  if (attFilterTo) attFilterTo.value = today.toISOString().split('T')[0];
});

// ============================================
// DATA GENERATION
// ============================================
function generateDummyData() {
  const jenis = ['Izin Kerja', 'Lembur', 'Cuti Tahunan', 'Cuti Sakit'];
  
  // Generate last 30 days of attendance
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const dateStr = date.toISOString().split('T')[0];
    
    let status, checkIn, checkOut, durasi, lokasi, keterangan;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'libur';
      checkIn = '-';
      checkOut = '-';
      durasi = '-';
      lokasi = '-';
      keterangan = 'Hari Libur';
    } else {
      const rand = Math.random();
      if (rand < 0.70) {
        status = 'hadir';
        const hour = 7 + Math.floor(Math.random() * 2);
        const minute = Math.floor(Math.random() * 60);
        checkIn = pad(hour) + ':' + pad(minute);
        const outHour = 16 + Math.floor(Math.random() * 3);
        const outMinute = Math.floor(Math.random() * 60);
        checkOut = pad(outHour) + ':' + pad(outMinute);
        const durHour = outHour - hour;
        const durMin = outMinute - minute;
        durasi = durMin < 0 ? (durHour - 1) + 'j ' + (60 + durMin) + 'm' : durHour + 'j ' + durMin + 'm';
        lokasi = 'Kantor Pusat';
        keterangan = '-';
      } else if (rand < 0.82) {
        status = 'terlambat';
        const hour = 8 + Math.floor(Math.random() * 2);
        const minute = Math.floor(Math.random() * 60);
        checkIn = pad(hour) + ':' + pad(minute);
        checkOut = '17:30';
        durasi = '8j 30m';
        lokasi = 'Kantor Pusat';
        keterangan = 'Macet di jalan tol';
      } else if (rand < 0.90) {
        status = 'izin';
        checkIn = '-';
        checkOut = '-';
        durasi = '-';
        lokasi = '-';
        keterangan = jenis[Math.floor(Math.random() * jenis.length)];
      } else {
        status = 'cuti';
        checkIn = '-';
        checkOut = '-';
        durasi = '-';
        lokasi = '-';
        keterangan = 'Cuti Tahunan';
      }
    }
    
    attState.attendanceData.push({
      id: i + 1,
      tanggal: dateStr,
      hari: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][dayOfWeek],
      status: status,
      checkIn: checkIn,
      checkOut: checkOut,
      durasi: durasi,
      lokasi: lokasi,
      keterangan: keterangan
    });
  }
  
  // Weekly data for chart (Mon-Fri)
  const days = ['Sen','Sel','Rab','Kam','Jum'];
  attState.weeklyData = days.map(function(d) {
    const hours = 7 + Math.random() * 3;
    return {
      day: d,
      hours: hours,
      status: hours >= 8 ? 'good' : (hours >= 7 ? 'warning' : 'danger')
    };
  });
}

function pad(n) {
  return n < 10 ? '0' + n : n;
}

// ============================================
// REAL-TIME CLOCK
// ============================================
function startClock() {
  function update() {
    const now = new Date();
    const timeEl = document.getElementById('attClockTime');
    const dateEl = document.getElementById('attClockDate');
    
    if (timeEl) {
      timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    }
    if (dateEl) {
      const options = {weekday:'long', year:'numeric', month:'long', day:'numeric'};
      dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }
  }
  update();
  setInterval(update, 1000);
}

// ============================================
// CALENDAR
// ============================================
function renderCalendar() {
  const year = attState.currentMonth.getFullYear();
  const month = attState.currentMonth.getMonth();
  
  const titleEl = document.getElementById('calMonthYear');
  if (titleEl) {
    titleEl.textContent = attState.currentMonth.toLocaleDateString('id-ID', {month:'long', year:'numeric'});
  }
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  let html = '';
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    html += '<div class="att-cal-day other-month">' + (daysInPrevMonth - i) + '</div>';
  }
  
  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = year + '-' + pad(month + 1) + '-' + pad(i);
    const record = attState.attendanceData.find(function(a) { return a.tanggal === dateStr; });
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
    
    let classes = '';
    if (record) classes = record.status;
    if (isToday) classes += ' today';
    
    html += '<div class="att-cal-day ' + classes + '" onclick="selectDate(\'' + dateStr + '\')">' + i + '</div>';
  }
  
  // Next month days
  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    html += '<div class="att-cal-day other-month">' + i + '</div>';
  }
  
  const calDays = document.getElementById('calDays');
  if (calDays) calDays.innerHTML = html;
}

function changeMonth(delta) {
  attState.currentMonth.setMonth(attState.currentMonth.getMonth() + delta);
  renderCalendar();
}

function goToToday() {
  attState.currentMonth = new Date();
  renderCalendar();
}

function selectDate(dateStr) {
  attState.selectedDate = dateStr;
  const record = attState.attendanceData.find(function(a) { return a.tanggal === dateStr; });
  if (record) {
    showDateDetail(record);
  }
}

// ============================================
// TIMELINE
// ============================================
function renderTimeline() {
  const container = document.getElementById('tlList');
  if (!container) return;
  
  const activities = [
    {time: '08:05', action: 'Check In', type: 'in', status: 'ontime', loc: 'Kantor Pusat - Lt.3'},
    {time: '12:00', action: 'Istirahat', type: 'out', status: 'ontime', loc: 'Ruang Makan'},
    {time: '13:05', action: 'Check In (Siang)', type: 'in', status: 'late', loc: 'Kantor Pusat - Lt.3'},
    {time: '17:02', action: 'Check Out', type: 'out', status: 'ontime', loc: 'Kantor Pusat - Lt.3'}
  ];
  
  container.innerHTML = activities.map(function(a) {
    return '<div class="att-tl-item">' +
      '<div class="att-tl-dot ' + a.type + '">' + (a.type === 'in' ? '📥' : '📤') + '</div>' +
      '<div class="att-tl-info">' +
        '<div class="att-tl-action">' + a.action + '</div>' +
        '<div class="att-tl-time">' + a.time + ' WIB</div>' +
        '<div class="att-tl-meta">' +
          '<span class="att-tl-loc">📍 ' + a.loc + '</span>' +
          '<span class="att-tl-status ' + a.status + '">' + (a.status === 'ontime' ? 'Tepat Waktu' : 'Terlambat') + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function refreshTimeline() {
  renderTimeline();
  toast('✅ Timeline diperbarui');
}

// ============================================
// STATISTICS
// ============================================
function renderStats() {
  const hadir = attState.attendanceData.filter(function(a) { return a.status === 'hadir'; }).length;
  const telat = attState.attendanceData.filter(function(a) { return a.status === 'terlambat'; }).length;
  const cuti = attState.attendanceData.filter(function(a) { return a.status === 'cuti' || a.status === 'izin'; }).length;
  
  let totalMinutes = 0;
  attState.attendanceData.forEach(function(a) {
    if (a.durasi !== '-') {
      const match = a.durasi.match(/([0-9]+)j\\s*([0-9]*)m?/);
      if (match) {
        totalMinutes += parseInt(match[1]) * 60 + (parseInt(match[2]) || 0);
      }
    }
  });
  
  const totalHours = Math.floor(totalMinutes / 60);
  
  const stHadir = document.getElementById('stHadir');
  const stTelat = document.getElementById('stTelat');
  const stCuti = document.getElementById('stCuti');
  const stDurasi = document.getElementById('stDurasi');
  
  if (stHadir) stHadir.textContent = hadir;
  if (stTelat) stTelat.textContent = telat;
  if (stCuti) stCuti.textContent = cuti;
  if (stDurasi) stDurasi.textContent = totalHours + 'j';
}

// ============================================
// WEEKLY CHART
// ============================================
function renderWeeklyChart() {
  const container = document.getElementById('weekChart');
  if (!container) return;
  
  const maxHours = Math.max.apply(null, attState.weeklyData.map(function(d) { return d.hours; }));
  
  container.innerHTML = attState.weeklyData.map(function(d) {
    const height = (d.hours / maxHours) * 100;
    const statusClass = d.hours >= 8 ? 'good' : (d.hours >= 7 ? 'warning' : 'danger');
    return '<div class="att-w-bar">' +
      '<div class="att-w-bar-time">' + d.hours.toFixed(1) + 'j</div>' +
      '<div class="att-w-bar-fill ' + statusClass + '" style="height:' + height + '%"></div>' +
      '<div class="att-w-bar-day">' + d.day + '</div>' +
    '</div>';
  }).join('');
}

// ============================================
// ATTENDANCE TABLE
// ============================================
function renderAttendanceTable() {
  const tbody = document.getElementById('attTableBody');
  if (!tbody) return;
  
  const statusFilter = document.getElementById('attFilterStatus');
  const fromFilter = document.getElementById('attFilterFrom');
  const toFilter = document.getElementById('attFilterTo');
  
  const statusVal = statusFilter ? statusFilter.value : '';
  const fromVal = fromFilter ? fromFilter.value : '';
  const toVal = toFilter ? toFilter.value : '';
  
  let filtered = attState.attendanceData;
  
  if (statusVal) {
    filtered = filtered.filter(function(a) { return a.status === statusVal; });
  }
  if (fromVal) {
    filtered = filtered.filter(function(a) { return a.tanggal >= fromVal; });
  }
  if (toVal) {
    filtered = filtered.filter(function(a) { return a.tanggal <= toVal; });
  }
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#9ca3af">Tidak ada data absensi</td></tr>';
    return;
  }
  
  tbody.innerHTML = filtered.map(function(row) {
    return '<tr>' +
      '<td>' + formatDate(row.tanggal) + '</td>' +
      '<td>' + row.hari + '</td>' +
      '<td class="att-dur">' + row.checkIn + '</td>' +
      '<td class="att-dur">' + row.checkOut + '</td>' +
      '<td class="att-dur">' + row.durasi + '</td>' +
      '<td><span class="att-status-badge ' + row.status + '">' + capitalize(row.status) + '</span></td>' +
      '<td>' + row.lokasi + '</td>' +
      '<td>' + row.keterangan + '</td>' +
    '</tr>';
  }).join('');
}

// ============================================
// CHECK IN / CHECK OUT
// ============================================
function handleCheckIn() {
  if (attState.checkedIn) {
    toast('⚠️ Anda sudah check in hari ini');
    return;
  }
  
  const now = new Date();
  attState.checkedIn = true;
  attState.checkInTime = now;
  
  // Update Quick Card UI
  const qCheckIn = document.getElementById('qCheckIn');
  const qCheckOut = document.getElementById('qCheckOut');
  const qCheckInStatus = document.getElementById('qCheckInStatus');
  const qCheckOutStatus = document.getElementById('qCheckOutStatus');
  
  if (qCheckIn) {
    qCheckIn.classList.add('active');
    qCheckInStatus.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
  }
  if (qCheckOut) {
    qCheckOut.style.opacity = '1';
    qCheckOut.style.pointerEvents = 'auto';
    qCheckOutStatus.textContent = 'Ready';
  }
  
  // Show success modal
  showCheckInModal(now);
  
  // Add to timeline
  addToTimeline('Check In', 'in', 'ontime', 'Kantor Pusat - Lt.3');
  
  toast('✅ Check In berhasil! Selamat bekerja 💪');
}

function handleCheckOut() {
  if (!attState.checkedIn) {
    toast('⚠️ Anda belum check in');
    return;
  }
  
  // Show confirmation modal
  const modal = document.getElementById('mCheckOut');
  if (modal) modal.style.display = 'flex';
}

function confirmCheckOut() {
  const now = new Date();
  attState.checkedIn = false;
  attState.checkOutTime = now;
  
  // Update Quick Card UI
  const qCheckIn = document.getElementById('qCheckIn');
  const qCheckOut = document.getElementById('qCheckOut');
  const qCheckInStatus = document.getElementById('qCheckInStatus');
  const qCheckOutStatus = document.getElementById('qCheckOutStatus');
  
  if (qCheckIn) {
    qCheckIn.classList.remove('active');
    qCheckInStatus.textContent = 'Belum Check In';
  }
  if (qCheckOut) {
    qCheckOut.style.opacity = '0.5';
    qCheckOut.style.pointerEvents = 'none';
    qCheckOutStatus.textContent = 'Check In dulu';
  }
  
  // Close modal
  closeModal('mCheckOut');
  
  // Add to timeline
  addToTimeline('Check Out', 'out', 'ontime', 'Kantor Pusat - Lt.3');
  
  // Calculate duration
  const diffMs = now - attState.checkInTime;
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;
  
  toast('✅ Check Out berhasil! Total: ' + hours + 'j ' + minutes + 'm. Hati-hati di jalan 🏠');
}

function showCheckInModal(time) {
  const timeEl = document.getElementById('ciTime');
  if (timeEl) {
    timeEl.textContent = pad(time.getHours()) + ':' + pad(time.getMinutes()) + ':' + pad(time.getSeconds());
  }
  
  const modal = document.getElementById('mCheckIn');
  if (modal) modal.style.display = 'flex';
}

function addToTimeline(action, type, status, loc) {
  const list = document.getElementById('tlList');
  if (!list) return;
  
  const now = new Date();
  const time = pad(now.getHours()) + ':' + pad(now.getMinutes());
  
  const item = document.createElement('div');
  item.className = 'att-tl-item';
  item.style.animation = 'fadeIn 0.3s ease';
  item.innerHTML = 
    '<div class="att-tl-dot ' + type + '">' + (type === 'in' ? '📥' : '📤') + '</div>' +
    '<div class="att-tl-info">' +
      '<div class="att-tl-action">' + action + '</div>' +
      '<div class="att-tl-time">' + time + ' WIB (Baru saja)</div>' +
      '<div class="att-tl-meta">' +
        '<span class="att-tl-loc">📍 ' + loc + '</span>' +
        '<span class="att-tl-status ' + status + '">' + (status === 'ontime' ? 'Tepat Waktu' : 'Terlambat') + '</span>' +
      '</div>' +
    '</div>';
  
  list.insertBefore(item, list.firstChild);
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

function showDateDetail(record) {
  const titleEl = document.getElementById('ddTitle');
  const bodyEl = document.getElementById('ddBody');
  
  if (titleEl) titleEl.textContent = '📅 Detail ' + formatDate(record.tanggal);
  
  if (bodyEl) {
    bodyEl.innerHTML = 
      '<div style="text-align:center;margin-bottom:16px">' +
        '<div style="font-size:48px;margin-bottom:8px">' + getStatusIcon(record.status) + '</div>' +
        '<div style="font-size:18px;font-weight:700">' + capitalize(record.status) + '</div>' +
      '</div>' +
      '<div style="display:grid;gap:10px">' +
        '<div class="att-shift-row" style="padding:10px;background:#f9fafb;border-radius:8px">' +
          '<span class="att-shift-label">Check In</span>' +
          '<span class="att-shift-value">' + record.checkIn + '</span>' +
        '</div>' +
        '<div class="att-shift-row" style="padding:10px;background:#f9fafb;border-radius:8px">' +
          '<span class="att-shift-label">Check Out</span>' +
          '<span class="att-shift-value">' + record.checkOut + '</span>' +
        '</div>' +
        '<div class="att-shift-row" style="padding:10px;background:#f9fafb;border-radius:8px">' +
          '<span class="att-shift-label">Durasi</span>' +
          '<span class="att-shift-value">' + record.durasi + '</span>' +
        '</div>' +
        '<div class="att-shift-row" style="padding:10px;background:#f9fafb;border-radius:8px">' +
          '<span class="att-shift-label">Lokasi</span>' +
          '<span class="att-shift-value">' + record.lokasi + '</span>' +
        '</div>' +
        (record.keterangan !== '-' ? 
          '<div class="att-shift-row" style="padding:10px;background:#f9fafb;border-radius:8px">' +
            '<span class="att-shift-label">Keterangan</span>' +
            '<span class="att-shift-value">' + record.keterangan + '</span>' +
          '</div>' : '') +
      '</div>';
  }
  
  const modal = document.getElementById('mDateDetail');
  if (modal) modal.style.display = 'flex';
}

function openIzinModal() {
  const modal = document.getElementById('mIzin');
  if (modal) {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const dari = document.getElementById('izDari');
    const sampai = document.getElementById('izSampai');
    if (dari) dari.value = today;
    if (sampai) sampai.value = today;
    modal.style.display = 'flex';
  }
}

function openLemburModal() {
  const modal = document.getElementById('mLembur');
  if (modal) {
    const tgl = document.getElementById('lbTgl');
    if (tgl) tgl.value = new Date().toISOString().split('T')[0];
    modal.style.display = 'flex';
  }
}

function submitIzin() {
  const jenis = document.getElementById('izJenis');
  const dari = document.getElementById('izDari');
  const sampai = document.getElementById('izSampai');
  const alasan = document.getElementById('izAlasan');
  
  if (!jenis.value || !dari.value || !sampai.value || !alasan.value.trim()) {
    toast('⚠️ Mohon lengkapi semua field yang wajib');
    return;
  }
  
  closeModal('mIzin');
  toast('✅ Pengajuan ' + jenis.value + ' berhasil dikirim! Menunggu persetujuan atasan');
  
  // Reset form
  alasan.value = '';
  const fileLbl = document.getElementById('izFileLbl');
  if (fileLbl) fileLbl.textContent = '📎 Choose File   Tidak ada file chosen';
}

function submitLembur() {
  const tgl = document.getElementById('lbTgl');
  const mulai = document.getElementById('lbMulai');
  const selesai = document.getElementById('lbSelesai');
  const alasan = document.getElementById('lbAlasan');
  
  if (!tgl.value || !mulai.value || !selesai.value || !alasan.value.trim()) {
    toast('⚠️ Mohon lengkapi semua field yang wajib');
    return;
  }
  
  closeModal('mLembur');
  toast('✅ Pengajuan lembur berhasil! Estimasi: ' + mulai.value + ' - ' + selesai.value);
  
  alasan.value = '';
}

// ============================================
// EXPORT & UTILITIES
// ============================================
function exportAttendance() {
  const headers = ['Tanggal', 'Hari', 'Check In', 'Check Out', 'Durasi', 'Status', 'Lokasi', 'Keterangan'];
  const rows = attState.attendanceData.map(function(a) {
    return [a.tanggal, a.hari, a.checkIn, a.checkOut, a.durasi, a.status, a.lokasi, a.keterangan];
  });
  
  const csv = [headers].concat(rows).map(function(row) {
    return row.map(function(cell) {
      return '"' + String(cell).replace(/"/g, '""') + '"';
    }).join(',');
  }).join('\\n');
  
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'absensi_' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast('📥 Data absensi berhasil diexport ke CSV!');
}

function handleFile(input, labelId) {
  const label = document.getElementById(labelId);
  if (label && input.files.length > 0) {
    label.textContent = '📎 ' + input.files[0].name;
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return pad(d.getDate()) + ' ' + d.toLocaleDateString('id-ID', {month:'short'}) + ' ' + d.getFullYear();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusIcon(status) {
  const icons = {hadir:'✅', terlambat:'⚠️', cuti:'🏖️', izin:'📝', libur:'😴'};
  return icons[status] || '📋';
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(function() {
    el.classList.remove('show');
  }, 3000);
}

// ============================================
// ROLE SWITCHING
// ============================================
function switchRole(role) {
  attState.currentRole = role;
  updateRoleUI();
  
  const names = {karyawan:'Asna', atasan:'Rudi', admin:'Admin'};
  const topAv = document.getElementById('topAv');
  if (topAv) topAv.textContent = names[role].charAt(0);
  
  toast('🔄 Role switched to: ' + capitalize(role));
}

function updateRoleUI() {
  const role = attState.currentRole;
  
  // Show/hide admin menu
  const adminItems = document.querySelectorAll('.sn-item[href*="kelola-user"]');
  adminItems.forEach(function(item) {
    item.style.display = role === 'admin' ? 'flex' : 'none';
  });
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ov')) {
    e.target.style.display = 'none';
  }
});

// Escape key to close modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.ov').forEach(function(modal) {
      modal.style.display = 'none';
    });
  }
});
