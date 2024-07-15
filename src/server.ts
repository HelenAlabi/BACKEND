import app from "./app";
import mongoose from "mongoose";
import env from "./utilities/validatesEnv";


const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose Connected");
        app.listen(port, () => {
            console.log(`listening to http://localhost:${port}`);
        });
    }).catch(console.error);
