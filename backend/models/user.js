const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            models.User.hasMany(models.Post);
            models.User.hasMany(models.Comment);
        }
    }
    User.init(
        {
            first_name: { type: DataTypes.STRING, allowNull: false },
            last_name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password: { type: DataTypes.STRING, allowNull: false},
            job: { type: DataTypes.STRING, allowNull: true},
            avatar: { type: DataTypes.STRING, allowNull: true },
            bio: { type: DataTypes.TEXT, allowNull: true },
            is_admin: { type: DataTypes.BOOLEAN, allowNull: false, default: false},
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};