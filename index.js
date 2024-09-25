import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import companyRoute from './routes/company.route.js'
import jobRoute from './routes/job.route.js'
import application from './routes/application.route.js'

dotenv.config({});

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser())

const corsOptions = {
    origin:'*',
    credentials:true
}
app.use(cors(corsOptions))

//swagger configration
import swaggerUi from "swagger-ui-express";
import swaggerUser from "./swagger/swaggerUserAPI.json" assert { type: "json" };
import swaggerCompany from "./swagger/swaggerCompanyAPI.json" assert { type: "json" };
import swaggerjob from "./swagger/swaggerJobAPI.json" assert{type:"json"}
var options = {};
app.use('/api/user', swaggerUi.serveFiles(swaggerUser, options), swaggerUi.setup(swaggerUser));
app.use('/api/company', swaggerUi.serveFiles(swaggerCompany, options), swaggerUi.setup(swaggerCompany))
app.use('/api/job', swaggerUi.serveFiles(swaggerjob, options), swaggerUi.setup(swaggerjob))
//apis

app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",application)


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server Running at ${PORT}`);
    
})