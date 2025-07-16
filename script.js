const campoTarefa = document.getElementById("campo-tarefa");
const botaoAdicionarTarefa = document.getElementById("botao-adicionar-tarefa");
const listaDeTarefas = document.getElementById("lista-de-tarefas");
const itensRestantes = document.getElementById("itens-restantes");
const botaoLimparConcluidas = document.getElementById("botao-limpar-concluidas");
const estadoVazio = document.querySelector(".estado-vazio");
const elementoData = document.getElementById("data");
const filtros = document.querySelectorAll(".filtro");

let tarefas = [];
let filtroAtual = "all";

botaoAdicionarTarefa.addEventListener("click", () => {
    adicionarTarefa(campoTarefa.value);
});

campoTarefa.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        adicionarTarefa(campoTarefa.value);
    }
});

botaoLimparConcluidas.addEventListener("click", limparConcluidas);

function adicionarTarefa(texto) {
    if (texto.trim() === "") return;

    const tarefa = {
        id: Date.now(),
        texto: texto,
        completa: false,
    };
    tarefas.push(tarefa);

    salvarTarefas();
    renderizarTarefas();
    campoTarefa.value = "";
}

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    atualizarContagemItens();
    verificarEstadoVazio();
}

function atualizarContagemItens() {
    const tarefasNaoConcluidas = tarefas.filter(tarefa => !tarefa.completa);
    const quantidade = tarefasNaoConcluidas.length;

    if (quantidade === 1) {
        itensRestantes.textContent = "1 item restante";
    } else {
        itensRestantes.textContent = `${quantidade} itens restantes`;
    }
}

function verificarEstadoVazio() {
    const tarefasFiltradas = filtrarTarefas(filtroAtual);
    if (tarefasFiltradas?.length === 0) {
        estadoVazio.classList.remove("hidden");
    } else {
        estadoVazio.classList.add("hidden");
    }
}

function filtrarTarefas(filtro) {
    switch (filtro) {
        case "active":
            return tarefas.filter(tarefa => !tarefa.completa);
        case "completed":
            return tarefas.filter(tarefa => tarefa.completa);
        default:
            return tarefas;
    }
}

function renderizarTarefas() {
    listaDeTarefas.innerHTML = "";

    const tarefasFiltradas = filtrarTarefas(filtroAtual);

    tarefasFiltradas.forEach(tarefa => {
        const itemTarefa = document.createElement("li");
        itemTarefa.classList.add("item-tarefa");
        if (tarefa.completa) {
            itemTarefa.classList.add("concluido");
        }

        const containerCheckbox = document.createElement("label");
        containerCheckbox.classList.add("container-checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox-tarefa");
        checkbox.checked = tarefa.completa;
        checkbox.addEventListener("change", () => alternarStatusTarefa(tarefa.id));

        const marcaDeSelecao = document.createElement("span");
        marcaDeSelecao.classList.add("marca-selecao");

        containerCheckbox.appendChild(checkbox);
        containerCheckbox.appendChild(marcaDeSelecao);

        const textoTarefa = document.createElement("span");
        textoTarefa.classList.add("texto-item-tarefa");
        textoTarefa.textContent = tarefa.texto;

        const botaoDeletar = document.createElement("button");
        botaoDeletar.classList.add("botao-deletar");
        botaoDeletar.innerHTML = '<i class="fas fa-times"></i>';
        botaoDeletar.addEventListener("click", () => deletarTarefa(tarefa.id));

        itemTarefa.appendChild(containerCheckbox);
        itemTarefa.appendChild(textoTarefa);
        itemTarefa.appendChild(botaoDeletar);

        listaDeTarefas.appendChild(itemTarefa);
    });
}

function limparConcluidas() {
    tarefas = tarefas.filter((tarefa) => !tarefa.completa);
    salvarTarefas();
    renderizarTarefas();
}

function alternarStatusTarefa(id) {
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            return { ...tarefa, completa: !tarefa.completa };
        }
        return tarefa;
    });
    salvarTarefas();
    renderizarTarefas();
}

function deletarTarefa(id) {
    tarefas = tarefas.filter((tarefa) => tarefa.id !== id);
    salvarTarefas();
    renderizarTarefas();
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    }
    renderizarTarefas();
}

filtros.forEach(filtro => {
    filtro.addEventListener("click", () => {
        definirFiltroAtivo(filtro.getAttribute("data-filter"));
    });
});

function definirFiltroAtivo(filtro) {
    filtroAtual = filtro;

    filtros.forEach((item) => {
        if (item.getAttribute("data-filter") === filtro) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    renderizarTarefas();
}

function definirData() {
    const opcoes = { weekday: "long", month: "long", day: "numeric" };
    const hoje = new Date();
    elementoData.textContent = hoje.toLocaleDateString("pt-br", opcoes);
}

window.addEventListener("DOMContentLoaded", () => {
    carregarTarefas();
    atualizarContagemItens();
    verificarEstadoVazio();
    definirData();
});