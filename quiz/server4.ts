import cors from "cors";
import express, { NextFunction, Response } from "express";
import fs from "fs";
import path from "path";
import readUsers from "./readUsers";
import { User, UserRequest } from "./types";
import writeUsers from "./writeUsers";

const app = express();
const port = 8000;
const dataFile = "../data/users.json";

let users: User[];

const addMsgToRequest = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.json({
      error: { message: "users not found", status: 404 },
    });
  }
};

app.use(cors({ origin: "http://localhost:3000" }));
app.use(addMsgToRequest);
app.use("/read", readUsers);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/write", writeUsers);

fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log("reading file ...");
  if (err) throw err;
  users = JSON.parse(data.toString());
  console.log("finished reading file");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
