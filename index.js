#!/usr/bin/env node

const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "client/build")));

// Alle forespørgelser, som ikke er blevet brugt ovenover, bliver sendt til React.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveren åbnede på porten: ${port}`);
});
