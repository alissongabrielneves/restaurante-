const API_URL = "https://script.google.com/macros/s/AKfycbxfTKdfrzOyGyFslvjqbKzmxkqmbpkw1Ym65P4RIgN19Gq7RMZPTHvLBjE7u_n9CYir/exec";

window.onload = function () {

    const select = document.getElementById("comandaCaixa");

    for (let i = 1; i <= 20; i++) {

        const option = document.createElement("option");

        option.value = String(i).padStart(3, "0");
        option.textContent = String(i).padStart(3, "0");

        select.appendChild(option);
    }
}

async function buscarComanda() {

    const comanda =
        document.getElementById("comandaCaixa").value;

    const resposta =
        await fetch(`${API_URL}?acao=buscar&comanda=${comanda}`);

    const dados =
        await resposta.json();

    let html = "";

    if (dados.itens.length === 0) {

        html = "<p>Nenhum item encontrado.</p>";

    } else {

        dados.itens.forEach(item => {

            html += `
            <p>
                ${item.produto}
                -
                ${item.quantidade}
                -
                R$ ${Number(item.valor).toFixed(2)}
            </p>
            `;
        });
    }

    document.getElementById("resultado").innerHTML = html;

    document.getElementById("total").innerHTML =
        `Total: R$ ${dados.total.toFixed(2)}`;
}
async function removerItem(linha){

    const confirmar =
        confirm("Remover este item?");

    if(!confirmar) return;

    await fetch(
        `${API_URL}?acao=remover&linha=${linha}`
    );

    alert("Item removido!");

    buscarComanda();
}
async function finalizarVenda() {

    const comanda =
        document.getElementById("comandaCaixa").value;

    const confirmar =
        confirm(`Finalizar a comanda ${comanda}?`);

    if (!confirmar) return;

    await fetch(
        `${API_URL}?acao=finalizar&comanda=${comanda}`
    );

    alert("Venda finalizada com sucesso!");

    document.getElementById("resultado").innerHTML =
        "<p>Comanda liberada.</p>";

    document.getElementById("total").innerHTML =
        "Total: R$ 0,00";
}