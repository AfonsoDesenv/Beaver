module.exports = app => {
  const Users = app.db.models.Users;
  app.route("/user")
    .all(app.auth.authenticate())
    .get((req, res) => {
      Users.findById(req.user.id, {
        attributes: ["id", "name", "email", "latitude", "longitude", "picture", "updated_at" ],
        include: [{
          model: app.db.models.ServiceProviders,
          attributes: ["id"],
          include: [{
            model: app.db.models.Services,
            attributes: ["title"]
          }]
        }]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: 'Usuário não encontrado.'});
      });
    })
    .put((req, res) => {
      Users.update(req.body, { where: {
        id: req.user.id
      }})
      .then(result => res.sendStatus(204))
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
    })
    .delete((req, res) => {
       let password = req.body.password
       Users.findById(req.user.id)
         .then(result => {
           if (Users.isPassword(result.password, password)) {
             Users.destroy({where: {id: req.user.id} })
             .then(result => res.sendStatus(204))
             .catch(error => {
               res.status(412).json({msg: error.message});
             });
          } else {
            res.status(400).json({msg: 'Senha inválida.'})
          }
       })
       .catch(error => res.status(412).json({msg: 'Usuário não encontrado.'}))
    });

  app.route("/user/:user_id")
    .all(app.auth.authenticate())
    .get((req, res) => {
      Users.findById(req.params.user_id, {
        attributes: ["id", "name", "email", "latitude", "longitude", "picture", "updated_at" ],
        include: [{
          model: app.db.models.ServiceProviders,
          attributes: ["id"],
          include: [{
            model: app.db.models.Services,
            attributes: ["title"]
          }]
        }]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: 'Usuário não encontrado.'});
      });
    });

  app.route("/user/change-password")
    .all(app.auth.authenticate())
    .post((req, res) => {
      let oldPassword = req.body.oldPassword,
            password = Users.generatePasswordHash(req.body.newPassword)
      Users.findById(req.user.id)
        .then(result => {
           if (Users.isPassword(result.password, oldPassword)) {
             Users.update({
               password
             }, {
               where: {
                 id: req.user.id
               }
             })
             .then(result => res.json(result))
             .catch(error => res.status(412).json({msg: error.message}))
           } else {
             res.status(400).json({msg: 'Senha antiga inválida.'})
           }
        })
        .catch(error => res.status(412).json({msg: 'Usuário não encontrado.'}))
    });

  app.route("/user/upload-pictures")
    .all(app.auth.authenticate())
    .post((req, res) => {
      let picture = req.body.picture
      Users.update({
        picture
      }, {
        where: {
          id: req.user.id
        }
      })
      .then(result => res.json(result))
    });

  app.post("/users", (req, res) => {
    Users.create(req.body)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: 'E-mail já cadastrado!'});
      });
  });
};
