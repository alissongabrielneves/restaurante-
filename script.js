const API_URL = "https://script.google.com/macros/s/AKfycbxfTKdfrzOyGyFslvjqbKzmxkqmbpkw1Ym65P4RIgN19Gq7RMZPTHvLBjE7u_n9CYir/exec";

let totalComanda = 0;

// CARREGA COMANDAS E PRODUTOS
window.onload = function () {

    carregarComandas();

    carregarProdutos();
};

// COMANDAS 001 A 020
function carregarComandas() {

    const select = document.getElementById("comanda");

    if (!select) return;

    select.innerHTML = "";

    for (let i = 1; i <= 20; i++) {

        const option = document.createElement("option");

        option.value = String(i).padStart(3, "0");
        option.textContent = String(i).padStart(3, "0");

        select.appendChild(option);
    }
}

// PRODUTOS DA PLANILHA
async function carregarProdutos() {

    try {

        const resposta =
            await fetch(`${API_URL}?acao=produtos`);

        const produtos =
            await resposta.json();

        const select =
            document.getElementById("bebida");

        if (!select) return;

        select.innerHTML = "";

        produtos.forEach(produto => {

            // ignora cabeçalho
            if (
                produto.produto === "Produto" ||
                !produto.produto
            ) return;

            const option =
                document.createElement("option");

            option.value =
                `${produto.produto}|${produto.preco}`;

            option.textContent =
                `${produto.produto} - R$ ${produto.preco}`;

            select.appendChild(option);
        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar produtos.");
    }
}

// ATUALIZA TELA
function atualizarTela(produto, valor) {

    const itens =
        document.getElementById("itens");

    itens.innerHTML += `
        <div class="item">
            ${produto} - R$ ${valor.toFixed(2)}
        </div>
    `;

    totalComanda += valor;

    document.getElementById("total").innerHTML =
        `Total: R$ ${totalComanda.toFixed(2)}`;
}

// SALVAR
async function salvar(comanda, produto, quantidade, valor) {

    try {

        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                comanda,
                produto,
                quantidade,
                valor
            })
        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao salvar.");
    }
}

// PRATO POR QUILO
async function adicionarPrato() {

    const comanda =
        document.getElementById("comanda").value;

    const peso =
        Number(document.getElementById("peso").value);

    const precoKg =
        Number(document.getElementById("precoKg").value);

    if (!peso) {

        alert("Informe o peso.");

        return;
    }

    const valor =
        peso * precoKg;

    const descricao =
        `Prato ${peso.toFixed(3)}kg`;

    await salvar(
        comanda,
        descricao,
        peso,
        valor
    );

    atualizarTela(
        descricao,
        valor
    );

    document.getElementById("peso").value = "";
}

// PRODUTOS/BEBIDAS
async function adicionarBebida() {

    const comanda =
        document.getElementById("comanda").value;

    const produtoSelecionado =
        document.getElementById("bebida").value;

    const quantidade =
        Number(
            document.getElementById(
                "quantidadeBebida"
            ).value
        );

    if (!produtoSelecionado) {

        alert("Nenhum produto carregado.");

        return;
    }

    const partes =
        produtoSelecionado.split("|");

    const produto =
        partes[0];

    const precoUnitario =
        Number(partes[1]);

    const valor =
        precoUnitario * quantidade;

    await salvar(
        comanda,
        produto,
        quantidade,
        valor
    );

    atualizarTela(
        `${produto} x${quantidade}`,
        valor
    );

    document.getElementById(
        "quantidadeBebida"
    ).value = 1;
}
