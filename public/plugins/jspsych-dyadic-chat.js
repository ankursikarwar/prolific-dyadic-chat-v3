/*! DyadicChat plugin — vG6h-zoom4-clamp2-instr */
(function(){
  'use strict';
  const BUILD='vG6h-zoom4-clamp2-instr'; console.log('[DyadicChat plugin]', BUILD);

  const info = { name: 'dyadic-chat', parameters: {
    socketUrl: { type: String, default: '' },
    prolific: { type: Object, default: {} },
    min_turns: { type: Number, default: 10 },
    wait_timeout_sec: { type: Number, default: 120 },
    goal_question: { type: String, default: '' },
    answer_options: { type: Array,  default: [] },
    instructions_html: { type: String, default: '' },
    image_url: { type: String, default: '' }
  }};

  function styleTag(){
    return [
      '<style id="dyadic-styles">',
      ':root { --bg:#000; --panel:#0b0b0b; --panel-alt:#0f0f10; --border:#3e3e42; --border-soft:#2c2c2e; --text:#fff; --muted:#d0d4d9; --radius:12px; --shadow:0 1px 0 rgba(255,255,255,0.02), 0 6px 16px rgba(0,0,0,0.35); }',
      '.dc-root { position:fixed; inset:0; background:var(--bg); color:var(--text); height:100dvh; width:100vw; padding:20px; box-sizing:border-box; overflow:hidden; font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }',
      '.dc-grid { display:grid; height:100%; width:100%; grid-template-columns: 28fr 44fr 28fr; gap:16px; box-sizing:border-box; }',
      '.dc-panel { background:var(--panel); border:1px solid var(--border); border-radius:var(--radius); padding:12px; min-height:0; min-width:0; box-sizing:border-box; box-shadow: var(--shadow); }',
      '.dc-panel.dc-left { padding:20px; }',
      '.dc-title { font-weight:700; margin:0; color:var(--text); letter-spacing:.2px; font-size:27px; }',
      '.dc-title-row { margin-left:8px; margin-right:8px; margin-bottom:2px; display:flex; justify-content:space-between; align-items:center; gap:10px; }',
      '.dc-small { color:var(--muted); }',
      '#dc-turns, #dc-turns-total { color:#ff4d4f; font-weight:800; }',
      '.dc-image { position:relative; width:100%; height:100%; min-height:0; background:#0e0e10; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow: var(--shadow); }',
      '.dc-image-viewport{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; touch-action:none; cursor:grab; }',
      '.dc-image-viewport.grabbing{ cursor:grabbing; }',
      '#dc-scene{ width:auto; height:auto; max-width:100%; max-height:100%; user-select:none; -webkit-user-drag:none; will-change:transform; transform-origin:center center; pointer-events:none; }',
      '.dc-zoom-controls{ position:absolute; top:8px; right:8px; display:flex; gap:6px; z-index:5; }',
      '.dc-zoom-btn{ padding:6px 10px; border-radius:8px; border:1px solid var(--border); background:rgba(0,0,0,0.65); color:#fff; cursor:pointer; pointer-events:auto; }',
      '.dc-center { display:grid; grid-template-rows: minmax(0,55%) minmax(0,45%); height:100%; min-height:0; box-sizing:border-box; row-gap:16px; }',
      '.dc-center-bottom.single-box { background:var(--panel); border:1px solid var(--border); border-radius:var(--radius); padding:12px 12px 14px 12px; min-height:0; overflow:auto; display:flex; flex-direction:column; align-items:center; text-align:center; box-shadow: var(--shadow); }',
      '.dc-goal-title { margin-top:5px; margin-bottom:15px; color:#fff; font-weight:700; font-size:25px; }',
      '.dc-question { color:#fff; font-size:18px; font-weight:600; line-height:1.35; margin-top:0px; margin-bottom:0px; overflow:auto; height:auto; max-height:4.6em; max-width:720px; }',
      '.dc-qa-wrap { max-width:720px; width:100%; margin:0 auto; display:grid; grid-template-rows:auto auto 1fr auto; row-gap:8px; align-items:start; text-align:center; min-height:0; height:100%; }',
      '.dc-answers { display:block; width:100%; max-width:720px; margin:8px auto; text-align:left; min-height:0; max-height:100%; overflow:auto; }',
      '.dc-answer-option { display:flex; align-items:center; justify-content:flex-start; gap:8px; margin:8px !important; }',
      '.dc-answer-option span { font-size:17px !important; }',
      '.dc-availability-note { margin-top:8px; margin-bottom:9px; font-size:15px; font-weight:bold; color:var(--muted); }',
      '#dc-submit { font-size:16px; margin-top:auto; margin-bottom:4px; }',
      '.dc-right { display:grid; grid-template-rows: auto minmax(0,1fr) auto auto; row-gap:7px; height:100%; min-height:0; box-sizing:border-box; }',
      '.dc-chatbox { min-height:0; height:auto; overflow:auto; background:var(--panel-alt); border:1px solid var(--border); border-radius:var(--radius); padding:8px; }',
      '.dc-row { width:100%; display:block; margin:0px 0; font-size:15px; line-height:1.35; text-align:left; }',
      '.dc-row.dc-me, .dc-row.dc-partner { margin-bottom:10px; }',
      '.dc-me { text-align:left; }',
      '.dc-partner { text-align:right; }',
      '.dc-bubble { display:inline-block; padding:6px 12px; border-radius:12px; border:1px solid var(--border-soft); max-width:85%; word-wrap:break-word; box-shadow: 0 1px 0 rgba(255,255,255,0.02), 0 2px 8px rgba(0,0,0,0.25); }',
      '.dc-bubble-me { background:rgba(125, 211, 252, 0.08); color:#8bd5ff; }',
      '.dc-bubble-partner { background:rgba(255, 77, 79, 0.08); color:#ff6b6e; }',
      '.dc-controls { margin-top:4px; background:transparent; border:none; border-radius:0; padding:0; display:grid; grid-template-columns: 1fr auto; column-gap:8px; box-shadow:none; align-items:end; }',
      '.dc-input { flex:1; width:100%; min-width:0; box-sizing:border-box; padding:12px 14px; font-size:14px; border-radius:10px; border:1px solid var(--border); background:#0c0c0d; color:#fff; outline:none; }',
      '.dc-textarea{ resize:none; height:auto; min-height:40px; max-height:120px; overflow-y:auto; line-height:1.35; padding:12px 14px; }',
      '.dc-btn { padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:linear-gradient(180deg, #1f1f22, #151518); color:#fff; cursor:pointer; white-space:nowrap; }',
      '.dc-btn:disabled { opacity:.5; cursor:not-allowed; }',
      '.dc-hint { font-size:14px !important; font-weight:bold; color:#d0d4d9; margin-top:2px !important; padding:0 10px; }','.dc-wait{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:10px;text-align:center;color:#d0d4d9; margin-top:24px; padding-top:24px; padding-top:28px;}','.dc-spinner{width:20px;height:20px;border:3px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:dcspin 0.9s linear infinite;}','@keyframes dcspin{to{transform:rotate(360deg)}}',
      '@media (max-height: 760px){ .dc-root{ padding:12px; } .dc-grid{ gap:10px; } .dc-center{ grid-template-rows: minmax(0,50%) minmax(0,50%); } .dc-center-bottom.single-box{ padding:10px; } .dc-goal-title{ margin-bottom:10px; font-size:22px; } .dc-question{ max-height:3.2em; } .dc-answer-option span{ font-size:16px !important; } .dc-controls{ margin-top:4px; } }',
      '</style>'
    ].join('');
  }

  class DyadicChat {
    constructor(jsPsych){ this.jsPsych = jsPsych; }

    trial(display_element, trial){
      const self = this;
      let pairedPayload = null;
      const pidLabel = (trial.prolific && trial.prolific.PID) || 'DEBUG_LOCAL';

      function htmlWait(){
        return styleTag() + [
          '<div class="dc-wait">',
          '  <div class="dc-spinner"></div>',
          '  <div style="font-size:18px; color:#d0d4d9;">Waiting for another participant to join. Please keep this tab open. We’ll begin as soon as you’re paired.</div>',
          '  <div style="font-size:13px; color:#9aa0a6;">Please keep this tab open. We’ll begin as soon as you’re paired.</div>',
          '</div>'
        ].join('');
      }

      function htmlChat(p){
        const item = (p && p.item) || null;
        const minTurns = (p && p.min_turns) || trial.min_turns;
        const imgHtml = (item && item.image_url)
          ? '<div class="dc-image-viewport"><img id="dc-scene" src="' + item.image_url + '" alt="scene"></div>'
            + '<div class="dc-zoom-controls">'
            +   '<button id="dc-zoom-out" type="button" class="dc-zoom-btn" title="Zoom out">−</button>'
            +   '<button id="dc-zoom-reset" type="button" class="dc-zoom-btn" title="Reset">⟳</button>'
            +   '<button id="dc-zoom-in"  type="button" class="dc-zoom-btn" title="Zoom in">+</button>'
            + '</div>'
          : '<div style="color:#777">No image</div>';
        const opts = (item && item.options) || trial.answer_options || [];
        const goalQ = (item && item.goal_question) || trial.goal_question || '';

        return styleTag() + [
          '<div class="dc-root">',
          '  <div class="dc-grid">',
          '    <section class="dc-panel dc-left" style="overflow:auto; min-height:0;">',
                    '      <div class="dc-instructions">', (trial.instructions_html || ''), '</div>',
          '    </section>',
          '    <section class="dc-center">',
          '      <div class="dc-image">', imgHtml, '</div>',
          '      <section class="dc-center-bottom single-box">',
          '        <div class="dc-qa-wrap">',
          '          <h3 class="dc-goal-title">Goal Question</h3>',
          '          <div class="dc-question">', goalQ, '</div>',
          '          <div id="dc-answer-group" class="dc-answers">',
                     opts.map(function(opt){
                       return [
                         '<label class="dc-answer-option">',
                         '  <input type="radio" name="dc-answer" value="', String(opt).replace(/"/g,'&quot;'), '" disabled />',
                         '  <span>', String(opt), '</span>',
                         '</label>'
                       ].join('');
                     }).join(''),
          '          </div>',
          '          <div class="dc-availability-note">Only becomes accessible when ' + String(minTurns) + ' turns are completed.</div>',
          '          <button id="dc-submit" class="dc-btn dc-submit" disabled>Submit Answer</button>',
          '        </div>',
          '      </section>',
          '    </section>',
          '    <section class="dc-panel dc-right">',
          '      <div class="dc-title-row">',
          '        <div class="dc-title">ChatBox</div>',
          '        <div class="dc-small" style="font-size:14px; font-weight:bold;">',
          '          <span>Number of Turns&nbsp;&nbsp;</span>',
          '          <span id="dc-turns">0</span> / <span id="dc-turns-total">', String(minTurns), '</span>',
          '        </div>',
          '      </div>',
          '      <div id="dc-chat" class="dc-chatbox" aria-live="polite"></div>',
          '      <div class="dc-controls">',
          '        <textarea id="dc-msg" class="dc-input dc-textarea" rows="1" placeholder="Type your message"></textarea>',
          '        <button id="dc-send" class="dc-btn">Send</button>',
          '      </div>',
          '      <div id="dc-hint" class="dc-small dc-hint">Only one message at a time. Wait for your partner to respond.</div>',
          '    </section>',
          '  </div>',
          '</div>'
        ].join('');
      }

      const socket = io(trial.socketUrl, { query: { pid: pidLabel } });
      let myTurn = false, chatClosed = false;
      let msgCount = 0;
      const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

      function showBlocked(msg){
        display_element.innerHTML = styleTag() + '<div class="dc-wait"><div class="dc-spinner"></div><div style="font-size:18px;color:#d0d4d9;margin-top:8px;">' + msg + '</div></div>';
        try { self.jsPsych.finishTrial({ blocked: msg }); } catch {}
      }
      socket.on('blocked:repeat_pid', function(){ showBlocked('You have already participated in this study (one session per Prolific account).'); });
      socket.on('blocked:deck_complete', function(){ showBlocked('This study is currently full. All items have been completed. Thank you!'); });

      function updateTurns(){
        var completedTurns = Math.floor(msgCount / 2);
        var a = document.getElementById('dc-turns'); if (a) a.textContent = String(completedTurns);
        var sendBtn = document.getElementById('dc-send');
        var msg = document.getElementById('dc-msg');
        var allow = myTurn && !chatClosed;
        if (sendBtn) sendBtn.disabled = !allow;
        if (msg) msg.disabled = !allow;
        var ansInputs = Array.prototype.slice.call(document.querySelectorAll('input[name="dc-answer"]'));
        var submitBtn = document.getElementById('dc-submit');
        var threshold = ((pairedPayload && pairedPayload.min_turns) || trial.min_turns || 10);
        var canAnswer = chatClosed || (completedTurns >= threshold);
        ansInputs.forEach(function(el){ el.disabled = !canAnswer; });
        if (submitBtn) submitBtn.disabled = !canAnswer;
        var hint = document.getElementById('dc-hint');
        if (hint){
          if (chatClosed) hint.textContent = 'Maximum number of turns reached. Answer the question now.';
          else hint.textContent = myTurn ? 'It’s your turn. Type your message.' : 'Only one message at a time. Wait for your partner to respond.';
        }
      }

      function addLine(who, text){
        const box = document.getElementById('dc-chat'); if (!box) return;
        const line = document.createElement('div'); line.className = 'dc-row ' + (who==='Me'?'dc-me':'dc-partner');
        const bubble = document.createElement('span'); bubble.className = 'dc-bubble ' + (who==='Me'?'dc-bubble-me':'dc-bubble-partner');
        bubble.innerHTML = '<b>' + who + ':</b> ' + text;
        line.appendChild(bubble); box.appendChild(line); box.scrollTop = box.scrollHeight;
      }

      function sendMsg(){
        const el = document.getElementById('dc-msg');
        const text = (el && el.value || '').trim(); if (!text) return;
        if (!myTurn || chatClosed) return;
        addLine('Me', text);
        msgCount += 1; updateTurns();
        socket.emit('chat:message', { text: text });
        el.value = '';
        if (el && el.classList.contains('dc-textarea')) { el.style.height = 'auto'; el.style.overflowY = 'hidden'; }
      }

      function submitAnswer(){
        const el = document.querySelector('input[name="dc-answer"]:checked');
        if (!el) return;
        const nowTs = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const rt = Math.round(nowTs - t0);
        socket.emit('answer:submit', { choice: el.value, rt: rt });
        display_element.innerHTML = '<div style="padding:40px; font-size:20px;">Thanks! Your response was submitted. You may close the tab.</div>';
        self.jsPsych.finishTrial({ turns: Math.floor(msgCount/2), choice: el.value, rt: rt });
      }

      function setupTextarea(){
        const msgEl = document.getElementById('dc-msg');
        if (msgEl){
          const fit = () => {
            msgEl.style.height = 'auto';
            const max = 120;
            const h = Math.min(msgEl.scrollHeight, max);
            msgEl.style.height = h + 'px';
            msgEl.style.overflowY = (msgEl.scrollHeight > max) ? 'auto' : 'hidden';
          };
          msgEl.addEventListener('input', fit);
          setTimeout(fit, 0);
          msgEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMsg();
            }
          });
        }
      }

      function setupZoom(){
        const container = document.querySelector('.dc-image');
        const vp = container && container.querySelector('.dc-image-viewport');
        const img = container && container.querySelector('#dc-scene');
        const zin = document.getElementById('dc-zoom-in');
        const zout = document.getElementById('dc-zoom-out');
        const zreset = document.getElementById('dc-zoom-reset');
        if (!container || !vp || !img) { return; }

        let scale = 1, minScale = 1, maxScale = 4;
        let x = 0, y = 0;
        let baseW = 0, baseH = 0;

        function computeBase(){
          const rect = vp.getBoundingClientRect();
          const vpW = Math.max(1, rect.width);
          const vpH = Math.max(1, rect.height);
          const iw = img.naturalWidth || 1;
          const ih = img.naturalHeight || 1;
          const fit = Math.min(vpW/iw, vpH/ih, 1);
          baseW = iw * fit; baseH = ih * fit;
        }
        function maxOffsets(){
          const rect = vp.getBoundingClientRect();
          const vpW = Math.max(1, rect.width);
          const vpH = Math.max(1, rect.height);
          const scaledW = baseW * scale;
          const scaledH = baseH * scale;
          const mx = Math.max(0, (scaledW - vpW) / 2);
          const my = Math.max(0, (scaledH - vpH) / 2);
          return { mx, my };
        }
        function clamp(){
          const { mx, my } = maxOffsets();
          if (mx === 0) x = 0; else x = Math.max(-mx, Math.min(mx, x));
          if (my === 0) y = 0; else y = Math.max(-my, Math.min(my, y));
        }
        const apply = () => { clamp(); img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ') translateZ(0)'; };
        const setScale = (next) => { const c = Math.max(minScale, Math.min(maxScale, next)); if (c === 1){ x=0; y=0; } scale=c; apply(); };
        const zoomIn = () => setScale(scale + 0.25);
        const zoomOut = () => setScale(scale - 0.25);
        const reset = () => { scale=1; x=0; y=0; apply(); };

        if (zin) zin.addEventListener('click', (e)=>{ e.preventDefault(); zoomIn(); });
        if (zout) zout.addEventListener('click', (e)=>{ e.preventDefault(); zoomOut(); });
        if (zreset) zreset.addEventListener('click', (e)=>{ e.preventDefault(); reset(); });

        container.addEventListener('wheel', (e)=>{ e.preventDefault(); if (e.deltaY < 0) zoomIn(); else zoomOut(); }, { passive:false });

        let panning = false, lastX = 0, lastY = 0;
        vp.addEventListener('mousedown', (e)=>{ if (scale <= 1) return; panning=true; lastX=e.clientX; lastY=e.clientY; vp.classList.add('grabbing'); });
        window.addEventListener('mousemove', (e)=>{ if (!panning) return; const dx=e.clientX-lastX; const dy=e.clientY-lastY; lastX=e.clientX; lastY=e.clientY; x+=dx; y+=dy; apply(); });
        window.addEventListener('mouseup', ()=>{ panning=false; vp.classList.remove('grabbing'); });

        let mode = null, startDist = 0, startScale = 1, tX = 0, tY = 0;
        const dist = (a,b) => Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
        vp.addEventListener('touchstart', (e)=>{ if (e.touches.length===1){ mode='pan'; tX=e.touches[0].clientX; tY=e.touches[0].clientY; } else if (e.touches.length===2){ mode='pinch'; startDist=dist(e.touches[0], e.touches[1]); startScale=scale; } }, { passive:false });
        vp.addEventListener('touchmove', (e)=>{
          if (mode==='pan' && e.touches.length===1){ if (scale<=1) return; e.preventDefault(); const t=e.touches[0]; const dx=t.clientX-tX; const dy=t.clientY-tY; tX=t.clientX; tY=t.clientY; x+=dx; y+=dy; apply(); }
          else if (mode==='pinch' && e.touches.length===2){ e.preventDefault(); const d=dist(e.touches[0], e.touches[1]); setScale(startScale * (d/startDist)); }
        }, { passive:false });
        vp.addEventListener('touchend', ()=>{ mode=null; }, { passive:false });

        vp.addEventListener('dblclick', reset);

        function onReady(){ computeBase(); apply(); }
        if (!img.complete) img.addEventListener('load', onReady, { once:true });
        window.addEventListener('resize', onReady);
        onReady();
      }

      display_element.innerHTML = htmlWait();
      // 5-minute pairing timeout
      (function(){
        const TIMEOUT_MS = 5 * 60 * 1000;
        const timer = setTimeout(() => {
          try { if (!window.__pairedOnce) {
            display_element.innerHTML = '<div class="dc-wait"><div class="dc-spinner"></div><div style="font-size:18px;">Sorry — no partner joined within 5 minutes.</div><div style="font-size:13px;color:#9aa0a6;">You can close this tab and try again later.</div></div>';
            if (window.jsPsych) { window.jsPsych.finishTrial({ pairing_timeout: true }); }
          }} catch(e){}
        }, TIMEOUT_MS);
        window.__pairTimer = timer;
      })();
/* socket already defined */
/* duplicate removed */
      /* duplicate removed */
      /* duplicate removed */

      socket.on('paired', function(p){ window.__pairedOnce = true; try{ if(window.__pairTimer){ clearTimeout(window.__pairTimer); delete window.__pairTimer; } }catch(e){}
        display_element.innerHTML = htmlChat(p);
        let pairedPayload = p;
        const sendBtn = document.getElementById('dc-send');
        if (sendBtn) sendBtn.addEventListener('click', sendMsg);
        const submitBtn = document.getElementById('dc-submit');
        if (submitBtn) submitBtn.addEventListener('click', submitAnswer);
        setupTextarea();
        setupZoom();
        updateTurns();
      });

      socket.on('chat:message', function(msg){ addLine('Partner', msg.text); msgCount += 1; updateTurns(); });
      socket.on('turn:you', function(){ myTurn = true; updateTurns(); });
      socket.on('turn:wait', function(){ myTurn = false; updateTurns(); });
      socket.on('chat:closed', function(){ chatClosed = true; updateTurns(); });
      socket.on('end:self', function(){
        display_element.innerHTML = '<div style="padding:40px; font-size:20px;">Thanks! Your response was submitted. You may close the tab.</div>';
        try { window.jsPsych.finishTrial({ turns: Math.floor(msgCount/2), ended:'self' }); } catch {}
      });
    }
  }

  DyadicChat.info = info;
  window.jsPsychDyadicChat = DyadicChat;
})();