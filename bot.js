import express from "express";
import { createClient } from "bedrock-protocol";

// --------------------
// Cấu hình server Minecraft
// --------------------
const SERVER_IP = "103.139.154.10";
const SERVER_PORT = 30065;
const BOT_NAME = "AFK_Bot";

// --------------------
// HTTP server để Render & UptimeRobot ping
// --------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot AFK Minecraft is alive!"));

app.listen(PORT, () => console.log(`HTTP server listening on port ${PORT}`));

// --------------------
// Hàm khởi động bot với reconnect
// --------------------
function startBot() {
  console.log(`[${new Date().toLocaleTimeString()}] Đang kết nối bot...`);
  
  const bot = createClient({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: BOT_NAME,
    offline: true,
  });

  // Khi bot spawn vào server
  bot.on("spawn", () => {
    console.log(`[${new Date().toLocaleTimeString()}] Bot đã spawn vào server!`);
  });

  // Khi bot bị disconnect
  bot.on("end", (reason) => {
    console.log(`[${new Date().toLocaleTimeString()}] Bot bị disconnect: ${reason}`);
    console.log("Đang thử reconnect sau 5 giây...");
    setTimeout(startBot, 5000);
  });

  // Khi xảy ra lỗi
  bot.on("error", (err) => {
    console.log(`[${new Date().toLocaleTimeString()}] Lỗi: ${err}`);
  });

  // Một số server có thể kick nếu bot idle → gửi lệnh di chuyển nhẹ
  setInterval(() => {
    try {
      bot.queue("move", { x: 0, y: 0, z: 0 });
    } catch (e) {
      // Không sao nếu bot chưa spawn
    }
  }, 60000);
}

// Bắt đầu bot lần đầu
startBot();
