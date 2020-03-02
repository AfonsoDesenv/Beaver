import logger from "./logger.js";

module.exports = {
  database: "beaver",
  username: "root",
  password: "123456",
  params: {
    dialect: "mysql",
       host: 'localhost',
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true
    }
  },
  jwtSecret: "B&@V&R-AP1",
  jwtSession: {session : false}
};
