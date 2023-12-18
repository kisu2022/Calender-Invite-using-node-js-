const express = require('express')
const cors = require('cors')

const bodyParser = require('body-parser');
//Sequelize Connection ................................
const dbConfig = require('./src/config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        // operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./src/models/userModel.js')(sequelize, DataTypes)

db.sequelize.sync({ force:false })
.then(() => {
    console.log('yes re-sync done!')
})




module.exports = db

//end........................................

const app = express()

// middleware

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json());


// routers
const router = require('./src/routes/userRouter.js')
app.use('/api/users', router)

//port

const PORT = process.env.PORT || 4000


//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})