export const notificationSocketHandler = (io) => {
    io.on("connection", (socket) => {
      console.log("🔔 Notification socket connected:", socket.id);
  
      socket.on("join", (userId) => {
        socket.join(userId); // join user's private room
        console.log(`👤 User ${userId} joined notification room`);
      });
    });
  };
  
  