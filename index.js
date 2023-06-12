const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { apiRouter } = require("./routes/api.routes");
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/weather", apiRouter);

app.get("/", (req, res) => {
  res.send("Welcome...");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB is connected to DB");
  } catch (err) {
    console.log(err);
  }
  console.log("Server is running at port 8080");
});
