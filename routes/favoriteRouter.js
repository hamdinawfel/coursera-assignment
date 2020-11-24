const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorite');

var authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({ user : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
      .then((favorite) =>{
          if(favorite !== null){
              for(var i=0; i++; i<= req.body.length){
                  if(favorite.dishes.indexOf(req.body[i]._id) !== -1){
                    err = new Error('Dish ' + req.body[i]._id + ' is already exist in your favorites');
                    err.status = 404;
                    return next(err);
                  }else{
                    favorite.dishes.push(req.body[i]._id);
                  }
              }
              favorite.save()
              .then((favorite) =>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
          }else{
            const newFavorite = new Favorites({
                user: req.user._id,
                dishes:req.body
            });
            newFavorite.save()
             .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
             }, (err) => next(err))
          }
      }, (err) => next(err))
      .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndDelete({user: req.user._id})
    .then((favorite) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
   .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then((favorite) =>{
        if(favorite !== null){
            if(favorite.dishes.indexOf(req.params.dishId) !== -1){
                err = new Error('Dish ' + req.params.dishId + ' is already exist in your favorites');
                err.status = 404;
                return next(err);
              }else{
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                    .then((favorite) =>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
              } 
        }else{
          const newFavorite = new Favorites({
              user: req.user._id,
              dishes:[req.params.dishId]
          });
          newFavorite.save()
           .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
           }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then((favorite) =>{
        if(favorite !== null){
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId),1)
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);  
            },(err) => next(err))                   
        }else{
            err = new Error("You d'ont have a favorites");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;