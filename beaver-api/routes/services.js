module.exports = app => {

 const Services = app.db.models.Services;
 const ServiceProviders = app.db.models.ServiceProviders;

 app.route("/services")
   .all(app.auth.authenticate())
   .get((req, res) => {
     Services.findAll({
       limit: 10,
       order: [
            ['title', 'ASC']
        ]
      })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   })
   .post((req, res) => {
     req.body.user_id	=	req.user.id;
     Services.create(req.body)
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

   app.route("/services/add-service-provider")
    .all(app.auth.authenticate())
    .post((req, res) => {
      req.body.user_id	=	req.user.id;
      Services.create(req.body)
      .then(result => {
        let body = {
          user_id: req.user.id,
          service_id: result.id
        }
        ServiceProviders.create(body)
        .then(result => res.json(result))
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
      })
      .catch(error => {
        Services.findOne({
          where: { 'title': req.body.title },
        })
        .then(result => {
          let body = {
            user_id: req.user.id,
            service_id: result.id
          }
          ServiceProviders.create(body)
          .then(result => res.json(result))
          .catch(error => {
            res.status(412).json({msg: error.message});
          });
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
      });
    });

 app.route("/services/:search")
   .all(app.auth.authenticate())
   .get((req, res) => {
     Services.findAll({
       where: { 'title': { $like: '%' + req.params.search + '%' }},
       order: [
            ['title', 'ASC']
        ]
      })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   })
 };
