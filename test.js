"use strict";

const _ = require("lodash");
const axios = require("axios");
const express = require("express");
const app = express();
const PORT = 7000;

const optsGetFile = {
  method: "get",
  url: "http://localhost:7001/download",
  responseType: "stream",
};
const optsUploadFile = {
  method: "post",
  url: "http://localhost:7001/upload",
};

app.post("/record", (req, res) => {
  console.log("incoming request", req.url);

  axios(optsGetFile)
    .then(({ headers, data }) => {
      return axios(_.assign(optsUploadFile, { data, headers }));
    })
    .then(() => {
      console.log("OK");
    })
    .catch((error) => {
      console.error("ERROR:", error.message);
    });
  res.sendStatus(202);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
