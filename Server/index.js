import {connectDB} from "./connectDB.js";
import { app } from "./app.js";
import { configDotenv } from "dotenv";

configDotenv();

const PORT = process.env.PORT || 3000;

await connectDB(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        })
    .catch((err) => console.log(err));