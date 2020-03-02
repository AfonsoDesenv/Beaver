module.exports = app => {
  const Images = app.db.models.Images;

  app.route("/images/:id")
  .all(app.auth.authenticate())
  .get((req, res) => {
    Images.findAll({
        attributes: ["id", "image", "created_at" ],
        where: {
          service_provider_id: req.params.id
        },
        order: [
             ['created_at', 'ASC']
         ]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
  })
  .delete((req, res) => {
    Images.destroy({
      where: { id: req.params.id }
    })
    .then(result => res.sendStatus(204))
    .catch(error => {
      res.status(412).json({msg: error.message});
    });
  });

  app.route("/images")
  .all(app.auth.authenticate())
  .post((req, res) => {
    Images.create(req.body)
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
  });
}
