// NPM Module imports
import express from "express"; //To use express framework
import morgan from "morgan"; //To print API requests
import helmet from "helmet"; //Helmet helps you secure your Express apps by setting various HTTP headers.
import cors from "cors"; //To allow different origins
import path from "path"; //To join paths

// API module imports
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";

// App declaration
const app = express();

// SETTINGS

// Set the port
app.set("port", process.env.PORT || 3000);

//Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Relacionado con el bodyparser de express

/**
 * Routes
 *
 * Se configuran las rutas de la API
 */
app.use("/api/user", userRoutes); //Route to user administration
app.use("/api/course", courseRoutes); //Route to course administration

/**
 * express static
 * Se configura la carpeta de los archivos estaticos de la aplicacion
 */
app.use(express.static(path.join(__dirname, "static"))); //route where all user images are stored

module.exports = app;
