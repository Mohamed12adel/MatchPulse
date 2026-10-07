import express from "express";
import http from "http";
import { matchesRouter } from "./routes/matches.routes.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.routes.js";

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST;

const app = express();
const server = http.createServer(app);

const { broadcastMatchCreated, broadcastCommentary } =
  attachWebSocketServer(server);

app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

app.use(express.json());
app.use(express.urlencoded());

app.use(securityMiddleware());

app.use("/matches", matchesRouter);
app.use("/matches/:id/commentary", commentaryRouter);

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`server is running on ${baseUrl}`);
  console.log(
    `webSocket server is running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
