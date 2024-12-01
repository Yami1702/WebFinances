const form = document.getElementById('form');
const nomeInput = document.getElementById('nome');
const categoriaSelect = document.getElementById('categoria');
const dataInput = document.getElementById('data');
const valorInput = document.getElementById('valor');
const transacoesTable = document.getElementById('transacoes-table').getElementsByTagName('tbody')[0];
const totalReceitas = document.getElementById('total-receitas');
const totalDespesas = document.getElementById('total-despesas');
const saldoFinal = document.getElementById('saldo-final');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroData = document.getElementById('filtro-data');
const aplicarFiltroBtn = document.getElementById('aplicar-filtro');
const toggleThemeBtn = document.getElementById('toggle-theme');
const graficoCanvas = document.getElementById('grafico');

// Dados armazenados
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

// Função para salvar as transações no LocalStorage
function salvarTransacoes() {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
    atualizarTabela();
    atualizarResumo();
    gerarGrafico();
}

// Função para atualizar a tabela de transações
function atualizarTabela() {
    transacoesTable.innerHTML = '';
    transacoes.forEach((transacao, index) => {
        const row = transacoesTable.insertRow();
        row.innerHTML = `
            <td>${transacao.nome}</td>
            <td>${transacao.categoria}</td>
            <td>${transacao.data}</td>
            <td>${formatarValor(transacao.valor)}</td>
            <td>
                <button class="editar" onclick="editarTransacao(${index})">Editar</button>
                <button class="excluir" onclick="excluirTransacao(${index})">Excluir</button>
            </td>
        `;
    });
}

// Função para formatar o valor como moeda
function formatarValor(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Função para atualizar o resumo financeiro
function atualizarResumo() {
    const receitas = transacoes.filter(t => t.categoria === 'receita');
    const despesas = transacoes.filter(t => t.categoria === 'despesa');

    const totalReceitasValor = receitas.reduce((acc, t) => acc + t.valor, 0);
    const totalDespesasValor = despesas.reduce((acc, t) => acc + t.valor, 0);
    const saldo = totalReceitasValor - totalDespesasValor;

    totalReceitas.textContent = formatarValor(totalReceitasValor);
    totalDespesas.textContent = formatarValor(totalDespesasValor);
    saldoFinal.textContent = formatarValor(saldo);
}

// Função para gerar gráfico de receitas e despesas
function gerarGrafico() {
    const receitas = transacoes.filter(t => t.categoria === 'receita').reduce((acc, t) => acc + t.valor, 0);
    const despesas = transacoes.filter(t => t.categoria === 'despesa').reduce((acc, t) => acc + t.valor, 0);

    const chart = new Chart(graficoCanvas, {
        type: 'pie',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                data: [receitas, despesas],
                backgroundColor: ['#2E8B57', '#e74c3c'],
            }]
        },
    });
}

// Função para adicionar uma nova transação
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const novaTransacao = {
        nome: nomeInput.value,
        categoria: categoriaSelect.value,
        data: dataInput.value,
        valor: parseFloat(valorInput.value),
    };

    transacoes.push(novaTransacao);
    salvarTransacoes();

    nomeInput.value = '';
    categoriaSelect.value = 'receita';
    dataInput.value = '';
    valorInput.value = '';
});

// Função para editar uma transação
function editarTransacao(index) {
    const transacao = transacoes[index];
    nomeInput.value = transacao.nome;
    categoriaSelect.value = transacao.categoria;
    dataInput.value = transacao.data;
    valorInput.value = transacao.valor;

    // Remover a transação para editar
    transacoes.splice(index, 1);
    salvarTransacoes();
}

// Função para excluir uma transação
function excluirTransacao(index) {
    transacoes.splice(index, 1);
    salvarTransacoes();
}

// Função para aplicar filtro de categoria e data
aplicarFiltroBtn.addEventListener('click', () => {
    const categoriaFiltrada = filtroCategoria.value;
    const dataFiltrada = filtroData.value;

    const transacoesFiltradas = transacoes.filter(t => {
        return (!categoriaFiltrada || t.categoria === categoriaFiltrada) &&
            (!dataFiltrada || t.data === dataFiltrada);
    });

    transacoesTable.innerHTML = '';
    transacoesFiltradas.forEach((transacao, index) => {
        const row = transacoesTable.insertRow();
        row.innerHTML = `
            <td>${transacao.nome}</td>
            <td>${transacao.categoria}</td>
            <td>${transacao.data}</td>
            <td>${formatarValor(transacao.valor)}</td>
            <td>
                <button class="editar" onclick="editarTransacao(${index})">Editar</button>
                <button class="excluir" onclick="excluirTransacao(${index})">Excluir</button>
            </td>
        `;
    });
});

// Função para alternar o tema claro/escuro
toggleThemeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
});

// Inicializar o app
atualizarTabela();
atualizarResumo();
gerarGrafico();
