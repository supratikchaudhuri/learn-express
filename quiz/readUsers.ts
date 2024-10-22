import express, { Response } from "express";
import { UserRequest } from "./types";

const router = express.Router();

router.get("/usernames", (req: UserRequest, res: Response) => {
  let usernames = req.users?.map(function (user) {
    return { id: user.id, username: user.username };
  });
  res.send(usernames);
});

router.get("/username/:name", (req: UserRequest, res: Response) => {
  let name = req.params.name;
  let users = req.users?.filter(function (user) {
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

export default router;
