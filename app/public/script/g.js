function requestPost(url, data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

//读取cookies
function getCookie(name){
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg)
  if(arr)
    return unescape(arr[2]);
  else
    return null;
}

function setCookie(name, value){
  const exp = new Date();
  exp.setTime(exp.getTime() + 24*60*60*1000);
  document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString();
}

function getId() {
  let id = getCookie('socketId');
  if(!id){
    id = Math.random().toString(16).slice(2);
    setCookie('socketId', id);
  }
  return id;
}
function ws() {
  const socketId = getId();
  const socket = window.io('ws://localhost:3000');
  socket.emit('conn', socketId);
  socket.on('conn', (msg) => {
    console.log(msg);
  });

  return socket;
}

function changeTheme() {
  const theme = (getCookie('theme') || 'light') === 'light' ? 'dark' : 'light';

  document
    .querySelector('body')
    .classList
    .toggle('dark-theme', theme === 'dark');
  setCookie('theme', theme);
}

window.onload = () => {
  const icon = document.createElement('div');
  icon.classList.add('icon-theme');
  icon.innerHTML = `
    <svg id="icon-l" width="30" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" shape-rendering="geometricPrecision" viewBox="0 0 24 24" height="14" width="14" style="color: currentcolor;"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
    <svg id="icon-d" width="30" height="30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" shape-rendering="geometricPrecision" viewBox="0 0 24 24" height="14" width="14" style="color: currentcolor;"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>
  `;
  icon.addEventListener('click', changeTheme);
  document.body.appendChild(icon);
}
