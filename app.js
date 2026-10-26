import {seedData} from "./data/data.js";

const $ = s => document.querySelector(s);
const phoneEl = $("#phone");
const screen = $("#screen"), overlay = $("#overlay-root"), wallpaper = $("#wallpaper");
const KEY="ios-web-sim-v1";
let state = JSON.parse(localStorage.getItem(KEY) || "null") || structuredClone(seedData);
let view="lock", page=0, currentApp=null, chatId=null, editingNote=null;

function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function now(){return new Date()}
function time(){return now().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit"})}
function date(){return now().toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"long"})}
function icons(){
  return [
    ["메시지","💬","linear-gradient(135deg,#36d45d,#18a941)","messages"],
    ["사진","🌈","linear-gradient(135deg,#ffcf40,#ff5f7a,#8a5cff)","photos"],
    ["카메라","📷","#222","camera"],["Safari","🧭","linear-gradient(135deg,#55c8ff,#1260ff)","safari"],
    ["메모","📝","#fff","notes"],["캘린더","📅","#fff","calendar"],
    ["전화","📞","#34c759","phone"],["설정","⚙️","#777","settings"],
  ];
}
function status(){return `<div class="status"><span>${time()}</span><span class="island"></span><span class="status-icons">▮▮▮　⌁　<span class="battery"><i></i></span></span></div>`}
function setWallpaper(){wallpaper.style.background=state.wallpaper}
function render(){
  setWallpaper();
  screen.innerHTML = status();
  if(view==="lock") renderLock();
  if(view==="home") renderHome();
  if(view==="app") renderApp();
  if(view==="control") renderHome(),renderControl();
  if(view==="notifications") renderHome(),renderNotifications();
  if(view==="switcher") renderHome(),renderSwitcher();
  $("#home-indicator").style.zIndex = view==="app"||view==="home" ? 80 : 70;
}
function renderLock(){
  screen.innerHTML += `<div class="lock">
    <div><div class="time">${time()}</div><div class="date">${date()}</div></div>
    <div class="notifications">${state.notifications.slice(0,3).map(n=>`<div class="notif"><b>${n.app} · ${n.title}</b><p>${n.body}</p></div>`).join("")}</div>
    <div class="lock-actions"><button class="circle-btn" data-action="flash">🔦</button><div class="swipe-hint">위로 쓸어올려 잠금 해제</div><button class="circle-btn" data-action="camera">📷</button></div>
  </div>`;
}
function renderHome(){
  const all=icons();
  screen.innerHTML += `<div class="home">
    <div class="home-pages"><div class="page-track" style="transform:translateX(-${page*100}%)">
      <div class="page">
        <div class="widget"><small>${date()}</small><div class="big">${time()}</div><small>오늘도 좋은 하루</small></div>
        ${all.slice(0,4).map(appIcon).join("")}
        ${all.slice(4).map(appIcon).join("")}
      </div>
      <div class="page">
        <div class="widget"><small>가상 위젯</small><div class="big">☀︎ 18°</div><small>브라우저 안에서만 작동합니다</small></div>
        ${[["파일","📁","#8c8c92","files"],["연락처","👤","#eee","contacts"],["음악","♫","#ff2d55","music"],["시계","⏱️","#111","clock"]].map(appIcon).join("")}
      </div>
    </div></div>
    <div class="dots">● ${page===0?"○":"●"}</div>
    <div class="dock">${all.slice(0,4).map(appIcon).join("")}</div>
  </div>`;
}
function appIcon(a){return `<button class="app-icon" data-app="${a[3]}"><span class="icon-box" style="background:${a[2]}">${a[1]}</span>${a[0]}</button>`}
function renderControl(){
  overlay.innerHTML=`<div class="control" id="control">
    <div class="panel-grid">
      ${tile("Wi‑Fi","⌁","wifi")} ${tile("Bluetooth","ᛒ","bluetooth")}
      ${tile("집중 모드","☾","focus")} ${tile("손전등","🔦","flash")}
      <div class="panel wide slider"><input type="range" min="0" max="100" value="${state.settings.brightness}" data-setting="brightness"></div>
      <div class="panel wide slider"><input type="range" min="0" max="100" value="${state.settings.volume}" data-setting="volume"></div>
    </div><div class="close-hint">아래로 쓸어 닫기 · 바깥 영역 탭</div>
  </div>`;
}
function tile(label,emoji,key){let on=state.settings[key];return `<button class="control-tile ${on?"on":""}" data-toggle="${key}"><b>${emoji}</b><span>${label}</span></button>`}
function renderNotifications(){
  overlay.innerHTML=`<div class="notification-center"><div class="nc-title"><div class="nc-date">${date()}</div>${time()}</div>
  <div class="nc-list">${state.notifications.map(n=>`<button class="notif" data-notif="${n.id}"><b>${n.app} · ${n.title}</b><p>${n.body}</p></button>`).join("") || '<div class="empty">새로운 알림이 없습니다.</div>'}</div>
  <div class="close-hint">탭하여 닫기</div></div>`;
}
function renderSwitcher(){
  const rec=state.recent.slice(-5).reverse();
  overlay.innerHTML=`<div class="app-switcher">${rec.length?rec.map((r,i)=>`<article class="recent-card" data-recent="${i}"><div class="recent-head">${r.name}</div><div class="recent-preview">${r.preview}</div></article>`).join(""):`<div class="empty" style="color:white">최근 사용한 앱이 없습니다.</div>`}</div>`;
}
function nav(title,back=true){return `<div class="app-nav">${back?`<button class="back" data-back>‹ 뒤로</button>`:"<span></span>"}<h1>${title}</h1><span></span></div>`}
function renderApp(){
  overlay.innerHTML="";
  let body="";
  if(currentApp==="messages") body=messages();
  else if(currentApp==="photos") body=photos();
  else if(currentApp==="camera") body=camera();
  else if(currentApp==="safari") body=safari();
  else if(currentApp==="notes") body=notes();
  else if(currentApp==="calendar") body=calendar();
  else if(currentApp==="phone") body=phoneApp();
  else if(currentApp==="settings") body=settings();
  else body=`${nav(currentApp)}<div class="app-body empty">이 앱은 확장 가능한 가상 앱 자리입니다.</div>`;
  screen.innerHTML += `<div class="app-window">${body}</div>`;
}
function messages(){
 const m=state.messages.find(x=>x.id===chatId);
 if(m)return `${nav(m.name)}<div class="app-body"><div class="chat">${m.messages.map(x=>`<div class="bubble ${x.mine?"mine":""}">${esc(x.text)}</div>`).join("")}</div></div><div class="compose"><input id="msgInput" placeholder="메시지"><button class="send" data-send>전송</button></div>`;
 return `${nav("메시지",false)}<div class="app-body">${state.messages.map(x=>`<button class="row" data-chat="${x.id}"><span class="icon-box" style="background:#36d45d;width:44px;height:44px;font-size:20px">💬</span><span class="grow"><b>${x.name}</b><br><small>${x.last}</small></span><span>›</span></button>`).join("")}<button class="card blue" data-newchat>＋ 새 대화</button></div>`;
}
function photos(){return `${nav("사진",false)}<div class="app-body"><div class="grid">${state.photos.map((p,i)=>`<button class="photo" data-photo="${i}">${p}</button>`).join("")}</div><button class="card blue" data-addphoto>＋ 가상 사진 추가</button></div>`}
function camera(){return `<div class="app-window camera"><div class="camera-view"><span style="font-size:14px;opacity:.7">가상 카메라 미리보기</span></div><button class="shutter" data-shoot></button><button class="back" style="margin-top:15px" data-back>닫기</button></div>`}
function safari(){return `${nav("Safari",false)}<div class="browser"><div class="urlbar">🔒 simulator.local</div><div class="browser-page"><h2>환영합니다.</h2><p>이 Safari는 실제 인터넷에 연결하지 않는 가상 브라우저입니다.</p><div class="card">즐겨찾기<br><br>🧭 가상 시작 페이지</div></div></div>`}
function notes(){let n=state.notes.find(x=>x.id===editingNote); if(n)return `${nav(n.title)}<div class="app-body notes"><textarea id="noteBody">${esc(n.body)}</textarea></div>`;
 return `${nav("메모",false)}<div class="app-body">${state.notes.map(n=>`<button class="row" data-note="${n.id}"><span class="grow"><b>${esc(n.title)}</b><br><small>${esc(n.body)}</small></span>›</button>`).join("")}<button class="card blue" data-newnote>＋ 새 메모</button></div>`}
function calendar(){let days=Array.from({length:31},(_,i)=>`<div class="day ${i===25?"today":""}">${i+1}</div>`).join("");return `${nav("캘린더",false)}<div class="app-body"><div class="calendar">${["일","월","화","수","목","금","토"].map(x=>`<b>${x}</b>`).join("")}${days}</div>${state.events.map(e=>`<div class="event"><b>${e.time}</b> · ${esc(e.title)}</div>`).join("")}<button class="card blue" data-newevent>＋ 일정 추가</button></div>`}
function phoneApp(){return `${nav("최근 통화",false)}<div class="app-body">${["민준","서연","가상 연락처"].map(x=>`<div class="row">📞 <span class="grow"><b>${x}</b><br><small>오늘</small></span>›</div>`).join("")}<div class="keypad">${"123456789*0#".split("").map(x=>`<button class="key" data-key="${x}">${x}</button>`).join("")}</div></div>`}
function settings(){return `${nav("설정",false)}<div class="app-body">
 <div class="card" style="display:flex;align-items:center;gap:12px"><span style="font-size:38px">👤</span><span><b>가상 사용자</b><br><small>iOS Web Simulator</small></span>›</div>
 ${settingRow("Wi‑Fi","wifi")} ${settingRow("Bluetooth","bluetooth")} ${settingRow("집중 모드","focus")}
 <div class="card"><div class="row"><span>배경화면</span><span class="grow"></span><button class="blue" data-wallpaper>변경</button></div>
 <div class="row"><span>디스플레이 밝기</span><span class="grow"></span><input type="range" data-setting="brightness" value="${state.settings.brightness}"></div></div>
 <div class="card"><button class="row reset" data-reset>모든 가상 데이터 초기화</button></div>
 </div>`}
function settingRow(label,key){return `<div class="switch-row"><span>${label}</span><button class="switch ${state.settings[key]?"on":""}" data-toggle="${key}"></button></div>`}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(t){let e=document.createElement("div");e.className="toast";e.textContent=t;screen.appendChild(e);setTimeout(()=>e.remove(),1800)}
function openApp(name){
  if(name==="camera"){currentApp="camera";view="app"}else{currentApp=name;view="app"}
  state.recent=state.recent.filter(r=>r.name!==name);state.recent.push({name,preview:`<div style="font-size:22px">${name}</div><p>가상 앱의 최근 화면</p>`});save();render()
}
function home(){view="home";currentApp=null;editingNote=null;chatId=null;overlay.innerHTML="";render()}
function touchNav(){
 let sy=0,sx=0;
 phoneE1.addEventListener("pointerdown",e=>{sy=e.clientY;sx=e.clientX;phoneE1.setPointerCapture?.(e.pointerId)});
 phoneE1.addEventListener("pointerup",e=>{
   const dy=e.clientY-sy,dx=e.clientX-sx;
   if(Math.abs(dy)>70){
     if(view==="lock"&&dy<0)return home();
     if(view==="home"&&dy<0&&sy>innerHeight*.75)return view="switcher",render();
     if((view==="control"||view==="notifications")&&dy>70){view="home";overlay.innerHTML="";render();return}
     if(view==="home"&&sy<90&&dx<0){view="notifications";render();return}
     if(view==="home"&&sy<90&&dx>0){view="control";render();return}
   }
   if(Math.abs(dx)>70&&view==="home"){page=Math.max(0,Math.min(1,page+(dx<0?1:-1)));render()}
 });
}
phone.addEventListener("click",e=>{
 const t=e.target.closest("button"); if(!t)return;
 if(t.dataset.action==="camera")openApp("camera");
 if(t.dataset.action==="flash")toast("손전등은 가상 기능입니다.");
 if(t.dataset.app)openApp(t.dataset.app);
 if(t.dataset.back){if(editingNote){editingNote=null;render()}else if(chatId){chatId=null;render()}else home()}
 if(t.dataset.chat){chatId=+t.dataset.chat;render()}
 if(t.dataset.send){let inp=$("#msgInput"),m=state.messages.find(x=>x.id===chatId);if(inp?.value.trim()){m.messages.push({mine:true,text:inp.value.trim()});m.last=inp.value.trim();state.notifications.unshift({id:Date.now(),app:"메시지",title:m.name,body:inp.value.trim()});save();render()}}
 if(t.dataset.newchat){state.messages.push({id:Date.now(),name:"새 연락처",last:"새 대화를 시작하세요.",messages:[]});save();render()}
 if(t.dataset.addphoto){state.photos.push("🖼️");save();render();toast("가상 사진을 추가했습니다.")}
 if(t.dataset.photo){overlay.innerHTML=`<div class="app-window"><div class="app-nav"><button class="back" data-closephoto>‹ 사진</button><h1>사진</h1><span></span></div><div class="app-body"><div class="photos-detail">${state.photos[+t.dataset.photo]}</div></div></div>`}
 if(t.dataset.closephoto){overlay.innerHTML=""}
 if(t.dataset.note){editingNote=+t.dataset.note;render()}
 if(t.dataset.newnote){state.notes.push({id:Date.now(),title:"새로운 메모",body:""});save();editingNote=state.notes.at(-1).id;render()}
 if(t.dataset.newevent){state.events.push({date:"26",title:"새 일정",time:"20:00"});save();render();toast("가상 일정을 추가했습니다.")}
 if(t.dataset.toggle){state.settings[t.dataset.toggle]=!state.settings[t.dataset.toggle];save();render()}
 if(t.dataset.wallpaper){const x=prompt("배경화면 CSS 색상/그라디언트를 입력하세요.",state.wallpaper);if(x){state.wallpaper=x;save();render()}}
 if(t.dataset.reset&&confirm("가상 데이터를 초기 상태로 되돌릴까요?")){state=structuredClone(seedData);save();view="lock";render()}
 if(t.dataset.shoot){state.photos.push("📸");save();toast("가상 사진이 촬영되었습니다.");}
 if(t.dataset.recent){openApp(state.recent.slice().reverse()[+t.dataset.recent]?.name)}
 if(t.dataset.notif){let n=state.notifications.find(x=>x.id==t.dataset.notif);if(n&&n.app==="메시지"){chatId=state.messages[0]?.id;view="app";render()}else{view="home";render()}}
});
document.addEventListener("input",e=>{
 if(e.dataset.setting){state.settings[e.dataset.setting]=+e.value;save(); if(e.dataset.setting==="brightness")phone.style.filter=`brightness(${.65+state.settings.brightness/100*.35})`}
 if(e.id==="noteBody"){let n=state.notes.find(x=>x.id===editingNote);if(n){n.body=e.value;save()}}
});
$("#home-indicator").addEventListener("click",()=>view==="home"?null:home());
touchNav();setInterval(()=>{if(view==="lock"||view==="home")render()},1000);render();
