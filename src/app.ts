import "dotenv/config";
import express, {Request, Response } from "express";
import router from "./routes/notesRoutes"; 
import userRoutes from "./routes/userRoutes";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./utilities/validatesEnv";
import MongoStore from "connect-mongo";
import { requireAuth } from "./middleware/auth";
import cors from 'cors';



const app = express();

app.use(cors({
   origin: 'http://localhost:5173', // Your frontend URL
   credentials: true,
 }));


app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret:env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60 * 60 * 1000
    },
    rolling:true,
    store:MongoStore.create({
        mongoUrl:env.MONGO_CONNECTION_STRING
    }),
}));



app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to match your frontend URL
  credentials: true,
}));


app.use("/api/users", userRoutes);
app.use("/api/notes",requireAuth, router);


app.use((req, res, next)=>{
    next(createHttpError(404, "Wetin you find no dy here, No Vex!"))
});


app.use((error:unknown, req:Request, res: Response)=>{
    console.error(error);
        let errorMessage = "An unknown error occurred";
        let statusCode = 500;
        if(isHttpError(error)){
            statusCode = error.status;
            errorMessage = error.message;
        }
        res.status(statusCode).json({error:errorMessage});
});


export default app;


