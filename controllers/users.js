const User = require('../models/user');
const Car = require('../models/car');


exports.index = async (req,res,next) => {
    
    const users = await User.find({});
    res.status(200).json(users);
};

exports.newUser = async (req,res,next) => {

    const newUser = new User(req.value.body);
    const user = await newUser.save();
    res.status(201).json(user);
};

exports.getUser = async (req,res,next) => {
    const { userId } = req.value.params;

    const user = await User.findById(userId);
    res.status(200).json(user);
};

exports.replaceUser = async (req,res,next) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    //console.log(req.value);
    const result = await User.findByIdAndUpdate(userId,newUser,{new: true});

    res.status(200).json({
        success: true
    });
};

exports.updateUser = async (req,res,next) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    const result = await User.findByIdAndUpdate(userId,newUser,{new:true});
    res.status(200).json({
        success: true
    });
};

exports.getUserCars = async (req,res,next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).populate('cars');
    res.status(200).json(user.cars);
};

exports.newUserCar = async (req,res,next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId);
    if(!user){
        throw new Error('seller not found');
    }
    //console.log(1);
    const newCar = new Car(req.value.body);
    newCar.seller = user._id;
    //newCar.seller = user-ov ev user.cars.push(newCar) -ov 
    //RangeError: Maximum call stack size exceeded - er talis 1-ini addi vaxt 
    await newCar.save();
    //console.log(2);
    user.cars.push(newCar._id);
    //console.log(3);
    //console.log(user);
    const a = await user.save();
    //console.log(4);
   // console.log(a);
    res.status(201).json(newCar);
};

exports.deleteUser = async (req,res,next) => {
    const { userId } = req.value.params;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            error: 'User dosn\'t exist'
        });
    }
    
    // for(let value of user.cars){
    //    await Car.remove({_id: value})
    // }
    await Car.deleteMany({seller: user._id});
    await user.remove();

    res.status(200).json({
        success: true
    });

};