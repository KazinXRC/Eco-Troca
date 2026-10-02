// Chave para armazenar no localStorage do navegador
const STORAGE_KEY = 'ecotroca_items_v1';

// Dados de exemplo iniciais caso o usuário nunca tenha usado o app
const initialItems = [
  {
    id: 1,
    titulo: 'Calculadora Científica FX-82',
    categoria: 'Eletrônicos',
    descricao: 'Funcionando perfeitamente. Não preciso mais para as aulas.',
    contato: 'Lucas M. (3º C)'
  },
  {
    id: 2,
    titulo: 'Livro "Dom Casmurro"',
    categoria: 'Livros e Didáticos',
    descricao: 'Livro usado no 1º bimestre. Ótimo estado.',
    contato: 'Mariana K. (1º A)'
  }
];

// Elementos do DOM
const itemForm = document.getElementById('item-form');
const itemsGrid = document.getElementById('items-grid');
const filterCategoria = document.getElementById('filter-categoria');

// Carregar itens salvos no navegador ou carregar iniciais
function getStoredItems() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
    return initialItems;
  }
  return JSON.parse(data);
}

// Salvar novos itens
function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Renderizar cards na tela
function renderItems() {
  const items = getStoredItems();
  const selectedFilter = filterCategoria.value;

  // Limpar a lista atual
  itemsGrid.innerHTML = '';

  // Filtrar itens por categoria
  const filteredItems = selectedFilter === 'TODAS'
    ? items
    : items.filter(item => item.categoria === selectedFilter);

  if (filteredItems.length === 0) {
    itemsGrid.innerHTML = `<p class="empty-message">Nenhum item encontrado nesta categoria.</p>`;
    return;
  }

  // Criar os cards dinamicamente
  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';

    card.innerHTML = `
      <div>
        <span class="tag">${escapeHTML(item.categoria)}</span>
        <h3>${escapeHTML(item.titulo)}</h3>
        <p>${escapeHTML(item.descricao)}</p>
      </div>
      <div class="contact-info">
        Anunciado por: <strong>${escapeHTML(item.contato)}</strong>
      </div>
    `;

    itemsGrid.appendChild(card);
  });
}

// Adicionar um novo item via formulário
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const categoria = document.getElementById('categoria').value;
  const descricao = document.getElementById('descricao').value.trim();
  const contato = document.getElementById('contato').value.trim();

  if (!titulo || !categoria || !descricao || !contato) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  const newItem = {
    id: Date.now(),
    titulo,
    categoria,
    descricao,
    contato
  };

  const currentItems = getStoredItems();
  currentItems.unshift(newItem); // Adiciona no início da lista

  saveItems(currentItems);
  renderItems();

  // Resetar formulário
  itemForm.reset();
});

// Evento de mudança de filtro
filterCategoria.addEventListener('change', renderItems);

// Função de segurança básica para prevenir XSS ao injetar HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Inicializar aplicativo
document.addEventListener('DOMContentLoaded', renderItems);
