// import "dotenv/config";
// import express, {Request, Response } from "express";
// import router from "./routes/notesRoutes"; 
// import userRoutes from "./routes/userRoutes";
// import morgan from "morgan";
// import createHttpError, {isHttpError} from "http-errors";
// import session from "express-session";
// import env from "./utilities/validatesEnv";
// import MongoStore from "connect-mongo";
// import { requireAuth } from "./middleware/auth";
// import cors from 'cors';



// const app = express();

// app.use(cors({
//    origin: ['http://localhost:5173', 'https://notes-app-frontend-uhx8.onrender.com/'], // Your frontend URL
//    credentials: true,
//  }));


// app.use(morgan("dev"));

// app.use(express.json());

// app.use(session({
//     secret:env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:false,
//     cookie:{
//         maxAge:60 * 60 * 1000
//     },
//     rolling:true,
//     store:MongoStore.create({
//         mongoUrl:env.MONGO_CONNECTION_STRING
//     }),
// }));


// app.use("/api/users", userRoutes);
// app.use("/api/notes",requireAuth, router);


// app.use((req, res, next)=>{
//     next(createHttpError(404, "Wetin you dy find no dy here, No Vex!"))
// });


// app.use((error:unknown, req:Request, res: Response)=>{
//     console.error(error);
//         let errorMessage = "An unknown error occurred";
//         let statusCode = 500;
//         if(isHttpError(error)){
//             statusCode = error.status;
//             errorMessage = error.message;
//         }
//         res.status(statusCode).json({error:errorMessage});
// });


// export default app;


// app.ts
// app.ts
import express, { Request, Response} from 'express';
import morgan from 'morgan';
import session from 'express-session';
import createHttpError, { isHttpError } from 'http-errors';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import path from 'path';
import favicon from 'serve-favicon';
import router from './routes/notesRoutes';
import userRoutes from './routes/userRoutes';
import env from './utilities/validatesEnv';
import { requireAuth } from './middleware/auth';

const app = express();

app.use(cors({
   origin: ['http://localhost:5173', 'https://notes-app-frontend-uhx8.onrender.com'],
   credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

app.use(session({
   secret: env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
      maxAge: 60 * 60 * 1000,
   },
   rolling: true,
   store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
   }),
}));

// Serve the favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/api/users', userRoutes);
app.use('/api/notes', requireAuth, router);

app.get('/', (req: Request, res: Response) => {
   res.send('API is running');
});

app.use((req, res, next) => {
   next(createHttpError(404, 'Wetin you find no dy here, No Vex!'));
});

app.use((error: unknown, req: Request, res: Response) => {
   console.error(error);
   let errorMessage = 'An unknown error occurred';
   let statusCode = 500;
   if (isHttpError(error)) {
      statusCode = error.status;
      errorMessage = error.message;
   }
   res.status(statusCode).json({ error: errorMessage });
});

export default app;


