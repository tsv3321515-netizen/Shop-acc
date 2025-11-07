async function napThe() {
  const data = {
    user: document.getElementById('user').value,
    telco: document.getElementById('telco').value,
    amount: document.getElementById('amount').value,
    seri: document.getElementById('seri').value,
    code: document.getElementById('code').value
  };
  const res = await fetch('/api/napthe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  document.getElementById('naptheResult').innerText = json.message;
}

async function loadAcc() {
  const res = await fetch('/api/accounts');
  const data = await res.json();
  const div = document.getElementById('accList');
  div.innerHTML = data.map(a =>
    `<div class='acc'>
      <b>${a.name}</b> - ${a.price}đ
      ${a.sold ? "<span>Đã bán</span>" : `<button onclick="buyAcc('${a.id}')">Mua</button>`}
    </div>`
  ).join('');
}

async function buyAcc(id) {
  const username = prompt("Tên tài khoản:");
  const res = await fetch('/api/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, accId: id })
  });
  const json = await res.json();
  alert(json.message);
  loadAcc();
}

loadAcc();
