const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');
const budgetInput = document.getElementById('budget');
const totalEl = document.getElementById('total');
const alertaEl = document.getElementById('alerta');
const listEl = document.getElementById('list');
const remainingEl = document.getElementById('remaining');

// Carrega os itens salvos e o último orçamento definido
let items = JSON.parse(localStorage.getItem('items_simple')) || [];
if (budgetInput) {
  budgetInput.value = localStorage.getItem('budget_simple') || '';
}

function addItem(){
  if(!nameInput.value.trim()) return;

  const item = {
    name: nameInput.value.trim(),
    price: parseFloat(priceInput.value) || 0,
    qty: parseFloat(qtyInput.value) || 1,
    active: true, // Já inicia ativado para somar imediatamente
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
  if (budgetInput) {
    localStorage.setItem('budget_simple', budgetInput.value);
  }
}

// Ouve as mudanças no input do orçamento para salvar e recalcular na hora
if (budgetInput) {
  budgetInput.addEventListener('input', () => {
    save();
    calc();
  });
}

// ==========================================
//  SISTEMA DE SINCRONIZAÇÃO BLINDADO
// ==========================================

function exportarLista() {
  if (items.length === 0) {
    alert("Sua lista está vazia!");
    return;
  }
  
  const dados = {
    lista: items,
    orcamento: budgetInput.value
  };

  try {
    const stringDados = JSON.stringify(dados);
    // Cria o Base64 aplicando escape preventivo para acentos
    const hashBase64 = btoa(unescape(encodeURIComponent(stringDados)));
    const hashSeguro = encodeURIComponent(hashBase64);
    
    const urlFinal = window.location.origin + window.location.pathname + '?sync=' + hashSeguro;
    
    navigator.clipboard.writeText(urlFinal).then(() => {
      alert("Link de sincronização copiado com sucesso! Compartilhe via WhatsApp.");
    }).catch(() => {
      prompt("Cópia automática bloqueada. Copie manualmente o link abaixo:", urlFinal);
    });
  } catch (erro) {
    alert("Falha ao compactar os dados da lista.");
    console.error(erro);
  }
}

function verificarImportacao() {
  const urlParams = new URLSearchParams(window.location.search);
  const syncHash = urlParams.get('sync');
  
  if (syncHash) {
    let dadosImportados = null;

    // TENTATIVA 1: Tenta ler no formato novo blindado (com suporte a acentos)
    try {
      const stringDados = decodeURIComponent(escape(atob(syncHash)));
      dadosImportados = JSON.parse(stringDados);
    } catch (e1) {
      // TENTATIVA 2: Se falhar (como no link antigo que você enviou), tenta ler o Base64 puro direto
      try {
        const stringDadosAlternativa = decodeURIComponent(atob(syncHash));
        dadosImportados = JSON.parse(stringDadosAlternativa);
      } catch (e2) {
        console.error("Ambos os métodos de decodificação falharam:", e2);
      }
    }
    
    // Se conseguiu decodificar por qualquer um dos dois métodos, processa a lista
    if (dadosImportados && Array.isArray(dadosImportados.lista)) {
      if (confirm("Deseja sincronizar e mesclar os dados recebidos com a sua lista atual?")) {
        
        if (dadosImportados.orcamento) {
          budgetInput.value = dadosImportados.orcamento;
        }
        
        dadosImportados.lista.forEach(itemImportado => {
          const itemExistente = items.find(i => i.name.toLowerCase() === itemImportado.name.toLowerCase());
          
          if (itemExistente) {
            // Mescla o progresso sem duplicar itens repetidos
            itemExistente.active = itemImportado.active;
            itemExistente.price = itemImportado.price;
            itemExistente.qty = itemImportado.qty;
          } else {
            items.push(itemImportado);
          }
        });
        
        save();
        alert("Lista sincronizada com sucesso!");
      }
    } else {
      alert("Não foi possível ler este link de sincronização. Certifique-se de que ele não foi cortado no envio.");
    }

    // Limpa o hash da URL de qualquer forma para não ficar dando loops/prompts ao atualizar a página
    window.history.replaceState({}, document.title, window.location.pathname);
    render();
  }
}

// Execução inicial do app ao abrir a página
verificarImportacao();
render();
