module.exports = app => {

 const Ratings = app.db.models.Ratings;
 const ServiceRequests = app.db.models.ServiceRequests;
 const ServiceProviders = app.db.models.ServiceProviders;
 app.route("/rateRequest")
   .all(app.auth.authenticate())
   .post((req, res) => {
     Ratings.create(req.body)
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

  app.route("/myRating/")
    .all(app.auth.authenticate())
    .get((req, res) => {
    app.db.sequelize.query('SELECT ROUND(avg(Ratings.rate), 2) as average' +
                    '  FROM Ratings,' +
                    '       ServiceRequests,' +
                    '       ServiceProviders ' +
                    ' WHERE ServiceRequests.id = Ratings.service_request_id' +
                    '   AND ServiceRequests.service_provider_id = ServiceProviders.id' +
                    '   AND ServiceProviders.user_id = :id' +
                    ' GROUP BY ServiceProviders.user_id',
      { replacements: { id: req.user.id }, type: app.db.sequelize.QueryTypes.SELECT })
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json({msg: error.message});
    })
  });

  app.route("/myRating/:service_provider_id")
    .all(app.auth.authenticate())
    .get((req, res) => {
    app.db.sequelize.query('SELECT ROUND(avg(Ratings.rate), 2) as average' +
                    '  FROM Ratings,' +
                    '       ServiceRequests' +
                    ' WHERE ServiceRequests.id = Ratings.service_request_id' +
                    '   AND ServiceRequests.service_provider_id = :id' +
                    ' GROUP BY ServiceRequests.service_provider_id',
      { replacements: { id: req.params.service_provider_id }, type: app.db.sequelize.QueryTypes.SELECT })
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json({msg: error.message});
    })
  });

  app.route("/hasService")
    .all(app.auth.authenticate())
    .get((req, res) => {
    Ratings.findAll({
      attributes: ["comment" ],
      include: {
        model: ServiceRequests,
        attributes: [],
        include: {
          model: ServiceProviders,
          attributes: [],
          where: {
            user_id: req.user.id
          }
        }
      },
      where: {
        comment: { $ne: '' }
      }
    })
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json({msg: error.message});
    })
  });

  app.route("/MyComments")
    .all(app.auth.authenticate())
    .get((req, res) => {
    Ratings.findAll({
      attributes: ["comment" ],
      include: {
        model: ServiceRequests,
        attributes: [],
        include: {
          model: ServiceProviders,
          attributes: [],
          where: {
            user_id: req.user.id
          }
        }
      },
      where: {
        comment: { $ne: '' }
      }
    })
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json({msg: error.message});
    })
  });
};
