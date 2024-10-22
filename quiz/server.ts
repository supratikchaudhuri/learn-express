import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface UserRequest extends Request {
  users?: User[];
}

const app = express();
const port = 8000;
const dataFile = "../data/users.json";

let users: User[];

fs.readFile(path.resolve(__dirname, dataFile), (err, data) => {
  console.log("reading file.");
  if (err) throw err;
  users = JSON.parse(data.toString());
  console.log("finished reading file.");
});

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/read/usernames", addMsgToRequest);

app.get("/read/usernames", (req: UserRequest, res: Response) => {
  let usernames = req.users?.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

app.use("/read/username", addMsgToRequest);
app.use("/write/adduser", addMsgToRequest);

app.get("/read/username/:name", (req: UserRequest, res: Response) => {
  const name = req.params.name;
  const users = req.users?.filter(function (user) {
    return user.username === name;
  });

  console.log(users);

  if (users?.length === 0) {
    res.send({
      error: { message: `${name} not found`, status: 404 },
    });
  } else {
    res.send(users);
  }
});

app.post("/write/adduser", (req: UserRequest, res: Response) => {
  const newUser = req.body as User;
  users.push(newUser);

  fs.writeFile(
    path.resolve(__dirname, dataFile),
    JSON.stringify(users),
    (err) => {
      if (err) console.log("Failed to write");
      else console.log("User Saved");
    }
  );

  res.send("Successfully added user");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
