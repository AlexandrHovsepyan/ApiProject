const router = require('express-promise-router')();

const CarsControllers = require('../controllers/cars');

const { validateParams, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/')
    .get(CarsControllers.index)
    .post(validateBody(schemas.carSchema),CarsControllers.newCar);

router.route('/:carId')
    .get(validateParams(schemas.idSchema, 'carId'), CarsControllers.getCar)
    .put([validateParams(schemas.idSchema, 'carId'), validateBody(schemas.putCarSchema)],
         CarsControllers.replaceCar)
    .patch([validateParams(schemas.idSchema, 'carId'), validateBody(schemas.patchCarSchema)],
        CarsControllers.updateCar)
    .delete(validateParams(schemas.idSchema, 'carId') ,CarsControllers.deleteCar);    
module.exports = router;