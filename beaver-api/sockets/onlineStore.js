module.exports = (app) => {

  const onlineUsers = []

  const add = (socketId, id) => {
    let foundIndex = onlineUsers.findIndex(onlineUser => onlineUser.socketId === socketId && onlineUser.id === id)
    if (foundIndex === -1) {
      onlineUsers.push({
        socketId,
        id
      })
    }
  }

  const remove = (socketId) => {
    let foundIndex = onlineUsers.findIndex(onlineUser => onlineUser.socketId === socketId)
    onlineUsers.splice(foundIndex, 1)
  }

  const list = () => {
    return onlineUsers.map(user => {
      return {
        id: user.id
      }
    })
  }

  const getSocketsFromUsers = (userIds) => {
    return onlineUsers.filter(onlineUser => {
        let found = userIds.find(userId => userId === onlineUser.id)
        if (found) {
          return true
        }
        return false
      })
      .map(onlineUser => onlineUser.socketId)
  }

  return {
    remove,
    add,
    list,
    getSocketsFromUsers
  }
}
