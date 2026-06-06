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
    active: true, 
    selected: false
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
  items.forEach(i => {
    if(i.active) total += i.price * i.qty;
  });

  const budgetVal = parseFloat(budgetInput.value) || 0;
  const remaining = budgetVal - total;

  if (totalEl) totalEl.innerText = total.toFixed(2);
  if (remainingEl) remainingEl.innerText = 'R$ ' + remaining.toFixed(2);

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

// ==========================================
//  NOVA FUNÇÃO: EXPORTAR E IMPORTAR (SINCRONIZAR)
// ==========================================

function exportarLista() {
  if (items.length === 0) {
    alert("Sua lista está vazia!");
    return;
  }
  
  // Transforma a lista e o orçamento atual em texto codificado (Base64 seguro para URL)
  const dados = {
    lista: items,
    orcamento: budgetInput.value
  };
  const stringDados = JSON.stringify(dados);
  const hash = btoa(encodeURIComponent(stringDados));
  
  // Monta o link final usando a URL atual do navegador
  const urlFinal = window.location.origin + window.location.pathname + '?sync=' + hash;
  
  // Tenta copiar direto para a área de transferência para colar no WhatsApp
  navigator.clipboard.writeText(urlFinal).then(() => {
    alert("Link de sincronização copiado! Só colar no WhatsApp da sua esposa/esposo.");
  }).catch(() => {
    // Caso o navegador bloqueie a cópia automática por segurança
    prompt("Copie o link abaixo para enviar:", urlFinal);
  });
}

function verificarImportacao() {
  const urlParams = new URLSearchParams(window.location.search);
  const syncHash = urlParams.get('sync');
  
  if (syncHash) {
    try {
      // Decodifica o texto do link trazido da URL
      const stringDados = decodeURIComponent(atob(syncHash));
      const dadosImportados = JSON.parse(stringDados);
      
      if (dadosImportados && Array.isArray(dadosImportados.lista)) {
        if (confirm("Deseja sincronizar e mesclar a lista recebida com a sua atual?")) {
          
          // Aplica o orçamento recebido se o seu estiver zerado
          if (!budgetInput.value && dadosImportados.orcamento) {
            budgetInput.value = dadosImportados.orcamento;
          }
          
          // Inteligência de Mesclagem:
          dadosImportados.lista.forEach(itemImportado => {
            // Procura se o item já existe na sua lista (pelo nome)
            const itemExistente = items.find(i => i.name.toLowerCase() === itemImportado.name.toLowerCase());
            
            if (itemExistente) {
              // Se ela já marcou que pegou o item (active mudou) ou mudou o preço, atualiza o seu
              itemExistente.active = itemImportado.active;
              itemExistente.price = itemImportado.price;
              itemExistente.qty = itemImportado.qty;
            } else {
              // Se for um item novo que ela adicionou no meio do caminho, insere na sua lista
              items.push(itemImportado);
            }
          });
          
          save();
          
          // Limpa o link da barra de endereço para não ficar importando toda vez que atualizar a página
          window.history.replaceState({}, document.title, window.location.pathname);
          
          alert("Sincronizado com sucesso!");
          render();
        }
      }
    } catch (e) {
      alert("Erro ao ler o link de sincronização. Verifique se o link foi copiado por completo.");
    }
  }
}

budgetInput.addEventListener('input', calc);

// Verifica se há alguma lista recebida por link logo ao abrir a página
verificarImportacao();

render();
