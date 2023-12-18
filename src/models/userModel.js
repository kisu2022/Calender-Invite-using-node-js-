module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        
        fname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                len: [2,10],
                isAlpha:true
            }
        },
        lname: {
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                len: [2,10],
                isAlpha:true,
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull:false
        },
        gender:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                isIn:[['male','female','others']]
            }
        }
    })

    return User

}