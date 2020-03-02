import SocketIO from "socket.io"
import co from "co"

module.exports = app => {

    const init = (server) => {
        const io = SocketIO(server, {
            origins: '*:*'
        })

        io.on('connection', (socket) => {
            console.log('conectado: ' + socket.id);
            app.sockets.authentication(io, socket, (error) => {
                if (error) return;

                socket.on("direct-message", app.sockets.authentication(io, socket, (error, user, message) => {
                    if (error) return;
                    app.db.models.Messages.create({
                      from_id: user.id,
                      to_id: message.to,
                      text: message.content
                    })
                    .then(directMessage => {
                        emitToUsers('direct_message', [user.id, message.to], directMessage)
                    })
                }))
            })()

            const emitToUsers = function(eventName, userIds, payload) {
                app.sockets.onlineStore.getSocketsFromUsers(userIds).forEach(socketId => {
                    console.log(socketId + ': ' + payload.text);
                    io.sockets.connected[socketId].emit(eventName, payload)
                })
            }

            socket.on("disconnect", () => {
                app.sockets.onlineStore.remove(socket.id)
                io.emit("online_users", {
                    onlineUsers: app.sockets.onlineStore.list()
                })
            })
        })
    }

    return {
        init
    }

}
