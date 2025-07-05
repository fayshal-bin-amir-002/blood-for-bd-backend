import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundRoute";

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use(notFoundRoute);

app.get("/", (req: Request, res: Response) => {
  res.send({
    status: "success",
    message: "Blood For BD server is running...",
  });
});

export default app;
