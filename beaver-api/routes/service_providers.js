import Sequelize from "sequelize";

module.exports = app => {

 const ServiceProviders = app.db.models.ServiceProviders;
 const Services = app.db.models.Services;
 const ServiceRequests = app.db.models.ServiceRequests;
 const Users = app.db.models.Users;

 app.route("/serviceProviders")
   .all(app.auth.authenticate())
   .get((req, res) => {
     ServiceProviders.findAll({
       attributes: ["id", "description", "latitude", "longitude", "updated_at" ],
       where: { user_id: req.user.id },
       include: [{
         model: Services,
         attributes: ["title"]
       }],
       order: [
         [Services, 'title', 'ASC']
       ]
     })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   })
   .post((req, res) => {
     req.body.user_id	=	req.user.id;
     ServiceProviders.create(req.body)
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

 app.route("/serviceProvidersByUser/:user_id")
   .all(app.auth.authenticate())
   .get((req, res) => {
     ServiceProviders.findAll({
       attributes: ["id", "description", "latitude", "longitude", "updated_at" ],
       where: { user_id: req.params.user_id },
       include: [{
         model: Services,
         attributes: ["title"]
       },
       {
         model: ServiceRequests,
         attributes: ["status"],
         where: {
           user_id: req.user.id,
           status: {
             $or: [1,2]
           }
         },
         required: false
       }],
       order: [
         [Services, 'title', 'ASC']
       ]
     })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

 app.route("/serviceProviders/:service_id")
   .all(app.auth.authenticate())
   .get((req, res) => {
     ServiceProviders.findAll({
       attributes:  ["id", "description", "latitude", "longitude", "updated_at",
                    [Sequelize.literal('(SELECT ROUND(avg(Ratings.rate), 2)' +
                                        '  FROM Ratings,' +
                                        '       ServiceRequests' +
                                        ' WHERE ServiceRequests.id = Ratings.service_request_id' +
                                        '   AND ServiceRequests.service_provider_id = ServiceProviders.id' +
                                        ' GROUP BY ServiceRequests.service_provider_id)'),'rating']],
       where: {
         service_id: req.params.service_id,
         user_id: {
           $ne: req.user.id
         }
       },
       include: [{
         model: Users,
         attributes: ["name", "picture"]
       }]
     })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

 app.route("/serviceProvider/:id")
   .all(app.auth.authenticate())
   .get((req, res) => {
     ServiceProviders.findOne({
       where: { id: req.params.id },
       include: [{
         model: Users,
         attributes: ["name", "picture"]
       },
       {
         model: Services,
         attributes: ["title"]
       }]
     })
     .then(result => {
       if (result) {
         res.json(result);
       } else {
         res.sendStatus(404);
       }
     })
     .catch(error => {
       res.status(412).json({msg: error.message});
     });

   })
   .put((req, res) => {
     ServiceProviders.update(req.body, { where: {
       id: req.params.id
     }})
     .then(result => res.sendStatus(204))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   })
   .delete((req, res) => {
     ServiceProviders.destroy({ where: {
       id: req.params.id
     }})
     .then(result => res.sendStatus(204))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

 app.route("/latestServiceProviders")
   .all(app.auth.authenticate())
   .get((req, res) => {
     ServiceProviders.findAll({
       limit: 10,
       attributes: ["id", "description", "latitude", "longitude", "updated_at" ],
       include: [{
         model: Services,
         attributes: ["title"]
       },
       {
         model: Users,
         attributes: ["name", "picture"],
         where: {
           id: { $not: req.user.id}
         }
       }],
       order: [
         ['created_at', 'DESC']
       ]
     })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });
 };
