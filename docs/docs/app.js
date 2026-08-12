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

  let mensagemTipo, mensagemTexto;
  if (precoUnitario1Base < precoUnitario2Base) {
    mensagemTipo = "success";
    mensagemTexto = "✅ Produto 1 tem melhor custo-benefício.";
  } else if (precoUnitario2Base < precoUnitario1Base) {
    mensagemTipo = "success";
    mensagemTexto = "✅ Produto 2 tem melhor custo-benefício.";
  } else {
    mensagemTipo = "info";
    mensagemTexto = "⚖️ Ambos os produtos têm o mesmo custo por unidade.";
  }

  resultado.hidden = false;
  resultado.innerHTML = `
    <h2>📊 Resultados da Comparação:</h2>
    <div class="metricas">
      <div class="metrica">
        <div class="rotulo">Produto 1</div>
        <div class="valor">${formatarReais(precoUnitario1Exibicao)} por ${sufixo}</div>
      </div>
      <div class="metrica">
        <div class="rotulo">Produto 2</div>
        <div class="valor">${formatarReais(precoUnitario2Exibicao)} por ${sufixo}</div>
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
