const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');
const budgetInput = document.getElementById('budget');
const totalEl = document.getElementById('total');
const alertaEl = document.getElementById('alerta');
const listEl = document.getElementById('list');
const remainingEl = document.getElementById('remaining');

// Carrega os itens salvos ou inicia uma lista vazia
let items = JSON.parse(localStorage.getItem('items_simple')) || [];

function addItem(){
  if(!nameInput.value.trim()) return;

  const item = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value) || 0,
    qty: parseFloat(qtyInput.value) || 1,
    active: true, // Já inicia verdadeiro para somar direto
    selected: false
  };

  items.push(item);
  save();

  // Limpa os campos do formulário
  nameInput.value = '';
  priceInput.value = '';
  qtyInput.value = '';

  render();
}

function render(){
  listEl.innerHTML = '';

  // Se a lista estiver vazia, limpa a tela, roda o cálculo zerado e para aqui
  if(items.length === 0){
    listEl.innerHTML = '<div class="empty-state">Nenhum item adicionado ainda</div>';
    calc();
    return;
  }

  items.forEach((i, index) => {
    const div = document.createElement('div');
    div.className = 'item ' + (i.active ? 'active' : '');

    const deleteBtn = i.selected ? '<button class="btn btn-danger" onclick="removeItem(' + index + ')">Excluir</button>' : '';

    div.innerHTML = 
      '<div class="left">' +
        '<input type="checkbox" ' + (i.selected ? 'checked' : '') + ' onchange="selectItem(' + index + ')">' +
        '<span onclick="toggle(' + index + ')">' + i.name + ' - R$ ' + (i.price * i.qty).toFixed(2) + '</span>' +
      '</div>' +
      '<div>' + deleteBtn + '</div>';

    listEl.appendChild(div);
  });

  // Roda o cálculo sempre que a lista terminar de desenhar na tela
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
  items.splice(i, 1);
  save();
  render();
}

function calc(){
  let total = 0;

  // Percorre todos os itens e calcula o valor total acumulado
  items.forEach(i => {
    // Se quiser somar absolutamente TUDO da lista, use: total += i.price * i.qty;
    // Do jeito abaixo, soma apenas os itens que estão com a tarja verde (ativos)
    if(i.active) {
      total += i.price * i.qty;
    }
  });

  const budgetVal = parseFloat(budgetInput.value) || 0;
  const remaining = budgetVal - total;

  // Atualiza os textos no HTML
  if (totalEl) totalEl.innerText = total.toFixed(2);
  if (remainingEl) remainingEl.innerText = 'R$ ' + remaining.toFixed(2);

  // Monitora se ultrapassou o limite do orçamento informado
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

// Ouve as mudanças de digitação no campo de limite do Orçamento
budgetInput.addEventListener('input', calc);

const btnToup = document.getElementById('btnToup');
if (btnToup) {
  window.addEventListener('scroll', function(){
    if(window.scrollY > 300){
      btnToup.classList.add('visible');
    } else {
      btnToup.classList.remove('visible');
    }
  });
}

// Executa a primeira renderização e cálculo assim que a página abre
render();
