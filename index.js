require("dotenv").config();

const app = require("express")();
const bodyParser = require("express").json;

const TOKEN = "emicamimicha";
const port = process.env.PORT || 8080;
const routes = require("./index.routes");

function authCheck(req, res, next) {
  if (req.headers.token === TOKEN) {
    return next();
  }
  res.status(401).send({ detail: "Unauthorized 💩" });
}

app.use(bodyParser());
app.use(authCheck, routes);

app.listen(port, () => console.log(`Server on port http://localhost:${port}`));
