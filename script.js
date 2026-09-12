const API_URL = 'https://lista-de-tarefas-3op7.onrender.com/api/tasks';

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

async function carregarTarefas() {
    try {
        const response = await fetch(API_URL);
        tarefas = await response.json(); // Salva no array a resposta do PostgreSQL
        renderizarTarefas();
        atualizarContagemItens();
        verificarEstadoVazio();
    } catch (error) {
        console.error("Erro ao buscar tarefas do servidor:", error);
    }
}

async function adicionarTarefa(texto) {
    if (texto.trim() === "") return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: texto }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.errors ? errorData.errors[0].msg : "Erro ao adicionar tarefa.");
            return;
        }

        campoTarefa.value = "";
        await carregarTarefas(); 
    } catch (error) {
        console.error("Erro ao salvar tarefa no servidor:", error);
    }
}

async function alternarStatusTarefa(id, statusAtual) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !statusAtual })
        });
        await carregarTarefas();
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
    }
}

async function deletarTarefa(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        await carregarTarefas();
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
    }
}

async function limparConcluidas() {
    try {
        await fetch(`${API_URL}/completed/all`, {
            method: 'DELETE'
        });
        await carregarTarefas();
    } catch (error) {
        console.error("Erro ao limpar concluídas:", error);
    }
}

function atualizarContagemItens() {
    const tarefasNaoConcluidas = tarefas.filter(tarefa => !tarefa.completed);
    const quantidade = tarefasNaoConcluidas.length;

    if (quantidade === 1) {
        itensRestantes.textContent = "1 item restante";
    } else {
        itensRestantes.textContent = `${quantidade} itens restantes`;
    }
}

function verificarEstadoVazio() {
    const tarefasFiltradas = filtrarTarefas(filtroAtual);
    if (tarefasFiltradas.length === 0) {
        estadoVazio.classList.remove("hidden");
    } else {
        estadoVazio.classList.add("hidden");
    }
}

function filtrarTarefas(filtro) {
    switch (filtro) {
        case "active":
            return tarefas.filter(tarefa => !tarefa.completed);
        case "completed":
            return tarefas.filter(tarefa => tarefa.completed);
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
        if (tarefa.completed) {
            itemTarefa.classList.add("concluido");
        }

        const containerCheckbox = document.createElement("label");
        containerCheckbox.classList.add("container-checkbox");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox-tarefa");
        checkbox.checked = tarefa.completed;
        checkbox.addEventListener("change", () => alternarStatusTarefa(tarefa.id, tarefa.completed));

        const marcaDeSelecao = document.createElement("span");
        marcaDeSelecao.classList.add("marca-selecao");

        containerCheckbox.appendChild(checkbox);
        containerCheckbox.appendChild(marcaDeSelecao);

        const textoTarefa = document.createElement("span");
        textoTarefa.classList.add("texto-item-tarefa");
        textoTarefa.textContent = tarefa.title;

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

botaoAdicionarTarefa.addEventListener("click", () => {
    adicionarTarefa(campoTarefa.value);
});

campoTarefa.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        adicionarTarefa(campoTarefa.value);
    }
});

botaoLimparConcluidas.addEventListener("click", limparConcluidas);

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
    verificarEstadoVazio();
}

function definirData() {
    const opcoes = { weekday: "long", month: "long", day: "numeric" };
    const hoje = new Date();
    elementoData.textContent = hoje.toLocaleDateString("pt-br", opcoes);
}

window.addEventListener("DOMContentLoaded", () => {
    carregarTarefas();
    definirData();
});