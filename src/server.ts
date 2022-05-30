import express, { json } from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;

import loginRoutes from "./routes/log-in";
import usersRoutes from "./routes/users";

app.use(json());
app.use(cors({
  credentials: true,
  origin: process.env.URL || "*",
}));
app.use("/log-in", loginRoutes);
app.use("/users", usersRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});