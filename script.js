const API_URL = "https://script.google.com/macros/s/AKfycbxfTKdfrzOyGyFslvjqbKzmxkqmbpkw1Ym65P4RIgN19Gq7RMZPTHvLBjE7u_n9CYir/exec";

let totalComanda = 0;

window.onload = function () {

    carregarComandas();

    carregarProdutos();
};

// COMANDAS 001 A 020
function carregarComandas() {

    const select = document.getElementById("comanda");

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

        select.innerHTML = "";

        produtos.forEach(produto => {

            if (
                produto.produto === "Produto" ||
                !produto.produto
            ) return;

            const option =
                document.createElement("option");

            option.value =
                `${produto.produto}|${produto.preco}`;

            option.textContent =
                `${produto.produto} - R$ ${Number(produto.preco).toFixed(2)}`;

            select.appendChild(option);
        });

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar produtos.");
    }
}

// MOSTRA ITEM NA TELA
function atualizarTela(produto, valor) {

    const itens =
        document.getElementById("itens");

    itens.innerHTML += `
        <div>
            ${produto} - R$ ${valor.toFixed(2)}
        </div>
    `;

    totalComanda += valor;

    document.getElementById("total").innerHTML =
        `Total: R$ ${totalComanda.toFixed(2)}`;
}

// SALVA NA PLANILHA
async function salvar(comanda, produto, quantidade, valor) {

    await fetch(API_URL, {

        method: "POST",

        body: JSON.stringify({
            comanda,
            produto,
            quantidade,
            valor
        })
    });
}

// PRATO POR QUILO (VALOR DIRETO)
async function adicionarPrato() {

    const comanda =
        document.getElementById("comanda").value;

    const valor =
        Number(
            document.getElementById("valorPrato").value
        );

    if (!valor) {

        alert("Informe o valor do prato.");

        return;
    }

    await salvar(
        comanda,
        "Prato por Quilo",
        1,
        valor
    );

    atualizarTela(
        "Prato por Quilo",
        valor
    );

    document.getElementById(
        "valorPrato"
    ).value = "";
}

// BEBIDAS
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

        alert("Selecione um produto.");

        return;
    }

    const partes =
        produtoSelecionado.split("|");

    const produto =
        partes[0];

    const preco =
        Number(partes[1]);

    const valor =
        preco * quantidade;

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
