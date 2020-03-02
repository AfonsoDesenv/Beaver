import jwt from "jsonwebtoken"

module.exports = app => {

    const authentication = function(io, socket, next) {
        return function(payload) {
            let token = socket.handshake.query.token.replace(/^JWT\s/, '')
            tokenVerify(token)
                .then(decoded => {
                    console.log(socket.id + ', ' + decoded.id)
                    app.sockets.onlineStore.add(socket.id, decoded.id)
                    emitAuthorized(socket)
                    emitOnlineUsers(io)
                    next(null, decoded, payload)
                })
                .catch(error => {
                    console.log(error);
                    app.sockets.onlineStore.remove(socket.id)
                    emitAuthorized(socket, error)
                    emitOnlineUsers(io)
                    next(error)
                })
        }
    }

    const tokenVerify = function(token) {
        return new Promise(function(resolve, reject) {
            jwt.verify(token, app.libs.config.jwtSecret, function(error, decoded) {
                if (error) {
                    reject(error)
                } else {
                    resolve(decoded)
                }
            })
        })
    }

    const emitAuthorized = function(socket, error) {
        socket.emit("authorized", {
            success: !error,
            error
        })
    }

    const emitOnlineUsers = function(io) {
        io.emit("online_users", {
            onlineUsers: app.sockets.onlineStore.list()
        })
    }

    return authentication
}
