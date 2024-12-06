import express from "./server";
import { httpServer as socketIo } from "./socketio";

const port = process.env.APP_PORT ?? 3000;

express.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// websocket
socketIo.listen(3030);
