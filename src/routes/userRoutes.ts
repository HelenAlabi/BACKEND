import express from  "express";
import * as UserController from "../controllers/usersController";
import { requireAuth } from "../middleware/auth";


const userRouter = express.Router();


userRouter.get("/", requireAuth, UserController.getAuthenticatedUser);
userRouter.post("/signUp", UserController.signUp);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", UserController.logout);



export default userRouter;
