import express, { Response } from "express";
import fs from "fs";
import path from "path";
import { UserRequest } from "./types";

const router = express.Router();
const writeFile = "../data/users.json";

router.post("/adduser", (req: UserRequest, res: Response) => {
  const newUser = req.body;
  req.users?.push(newUser);

  fs.writeFile(
    path.resolve(__dirname, writeFile),
    JSON.stringify(req.users),
    (err) => {
      if (err) console.log("Failed to write to file");
      else console.log("User Saved");
    }
  );
  res.send("Successly added user");
});
export default router;
