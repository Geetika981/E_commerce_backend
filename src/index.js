import connectDb from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
})

import { app } from "./app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log(`app connected on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection error",error);
    process.exit(1);
  });
