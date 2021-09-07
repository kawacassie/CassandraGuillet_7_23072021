const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            models.Post.belongsTo(models.User, {
                foreignKey: { allowNull: false }, onDelete: 'CASCADE',
            }),
            models.Post.hasMany(models.Comment);
        }
    };
    Post.init({
        UserId: { type: DataTypes.STRING, allowNull: false},
        title: { type: DataTypes.STRING, allowNull: false},
        content: { type: DataTypes.TEXT, allowNull: false},
        image_url: { type: DataTypes.STRING, allowNull: true},
        createdAt: { type: Sequelize.JSON, allowNull: false},
    },
    {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};