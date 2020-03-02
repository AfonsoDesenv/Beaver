import Sequelize from "sequelize";
import { SendMail } from '../email.js'

module.exports = app => {

 const ServiceRequests = app.db.models.ServiceRequests;
 const ServiceProviders = app.db.models.ServiceProviders;
 const Services = app.db.models.Services;
 const Users = app.db.models.Users;
 const Ratings = app.db.models.Ratings;

 app.route("/serviceRequests")
   .all(app.auth.authenticate())
   .post((req, res) => {
     req.body.user_id	=	req.user.id
     ServiceProviders.findById(req.body.service_provider_id, {
       attributes: ["id"],
       include: [{
         model: Users,
         attributes: ["name", "email"]
       },
       {
         model: Services,
         attributes: ["title"]
       }]
     })
     .then(serviceProvider => {
       Users.findById(req.user.id, {
         attributes: ["name"]
       })
       .then(user => {
         let email_config = {
           name_to: serviceProvider.User.name,
           email_to: serviceProvider.User.email,
           subject: 'Solicitação de Serviço',
           text: `Olá ${serviceProvider.User.name},<br>Você recebeu uma solicitação de serviço de <b>${user.name}</b> para o serviço de ${serviceProvider.Service.title}.`
         }
         ServiceRequests.create(req.body)
         .then(result => {
           SendMail(email_config)
           res.json(result)
         })
         .catch(error => {
           res.status(412).json({msg: error.message});
         })
       })
       .catch(error => {
         res.status(412).json({msg: error.message});
       })
     })
     .catch(error => {
       res.status(412).json({msg: error.message});
     });
   });

app.route("/requestsByService/:id")
  .all(app.auth.authenticate())
  .get((req, res) => {
   ServiceRequests.findAll({
     attributes: ["id", "status", "user_id", "created_at", "updated_at" ],
     where: {
       service_provider_id: req.params.id,
       status: { $or: [1, 2] }
     },
     order: [
       ['updated_at', 'DESC']
     ]
   })
   .then(result => res.json(result))
   .catch(error => {
     res.status(412).json({msg: error.message});
   })
 });

 app.route("/serviceRequests/:service_provider_id/:user_id")
   .all(app.auth.authenticate())
   .get((req, res) => {
    ServiceRequests.findAll({
      attributes: ["id", "status", "service_provider_id", "user_id", "created_at", "updated_at" ],
      where: {
        service_provider_id: req.params.service_provider_id,
        user_id: req.params.user_id
      },
      order: [
        ['updated_at', 'DESC']
      ]
    })
    .then(result => res.json(result))
    .catch(error => {
      res.status(412).json({msg: error.message});
    })
  });

 app.route("/serviceRequests/:id")
   .all(app.auth.authenticate())
   .get((req, res) => {
     ServiceRequests.findAll({
       attributes: ["id", "status", "user_id", "created_at", "updated_at" ],
       where: {
         service_provider_id: req.params.id,
         user_id: req.user.id
       },
       order: [
         ['updated_at', 'DESC']
       ]
     })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     })
   })
   .put((req, res) => {

     let status = req.body.status

     ServiceRequests.findById(req.params.id, {
       attributes: ["id", "status", "user_id", "created_at", "updated_at" ],
       include: [{
         model: ServiceProviders,
         include: [{
           model: Users
         },
         {
           model: Services
         }]
       },
       {
         model: Users,
         attributes: ["id", "name", "email"]
       }]
     })
     .then(serviceRequest => {
       var subject;
       var text;

       // 1 - opened / 2 - accepted / 3 - refused / 4 - concluded / 5 - canceled
       switch (status) {
         case 2:
          subject = 'Solicitação de Serviço Aceita'
          text = `Olá ${serviceRequest.User.name},<br>Sua solicitação de serviço de ${serviceRequest.ServiceProvider.Service.title} foi aceita por <b>${serviceRequest.ServiceProvider.User.name}.`
          break;
         case 3:
           subject = 'Solicitação de Serviço Recusada'
           text = `Olá ${serviceRequest.User.name},<br>Sua solicitação de serviço de ${serviceRequest.ServiceProvider.Service.title} foi recusada por <b>${serviceRequest.ServiceProvider.User.name}.`
           break;
         case 4:
           subject = 'Solicitação de Serviço Concluída'
           text = `Olá ${serviceRequest.User.name},<br>Sua solicitação de serviço de ${serviceRequest.ServiceProvider.Service.title} foi concluída por <b>${serviceRequest.ServiceProvider.User.name}.<br><br>Por favor, não esqueça de avaliar ${serviceRequest.ServiceProvider.User.name}.`
           break;
         case 5:
           subject = 'Solicitação de Serviço Cancelada'
           text = `Olá ${serviceRequest.ServiceProvider.User.name},<br>${serviceRequest.User.name}, cancelou a solicitação de serviço de ${serviceRequest.ServiceProvider.Service.title}.`
           break;
       }
       let email_config = {
         name_to: (status == 2 || status == 3 || status == 4) ? serviceRequest.User.name : serviceRequest.ServiceProvider.User.name,
         email_to: (status == 2 || status == 3 || status == 4) ? serviceRequest.User.email : serviceRequest.ServiceProvider.User.email,
         subject: subject,
         text: text + '<br><br>Este é um e-mail automático. Favor não responder!'
       }

       ServiceRequests.update({status}, { where: {
         id: req.params.id
       }})
       .then(result => {
         SendMail(email_config)
         res.sendStatus(204)
       })
       .catch(error => {
         res.status(412).json({msg: error.message});
       });
     })
     .catch(error => {
       res.status(412).json({msg: error.message});
     })
   });

   app.route("/myRequests")
     .all(app.auth.authenticate())
     .get((req, res) => {
      ServiceRequests.findAll({
        attributes: ["id", "status", "service_provider_id", "user_id", "created_at", "updated_at" ],
        where: {
          user_id: req.user.id
        },
        include: [{
          model: ServiceProviders,
          include: [{
            model: Services
          }]
        },
        {
          model: Users,
          attributes: ["id", "name"]
        }],
        order: [
          ['status', 'DESC'],
          ['updated_at', 'DESC']
        ]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      })
    });

  app.route("/serviceRequest/:id")
    .all(app.auth.authenticate())
    .get((req, res) => {
      ServiceRequests.findById(req.params.id, {
        attributes: ["id", "status", "user_id", "created_at", "updated_at" ],
        include: [{
          model: ServiceProviders,
          include: [{
            model: Users
          },
          {
            model: Services
          }]
        },
        {
          model: Users,
          attributes: ["id", "name"]
        }],
        order: [
          ['updated_at', 'DESC']
        ]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      })
    });

  app.route("/serviceRequestsByUser")
    .all(app.auth.authenticate())
    .get((req, res) => {
     ServiceRequests.findAll({
       attributes: ["id", "status", "service_provider_id", "user_id", "created_at", "updated_at" ],
       where: {
         user_id: req.user.id,
         status: { $or: [1, 2] }
       },
       include: [{
         model: ServiceProviders,
         include: [{
           model: Services
         }]
       },
       {
         model: Users,
         attributes: ["id", "name"]
       }],
       order: [
         ['status', 'DESC'],
         ['updated_at', 'DESC']
       ]
     })
     .then(result => res.json(result))
     .catch(error => {
       res.status(412).json({msg: error.message});
     })
   });

   app.route("/serviceRequestsByProvider/")
     .all(app.auth.authenticate())
     .get((req, res) => {
      ServiceRequests.findAll({
        attributes: ["id", "status", "service_provider_id", "user_id", "created_at", "updated_at" ],
        where: {
          status: { $or: [1, 2] }
        },
        include: [{
          model: ServiceProviders,
          where: {
            user_id: req.user.id
          },
          include: [{
            model: Services
          }]
        },
        {
          model: Users,
          attributes: ["id", "name"]
        }],
        order: [
          ['status', 'DESC'],
          ['updated_at', 'DESC']
        ]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      })
    });

   app.route("/requestsForRating/")
     .all(app.auth.authenticate())
     .get((req, res) => {
      ServiceRequests.findAll({
        attributes: ["id", "status", "service_provider_id", "user_id", "created_at", "updated_at" ],
        where: Sequelize.literal('status = 4 AND NOT EXISTS (SELECT id FROM Ratings WHERE Ratings.service_request_id = ServiceRequests.id)'),
        include: [{
          model: ServiceProviders,
          include: [{
            model: Services
          },
          {
            model: Users,
            attributes: ["id", "name", "picture"]
          }]
        },
        {
          model: Users,
          where: {
            id: req.user.id
          },
          attributes: []
        }],
        order: [
          ['updated_at', 'DESC']
        ]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      })
    });
 }
