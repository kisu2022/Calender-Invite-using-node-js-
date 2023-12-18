const db = require('../../server.js')

const Op=require('sequelize')


const User = db.user


// 1. create user

const addUser = async (req, res) => {
    let user;
    try{
        
        let info = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            dob: req.body.dob,
            gender:req.body.gender,
        }
         user = await User.create(info)
         res.status(200).send(user)
        //console.log(user)
    }
    catch(err){
        //console.log("ERROR:",e.errors);
        let messages={};
        if(err && err.errors)
        {
            err.errors.forEach((error)=>{
                let message
                switch(error.validatorKey)
                {
                    case 'not_unique':
                        message="Email should be unique"
                        break;
                    case 'isIn':
                        message="gender should be either male or female or others"
                        break;
                    case 'isAlpha':
                        message="user name should contain only alphabet "
                }
                messages[error.path]=message
    
                //console.log(messages);
                res.status(403).send(messages)
            })
        }
        
    }
    

}



// 2. get all users

const getAllUsers = async (req, res) => {

    try{
        let users = await User.findAll({})

        users.length>0 ? res.status(200).send(users) : res.status(404).send({message:"the table is empty"})
    }
    catch(err){
        console.log("ERROR:",err.errors)
        res.status(err.statusCode || 400).send({message: err.message})
    }
    

}

// 3. get single User

const getOneUser = async (req, res) => {

    
    try{
        let id = req.params.id
        let user = await User.findOne({ where: { id: id }})
        user ? res.status(200).send(user) : res.status(404).send({message:"the user is not present on the table "})
    }
    catch(err){
        console.log("ERROR:",err.errors)
        res.status(err.statusCode || 400).send({message: err.message})
    }
}

// 4. update User

const updateUser = async (req, res) => {

    try{
        let id = req.params.id
        let uuser = await User.findOne({ where: { id: id }})
        if(uuser)
        {
            await User.update(req.body, { where: { id: id }})
            let user = await User.findOne({ where: { id: id }})
            res.status(200).send(user) 
        }
        else
        {
            res.status(404).send('the user is not present on the table ')
        }
    }
    catch(err){
        console.log("ERROR:",err.errors)
        res.status(err.statusCode || 400).send({message: err.message})
    }
   

}

// 5. delete User by id

const deleteUser = async (req, res) => {

    
    try{
        let id = req.params.id
        let duser = await User.findOne({ where: { id: id }})
        if(duser)
        {
            await User.destroy({ where: { id: id }} )
            res.status(200).send('Product is deleted !')
        }
        else
        {
            res.status(404).send('the user is not present on the table ')
        }
    }
    catch(err){
        console.log(err.errors)
        res.status(err.statusCode || 400).send({message: err.message})
    }
    

}

//6.search User by fname

const searchTerm = async (req, res) => {
    const searchTerm = req.body;
    try {
        const user= await User.findAll({
         where: {
           [Op.or]: [
             { fname: { [Op.iLike]: '%' + searchTerm.fname+ '%'} },
             { lname: { [Op.iLike]: '%' + searchTerm.lanme+ '%'} }, 
             { email: { [Op.iLike]: '%' + searchTerm.email+ '%'} }, 
             { dob: { [Op.ILike]: '%' + searchTerm.dob + '%'} },
             { gender: { [Op.iLike]: '%' + searchTerm.gender+ '%'} }  
           ],
         },
       });
       res.status(200).send(user);
       } catch (err) {
       res.status(err.statusCode || 400).send(err.message);
       }

}




module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    searchTerm
}