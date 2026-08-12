const UNIDADES = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  mL: 1,
  L: 1000,
};

const GRUPO_MASSA = new Set(["mg", "g", "kg"]);
const GRUPO_VOLUME = new Set(["mL", "L"]);

const form = document.getElementById("form");
const resultado = document.getElementById("resultado");

function formatarReais(valor) {
  return `R$ ${valor.toFixed(4).replace(".", ",")}`;
}

function formatarPercentual(valor) {
  return `${valor.toFixed(1).replace(".", ",")}%`;
}

function comparar(evento) {
  evento.preventDefault();

  const preco1 = parseFloat(document.getElementById("p1").value) || 0;
  const unidade1 = document.getElementById("u1").value;
  const quantidade1 = parseFloat(document.getElementById("q1").value) || 0;

  const preco2 = parseFloat(document.getElementById("p2").value) || 0;
  const unidade2 = document.getElementById("u2").value;
  const quantidade2 = parseFloat(document.getElementById("q2").value) || 0;

  if (quantidade1 === 0 || quantidade2 === 0) {
    mostrarMensagem("error", "A quantidade dos produtos deve ser maior que zero.");
    return;
  }

  let unidadeMaior, fatorExibicao, sufixo;
  if (GRUPO_MASSA.has(unidade1) && GRUPO_MASSA.has(unidade2)) {
    unidadeMaior = [unidade1, unidade2].includes("kg") ? "kg" : "g";
    fatorExibicao = UNIDADES[unidadeMaior];
    sufixo = unidadeMaior;
  } else if (GRUPO_VOLUME.has(unidade1) && GRUPO_VOLUME.has(unidade2)) {
    unidadeMaior = [unidade1, unidade2].includes("L") ? "L" : "mL";
    fatorExibicao = UNIDADES[unidadeMaior];
    sufixo = unidadeMaior;
  } else {
    fatorExibicao = 1;
    sufixo = "g/mL";
  }

  const qtdBase1 = quantidade1 * UNIDADES[unidade1];
  const qtdBase2 = quantidade2 * UNIDADES[unidade2];

  const precoUnitario1Base = preco1 / qtdBase1;
  const precoUnitario2Base = preco2 / qtdBase2;

  const precoUnitario1Exibicao = precoUnitario1Base * fatorExibicao;
  const precoUnitario2Exibicao = precoUnitario2Base * fatorExibicao;

  const maiorBase = Math.max(precoUnitario1Base, precoUnitario2Base);
  const menorBase = Math.min(precoUnitario1Base, precoUnitario2Base);
  const percentual = maiorBase > 0 ? ((maiorBase - menorBase) / maiorBase) * 100 : 0;
  const largura1 = maiorBase > 0 ? (precoUnitario1Base / maiorBase) * 100 : 0;
  const largura2 = maiorBase > 0 ? (precoUnitario2Base / maiorBase) * 100 : 0;

  let vencedor = 0;
  if (precoUnitario1Base < precoUnitario2Base) vencedor = 1;
  else if (precoUnitario2Base < precoUnitario1Base) vencedor = 2;

  let mensagemTipo, mensagemTexto;
  if (vencedor === 1) {
    mensagemTipo = "success";
    mensagemTexto = `✅ Produto 1 é ${formatarPercentual(percentual)} mais barato que o Produto 2.`;
  } else if (vencedor === 2) {
    mensagemTipo = "success";
    mensagemTexto = `✅ Produto 2 é ${formatarPercentual(percentual)} mais barato que o Produto 1.`;
  } else {
    mensagemTipo = "info";
    mensagemTexto = "⚖️ Ambos os produtos têm o mesmo custo por unidade.";
  }

  resultado.hidden = false;
  resultado.innerHTML = `
    <h2>📊 Resultado da Comparação</h2>
    <div class="comparacao">
      <div class="produto-resultado ${vencedor === 1 ? "vencedor" : ""}">
        ${vencedor === 1 ? '<span class="badge">Melhor preço</span>' : ""}
        <div class="rotulo">Produto 1</div>
        <div class="valor">${formatarReais(precoUnitario1Exibicao)}<span class="unidade"> / ${sufixo}</span></div>
        <div class="barra"><div class="barra-fill${vencedor === 1 ? " ganha" : ""}" style="width:${largura1}%"></div></div>
      </div>
      <div class="produto-resultado ${vencedor === 2 ? "vencedor" : ""}">
        ${vencedor === 2 ? '<span class="badge">Melhor preço</span>' : ""}
        <div class="rotulo">Produto 2</div>
        <div class="valor">${formatarReais(precoUnitario2Exibicao)}<span class="unidade"> / ${sufixo}</span></div>
        <div class="barra"><div class="barra-fill${vencedor === 2 ? " ganha" : ""}" style="width:${largura2}%"></div></div>
      </div>
    </div>
    <div class="msg ${mensagemTipo}">${mensagemTexto}</div>
  `;
}

function limpar() {
  form.reset();
  resultado.hidden = true;
  resultado.innerHTML = "";
}

form.addEventListener("submit", comparar);
document.getElementById("limpar").addEventListener("click", limpar);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
