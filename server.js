const WebSocket = require("ws");
const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 7071;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const symbols = ["NIFTY", "BANKNIFTY", "GOLD", "USDINR"];
let prices = {
  NIFTY: 21600,
  BANKNIFTY: 49200,
  GOLD: 73800,
  USDINR: 83.2,
};

const randomize = (base) => +(base + (Math.random() - 0.5) * 20).toFixed(2);

wss.on("connection", (ws) => {
  console.log("📡 Client connected");

  const interval = setInterval(() => {
    symbols.forEach((symbol) => {
      prices[symbol] = randomize(prices[symbol]);
      ws.send(JSON.stringify({ type: "tick", symbol, price: prices[symbol], timestamp: Date.now() }));
    });
  }, 1000);

  ws.on("close", () => clearInterval(interval));
});

app.get("/latest-price/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  res.json({ price: prices[symbol] || 0 });
});

server.listen(PORT, () => {
  console.log(`✅ Running mock price server on http://localhost:${PORT}`);
});
