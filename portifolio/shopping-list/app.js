const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');
const budgetInput = document.getElementById('budget');
const totalEl = document.getElementById('total');
const alertaEl = document.getElementById('alerta');
const listEl = document.getElementById('list');
const remainingEl = document.getElementById('remaining');

let items = JSON.parse(localStorage.getItem('items_simple')) || [];

function addItem(){
  if(!nameInput.value.trim()) return;

  const item = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value) || 0,
    qty: parseFloat(qtyInput.value) || 1,
    active:false,
    selected:false
  };

  items.push(item);
  save();

  nameInput.value = '';
  priceInput.value = '';
  qtyInput.value = '';

  render();
}

function render(){
  listEl.innerHTML = '';

  if(items.length === 0){
    listEl.innerHTML = '<div class="empty-state">Nenhum item adicionado ainda</div>';
    calc();
    return;
  }

  items.forEach((i,index)=>{
    const div = document.createElement('div');
    div.className = 'item ' + (i.active ? 'active':'');

    const deleteBtn = i.selected ? '<button class="btn btn-danger" onclick="removeItem(' + index + ')">Excluir</button>' : '';

    div.innerHTML = 
      '<div class="left">' +
        '<input type="checkbox" ' + (i.selected ? 'checked' : '') + ' onchange="selectItem(' + index + ')">' +
        '<span onclick="toggle(' + index + ')">' + i.name + ' - R$ ' + (i.price * i.qty).toFixed(2) + '</span>' +
      '</div>' +
      '<div>' + deleteBtn + '</div>';

    listEl.appendChild(div);
  });

  calc();
}

function toggle(i){
  items[i].active = !items[i].active;
  save();
  render();
}

function selectItem(i){
  items[i].selected = !items[i].selected;
  save();
  render();
}

function removeItem(i){
  items.splice(i,1);
  save();
  render();
}

function calc(){
  let total = 0;

  items.forEach(i=>{
    if(i.active) total += i.price * i.qty;
  });

  const budgetVal = parseFloat(budgetInput.value) || 0;
  const remaining = budgetVal - total;

  totalEl.innerText = total.toFixed(2);
  remainingEl.innerText = 'R$ ' + remaining.toFixed(2);

  if(total > budgetVal && budgetVal > 0){
    alertaEl.innerText = 'Ultrapassou o orçamento!';
    alertaEl.classList.add('visible');
  } else {
    alertaEl.innerText = '';
    alertaEl.classList.remove('visible');
  }
}

function save(){
  localStorage.setItem('items_simple', JSON.stringify(items));
}

budgetInput.addEventListener('input', calc);

const btnToup = document.getElementById('btnToup');

window.addEventListener('scroll', function(){
  if(window.scrollY > 300){
    btnToup.classList.add('visible');
  } else {
    btnToup.classList.remove('visible');
  }
});

render();
