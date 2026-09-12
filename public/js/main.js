  /* ---------------- tab switching ---------------- */
  function showTab(name){
    const isChat = name === 'chat';
    document.getElementById('panelChat').hidden = !isChat;
    document.getElementById('panelQuiz').hidden = isChat;
    document.getElementById('tabChat').setAttribute('aria-selected', isChat);
    document.getElementById('tabQuiz').setAttribute('aria-selected', !isChat);
  }

  /* ---------------- network simulation ---------------- */
  let isOnline = false;
  function toggleNet(){
    isOnline = !isOnline;
    const sw = document.getElementById('netSwitch');
    sw.classList.toggle('online', isOnline);
    sw.setAttribute('aria-checked', isOnline);
    document.getElementById('netLabel').textContent = isOnline ? 'Online' : 'Offline';
    const dot = document.getElementById('heroDot');
    const status = document.getElementById('heroStatus');
    dot.classList.toggle('on', isOnline);
    status.textContent = isOnline
      ? 'Terkoneksi — siap menyinkronkan progres'
      : 'Sinyal terputus — mode belajar mandiri aktif';
    updateSyncStatus();
  }

  /* ---------------- chat demo ---------------- */
  const chatLog = document.getElementById('chatLog');
  const kb = [
    { keys: ['pecahan','2/3','1/4','tambah pecahan'],
      reply: 'Samakan penyebutnya dulu. Untuk 2/3 dan 1/4, KPK dari 3 dan 4 adalah 12. Jadi 2/3 = 8/12 dan 1/4 = 3/12. 8/12 + 3/12 = 11/12.' },
    { keys: ['fotosintesis'],
      reply: 'Fotosintesis adalah proses tumbuhan mengubah cahaya matahari, air, dan karbon dioksida menjadi makanan (glukosa) dan oksigen, terjadi di bagian daun yang mengandung klorofil.' },
    { keys: ['ibu kota jawa timur','ibukota jawa timur'],
      reply: 'Ibu kota Provinsi Jawa Timur adalah Surabaya.' },
    { keys: ['perkalian','kali'],
      reply: 'Salah satu cara mudah: pecah angka besar jadi puluhan dan satuan. Misalnya 7 x 8 = 7 x 10 - 7 x 2 = 70 - 14 = 56. Latihan berulang membuat pola ini makin cepat diingat.' },
    { keys: ['siapa kamu','kamu siapa','apa itu teach for all'],
      reply: 'Aku asisten belajar TEACH FOR ALL, dirancang untuk membantumu belajar mandiri meski gurumu sedang tidak ada di kelas atau sinyal internet sedang lemah.' },
  ];
  function findReply(text){
    const t = text.toLowerCase();
    for(const item of kb){
      if(item.keys.some(k => t.includes(k))) return item.reply;
    }
    return 'Aku belum punya materi spesifik untuk itu di demo ini — coba tanyakan tentang pecahan, fotosintesis, ibu kota provinsi, atau perkalian, ya.';
  }
  function addMsg(role, text){
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    if(role === 'ai'){
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = isOnline ? 'Asisten · terkoneksi' : 'Asisten · mode offline';
      div.appendChild(tag);
    }
    const body = document.createElement('span');
    body.textContent = text;
    div.appendChild(body);
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  function sendChat(){
    const input = document.getElementById('chatInput');
    const val = input.value.trim();
    if(!val) return;
    addMsg('user', val);
    input.value = '';
    setTimeout(() => addMsg('ai', findReply(val)), 350);
  }
  function askChip(btn){
    document.getElementById('chatInput').value = btn.textContent;
    sendChat();
  }
  addMsg('ai', 'Halo! Tanyakan pelajaran apa pun — aku tetap bisa membantu walau sinyal sedang tidak ada.');

  /* ---------------- quiz demo ---------------- */
  const questions = [
    { q: '3/4 diubah ke bentuk desimal menjadi...', opts: ['0,34','0,75','0,43','1,33'], correct: 1,
      explain: '3/4 artinya 3 dibagi 4 = 0,75.' },
    { q: 'Proses tumbuhan membuat makanan dengan bantuan cahaya matahari disebut...', opts: ['Respirasi','Fotosintesis','Transpirasi','Fermentasi'], correct: 1,
      explain: 'Fotosintesis mengubah cahaya matahari, air, dan CO2 menjadi makanan dan oksigen.' },
    { q: 'Ibu kota Provinsi Jawa Timur adalah...', opts: ['Malang','Surabaya','Kediri','Madiun'], correct: 1,
      explain: 'Surabaya adalah ibu kota sekaligus kota terbesar di Provinsi Jawa Timur.' },
    { q: 'Hasil dari 7 x 8 adalah...', opts: ['54','56','62','48'], correct: 1,
      explain: '7 x 8 = 7 x 10 - 7 x 2 = 70 - 14 = 56.' },
    { q: 'KPK dari 3 dan 4 adalah...', opts: ['7','10','12','24'], correct: 2,
      explain: 'Kelipatan 3: 3,6,9,12... Kelipatan 4: 4,8,12... KPK-nya adalah 12.' },
  ];
  let qIndex = 0, score = 0, answered = false;

  function renderQuestion(){
    const item = questions[qIndex];
    document.getElementById('quizProgress').textContent = 'Soal ' + (qIndex+1) + ' dari ' + questions.length;
    document.getElementById('quizScore').textContent = 'Skor: ' + score;
    document.getElementById('quizQ').textContent = item.q;
    const optsDiv = document.getElementById('quizOpts');
    optsDiv.innerHTML = '';
    item.opts.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.textContent = opt;
      b.onclick = () => selectOption(i);
      optsDiv.appendChild(b);
    });
    document.getElementById('quizFeedback').classList.remove('show');
    document.getElementById('quizNextBtn').disabled = true;
    document.getElementById('quizHint').textContent = 'Jawab soal untuk melihat penjelasannya.';
    answered = false;
  }

  function selectOption(i){
    if(answered) return;
    answered = true;
    const item = questions[qIndex];
    const buttons = document.querySelectorAll('#quizOpts .opt-btn');
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if(idx === item.correct) b.classList.add('correct');
      else if(idx === i) b.classList.add('wrong');
    });
    if(i === item.correct) score++;
    document.getElementById('quizScore').textContent = 'Skor: ' + score;
    const fb = document.getElementById('quizFeedback');
    fb.textContent = (i === item.correct ? 'Benar. ' : 'Belum tepat. ') + item.explain;
    fb.classList.add('show');
    document.getElementById('quizHint').textContent = '';
    if(qIndex < questions.length - 1){
      document.getElementById('quizNextBtn').disabled = false;
    } else {
      document.getElementById('quizNextBtn').textContent = 'Selesai — simpan progres';
      document.getElementById('quizNextBtn').disabled = false;
    }
  }

  function nextQuestion(){
    if(qIndex < questions.length - 1){
      qIndex++;
      renderQuestion();
    } else {
      saveProgress();
    }
  }

  async function saveProgress(){
    const record = { score, total: questions.length, savedAt: new Date().toISOString(), synced: isOnline };
    try{
      await window.storage.set('teach-for-all:last-attempt', JSON.stringify(record), false);
    }catch(e){ /* penyimpanan tidak tersedia di lingkungan ini, lanjutkan tanpa gagal */ }
    document.getElementById('quizQ').textContent = 'Latihan selesai — skor akhir ' + score + ' dari ' + questions.length + '.';
    document.getElementById('quizOpts').innerHTML = '';
    document.getElementById('quizFeedback').classList.remove('show');
    document.getElementById('quizNextBtn').hidden = true;
    updateSyncStatus(true);
  }

  function updateSyncStatus(justFinished){
    const el = document.getElementById('syncStatus');
    if(isOnline){
      el.innerHTML = '<strong>Tersinkron.</strong> Progres belajar terakhir sudah terkirim.';
    } else {
      el.innerHTML = justFinished
        ? 'Progres tersimpan di perangkat ini. Akan disinkronkan otomatis saat kembali online.'
        : 'Progres tersimpan di perangkat ini. Belum disinkronkan.';
    }
  }

  async function syncProgress(){
    const el = document.getElementById('syncStatus');
    if(!isOnline){
      el.innerHTML = 'Belum ada sinyal — progres tetap aman tersimpan di perangkat dan akan otomatis terkirim begitu online.';
      return;
    }
    el.textContent = 'Menyinkronkan...';
    setTimeout(() => {
      const now = new Date();
      el.innerHTML = '<strong>Tersinkron</strong> pukul ' + now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0') + '.';
    }, 700);
  }

  renderQuestion();
