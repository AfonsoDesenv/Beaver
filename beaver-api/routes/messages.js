module.exports = app => {
  const Messages = app.db.models.Messages;
  const Users = app.db.models.Users;

  app.route("/messages/:contactId")
  .all(app.auth.authenticate())
  .get((req, res) => {
    let contactId = parseInt(req.params.contactId)
    Messages.findAll({
        attributes: ["id", "text", "to_id", "from_id", "created_at" ],
        where: {
          $or: [
            {
              to_id: req.user.id,
              from_id: contactId
            },
            {
              to_id: contactId,
              from_id: req.user.id
            }
          ]
        },
        order: [
             ['created_at', 'ASC']
         ]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
  });

// select users.name from messages, users where ((to_id = 1 and users.id = from_id)  or (from_id = 1 and users.id = to_id)) and users.id = from_id group by to_id, from_id

  app.route("/conversations")
  .all(app.auth.authenticate())
  .get((req, res) => {
    Messages.findAll({
      attributes: ['id', 'from_id', 'to_id', 'created_at'],
        where: {
          $or: [
            {
              to_id: req.user.id
            },
            {
              from_id: req.user.id
            }
          ]
        },
        include: {
          model: Users,
          attributes: ['id', 'name', 'picture'],
          where: {
            id: {
              $ne: req.user.id
            }
          },
          group: ['id']
        },
        order: [
             ['created_at', 'DESC']
         ],
        group: ['to_id', 'from_id']
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
    });

  app.route("/messages")
    .all(app.auth.authenticate())
    .post((req, res) => {
      Messages.create(req.body)
        .then(result => res.json(result))
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    });
  };
