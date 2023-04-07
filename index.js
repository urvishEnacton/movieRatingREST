import "dotenv/config";
import express from "express";
import { connectDB, preDefinedData } from "./db/index.js";
import models from "./models/index.js";
import router from "./routers/index.js";
import axios from "axios";
import _fetch from "isomorphic-fetch";

const app = express();

const port = process.env.PORT || 3000;

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/rating", router.ratingRouter);
app.use("/user", router.userRouter);
app.use("/movie", router.movieRouter);

connectDB().then(async () => {
  await preDefinedData(models);
  app.listen(port, () => console.log(`Server is now running on port ${port}`));
});
