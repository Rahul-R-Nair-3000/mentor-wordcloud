import path from "path";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));