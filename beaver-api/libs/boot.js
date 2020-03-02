/*
import https from "https";
import fs from "fs";

module.exports = app => {

 const credentials = {
   key:  fs.readFileSync("beaver.key",  "utf8"),
   cert: fs.readFileSync("beaver.cert", "utf8")
 }

 app.db.sequelize.sync().done(() => {
  let server = https.createServer(credentials, app)
    .listen(app.get("port"), () => {
      app.sockets.index.init(server)
      console.log(`Beaver API - porta ${app.get("port")}`);
    });
 });

}
*/

 module.exports = app => {

     app.db.sequelize.sync().done(() => {
         let server = app.listen(app.get("port"), () => {
             app.sockets.index.init(server)
             console.log(`Beaver API - porta ${app.get("port")}`)
         })
     })
 }
