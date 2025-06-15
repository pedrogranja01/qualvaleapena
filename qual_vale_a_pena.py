import streamlit as st

st.set_page_config(page_title="Comparador de Preços")

st.title("🔍 Comparador de Preços")
st.markdown("Preencha as informações abaixo para comparar o custo-benefício entre dois produtos.")

unidades = {
    "mg": 0.001,
    "g": 1,
    "kg": 1000,
    "mL": 1,
    "L": 1000
}

# Inicializa os valores na sessão
if "p1" not in st.session_state:
    st.session_state.p1 = 0.0
    st.session_state.q1 = 0.0
    st.session_state.u1 = "g"
    st.session_state.p2 = 0.0
    st.session_state.q2 = 0.0
    st.session_state.u2 = "g"

# Cria duas colunas para os produtos
col1, col2 = st.columns(2)

with col1:
    st.subheader("Produto 1")
    preco1 = st.number_input("Preço (R$)", min_value=0.0, format="%.2f", key="p1", placeholder="Preço (R$)")
    unidade1 = st.selectbox("Unidade", options=unidades.keys(), key="u1")
    quantidade1 = st.number_input("Qtd", min_value=0.0, format="%.2f", key="q1", placeholder="Quantidade")

with col2:
    st.subheader("Produto 2")
    preco2 = st.number_input("Preço (R$)", min_value=0.0, format="%.2f", key="p2", placeholder="Preço (R$)")
    unidade2 = st.selectbox("Unidade", options=unidades.keys(), key="u2")
    quantidade2 = st.number_input("Qtd", min_value=0.0, format="%.2f", key="q2", placeholder="Quantidade")

st.markdown("---")

col_btn1, col_btn2 = st.columns(2)
with col_btn1:
    comparar = st.button("Comparar")
with col_btn2:
    limpar = st.button("Limpar")

if limpar:
    st.session_state.p1 = 0.0
    st.session_state.q1 = 0.0
    st.session_state.u1 = "g"
    st.session_state.p2 = 0.0
    st.session_state.q2 = 0.0
    st.session_state.u2 = "g"
    st.experimental_rerun()

if comparar:
    if quantidade1 == 0 or quantidade2 == 0:
        st.error("A quantidade dos produtos deve ser maior que zero.")
    else:
        # Determina se estamos comparando massa ou volume
        grupo_massa = {"mg", "g", "kg"}
        grupo_volume = {"mL", "L"}

        if unidade1 in grupo_massa and unidade2 in grupo_massa:
            unidade_maior = "kg" if "kg" in [unidade1, unidade2] else "g"
            fator_exibicao = unidades[unidade_maior]
            sufixo = unidade_maior
        elif unidade1 in grupo_volume and unidade2 in grupo_volume:
            unidade_maior = "L" if "L" in [unidade1, unidade2] else "mL"
            fator_exibicao = unidades[unidade_maior]
            sufixo = unidade_maior
        else:
            # Caso misture massa e volume (incomum), exibe por unidade base (g/mL)
            fator_exibicao = 1
            sufixo = "g/mL"

        # Converte para unidade base
        qtd_base1 = quantidade1 * unidades[unidade1]
        qtd_base2 = quantidade2 * unidades[unidade2]

        preco_unitario1_base = preco1 / qtd_base1
        preco_unitario2_base = preco2 / qtd_base2

        preco_unitario1_exibicao = preco_unitario1_base * fator_exibicao
        preco_unitario2_exibicao = preco_unitario2_base * fator_exibicao

        st.subheader("📊 Resultados da Comparação:")
        col1, col2 = st.columns(2)

        with col1:
            st.metric("Produto 1", f"R$ {f'{preco_unitario1_exibicao:.4f}'.replace('.', ',')} por {sufixo}")
        with col2:
            st.metric("Produto 2", f"R$ {f'{preco_unitario2_exibicao:.4f}'.replace('.', ',')} por {sufixo}")

        if preco_unitario1_base < preco_unitario2_base:
            st.success("✅ **Produto 1** tem melhor custo-benefício.")
        elif preco_unitario2_base < preco_unitario1_base:
            st.success("✅ **Produto 2** tem melhor custo-benefício.")
        else:
            st.info("⚖️ Ambos os produtos têm o mesmo custo por unidade.")

        # Mostra imagem no final, após comparação
        st.markdown("---")
        st.image("pic.jpeg", width=150, layout="centered")
