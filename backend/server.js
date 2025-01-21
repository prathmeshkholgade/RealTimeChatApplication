import "dotenv/config";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ExpressError from "./utils/ExpressError.js";
import Project from "./models/projectModel.js";
const port = process.env.PORT;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.use(async (socket, next) => {
  try {
    const cookies = socket?.handshake?.headers?.cookie;
    const isToken = cookies && cookies.split("=")[1];
    const projectId = socket.handshake.query.projectId;
    console.log("this is project id bro ", projectId);
    socket.project = await Project.findById(projectId);
    console.log("this is that project", socket.project);
    if (!projectId) {
      return next(new ExpressError(404, "project id not found"));
    }
    const token =
      isToken ||
      socket.handshake?.auth.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) {
      return next(new ExpressError(404, "Authentication error"));
    }
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    if (!decoded) {
      return next(new ExpressError(404, "Authentication faild"));
    }
    socket.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});
io.on("connection", (client) => {
  console.log("a user connected");

  client.roomId = client.project._id.toString(); // roomID

  client.join(client.roomId);

  client.on("project-message", (data) => {
    console.log(data);
    client.broadcast.to(client.roomId).emit("project-message", data);
  });

  // client.on("event", (data) => {});
  client.on("disconnect", () => {
    console.log("user disconnected");
    /* … */
  });
});

server.listen(port, () => {
  console.log(`server runing on  connected to ${port}`);
});
