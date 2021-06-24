// NPM Module imports
import express from "express"; //To use express framework
import morgan from "morgan"; //To print API requests
import helmet from "helmet"; //Helmet helps you secure your Express apps by setting various HTTP headers.
import cors from "cors"; //To allow different origins
import path from "path"; //To join paths

// API module imports
import personRoutes from "./routes/person.routes";
import courseRoutes from "./routes/course.routes";
import logicSequenceRoutes from './routes/logic-sequence.routes';
import activityRoutes from './routes/activity.routes';
import dataRoutes from './routes/data.routes';
import authRoutes from './routes/auth.routes';
import studentActivityRoutes from './routes/student-activity.routes';

// Initial setup
import { createAdmin } from './libs/initialSetup';

// App declaration
const app = express();

// Initial setup for the server, create admin user
createAdmin();

// SETTINGS

// Set the port
app.set("port", process.env.PORT || 4000);

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
app.use("/api/auth", authRoutes); //Route to user administration
app.use("/api/person", personRoutes); //Route to user administration
app.use("/api/course", courseRoutes); //Route to course administration
app.use('/api/activity', activityRoutes); //Route to activities administration
app.use('/api/logic-sequence', logicSequenceRoutes); //Route to logic sequence administration
app.use('/api/data', dataRoutes); //Route to data uploading administration
app.use('/api/student-activity', studentActivityRoutes); //Route to student activity entity administration

/**
 * express static
 * Se configura la carpeta de los archivos estaticos de la aplicacion
 */
app.use(express.static(path.join(__dirname, "../static_content"))); //route where all user images are stored

module.exports = app;
