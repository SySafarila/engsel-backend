import app from "./server";
import { httpServer } from "./socketio";

const port = process.env.APP_PORT ?? 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// websocket
httpServer.listen(3030);
