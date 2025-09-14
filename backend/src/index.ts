import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;

interface User {
    socket: WebSocket;
    room: string;
}


let allSockets: User[] = [];
let rooms: Record<string, WebSocket[]> = {};

wss.on("connection", (socket) => {
    userCount++;
    console.log(` User connected | total: ${userCount}`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "createRoom") {
            const roomId = parsedMessage.payload.roomId;
            if (rooms[roomId]) {
                socket.send(`Room ${roomId} already exists!`);
            } else {
                rooms[roomId] = [];
                socket.send(`Room ${roomId} created `);
                console.log(` Room created: ${roomId}`);
            }
        }

        
        if (parsedMessage.type === "join") {
            const roomId = parsedMessage.payload.roomId;

            if (!rooms[roomId]) {
                socket.send(`Room ${roomId} does not exist!`);
                return;
            }

            rooms[roomId].push(socket);
            allSockets.push({ socket, room: roomId });

            socket.send(`You joined room ${roomId}`);
            console.log(`👤 User joined room: ${roomId}`);
        }

        
        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find((x) => x.socket === socket);
            if (!currentUser) return;

            const roomId = (currentUser.room);
            //@ts-ignore
            rooms[roomId].forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(parsedMessage.payload.message);
                }
            });

            console.log(`💬 Message in room ${roomId}: ${parsedMessage.payload.message}`);
        }
    });

    socket.on("close", () => {
        userCount--;
        console.log(`User disconnected | total: ${userCount}`);
        // cleanup
        allSockets = allSockets.filter((u) => u.socket !== socket);
        for (const room in rooms) {
            //@ts-ignore
            rooms[room] = rooms[room].filter((s) => s !== socket);
        }
    });
});
