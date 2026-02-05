const formulario = document.getElementById('form');

let listaDeVagas = JSON.parse(localStorage.getItem('banco_vagas')) || [];


class Vaga {
    constructor(area, cargo, jornada, tipo, data, salario, requisitos) {
        this.area = area;
        this.cargo = cargo;
        this.jornada = jornada;
        this.tipo = tipo;
        this.data = data;
        this.salario = salario;
        this.requisitos = requisitos;
        this.id = Date.now();
        this.status = "Aberta";
    }
}

// Salva no LocalStorage
function salvarNoLocal() {
    localStorage.setItem('banco_vagas', JSON.stringify(listaDeVagas));
}


if (formulario) {
    formulario.addEventListener('submit', function (event) {
        event.preventDefault();

        const dados = new FormData(formulario);
        const valores = Object.fromEntries(dados.entries());

        const novaVaga = new Vaga(
            valores.area,
            valores.cargo,
            valores.jornada,
            valores.tipo,
            valores.data,
            valores.salario,
            valores.requisitos
        );

        listaDeVagas.push(novaVaga);
        salvarNoLocal();

        alert("Vaga cadastrada com sucesso!");
        window.location.href = "vervagas.html"; // Redireciona para a lista
    });
}

// Função para criar a linha na tabela
function novasVagas(vaga) {



    if (!tabelaCorpo) return;

    const tr = document.createElement('tr');
    tr.setAttribute('data-id', vaga.id);

    tr.innerHTML = `
        <td>
            <h2>${vaga.cargo}</h2><br>
            <h3>${vaga.tipo} • SP</h3>
        </td>
        <td>${vaga.area}</td>
        <td>0 candidatos</td> 
        <td>
            <div class="status status-aberta">Aberta</div>
        </td>
        <td class="acoes">
            <a title="Excluir" onclick="removerVaga(${vaga.id})" style="cursor:pointer">
                <img src="https://cdn-icons-png.flaticon.com/512/5675/5675840.png" alt="lixeira" style="width:20px">
            </a>
            <a href="vaga.html" title="Visualizar/Outras ações">ℹ️</a>
            <a class="btn-ver-candidatos" href="lista.html" title="Ver lista de candidatos">Ver Candidatos</a>
        </td>
    `;
    tabelaCorpo.appendChild(tr);
}

function novasVagasEditar(vaga) {

    const tabelaCorpo = document.getElementById('vagaeditar');
    if (!tabelaCorpo) return;

    const tr = document.createElement('tr');
    tr.setAttribute('data-id', vaga.id);
    tr.style.cursor = 'pointer';

    tr.innerHTML = `
        <td>
            <h2>${vaga.cargo}</h2><br>
            <h3>${vaga.tipo} • SP</h3>
        </td>
        <td>${vaga.area}</td>
        <td>${vaga.candidatos || 0} candidatos</td> 
        <td>
            <div class="status status-${vaga.status.toLowerCase()}">${vaga.status}</div>
        </td>
    `;

    // Evento para redirecionar ou abrir um modal de edição
    tr.addEventListener('click', () => {
        window.location.href = `editar-formulario.html?id=${vaga.id}`;
    });

    tabelaCorpo.appendChild(tr);
}

// Função para remover vaga
window.removerVaga = function (id) {
    if (confirm("Deseja excluir esta vaga?")) {
        listaDeVagas = listaDeVagas.filter(v => v.id !== id);
        salvarNoLocal();
        window.location.reload();
    }
}

// Renderiza as vagas ao carregar a página de gerenciamento
function renderizarTabelas() {
    const tabelaGerenciar = document.getElementById('corpo-tabela');
    const tabelaEditar = document.getElementById('vagaeditar');

    // 1. Lógica para a página de GERENCIAR 
    
    if (tabelaGerenciar) {
        if (listaDeVagas.length === 0) {
            tabelaGerenciar.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhuma vaga cadastrada.</td></tr>';
        } else {
            tabelaGerenciar.innerHTML = ''; // Limpa antes de renderizar
            listaDeVagas.forEach(vaga => novasVagas(vaga));
        }
    }

    // 2. Lógica para a página de EDITAR
    if (tabelaEditar) {
        if (listaDeVagas.length === 0) {
            tabelaEditar.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nenhuma vaga para editar.</td></tr>';
        } else {
            tabelaEditar.innerHTML = ''; // Limpa antes de renderizar
            listaDeVagas.forEach(vaga => novasVagasEditar(vaga));
        }
    }
}

renderizarTabelas();

