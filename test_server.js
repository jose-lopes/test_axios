const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = 7001;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.get("/download", async (req, res) => {
  console.log("incoming request", req.url);
  res.set("Content-Type", "audio/wav");
  for (let i = 0; i < 20 * 1024; i++) {
    const buf = crypto.randomBytes(1024);
    // add some latency to replicate external url
    //  (necessary to replicate the issue)
    await sleep(1);
    res.write(buf);
  }
  res.end();
  console.log("incoming request", req.url, "end");
});

app.post("/upload", (req, res, next) => {
  console.log("incoming request", req.url);
  req.on("data", () => {});
  req.on("end", () => {
    console.log("incoming request", req.url, "end");
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
