const { Model } = require('sequelize');
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
        createdAt: { type: DataTypes.STRING, allowNull: false},
        likes: { type: DataTypes.INTEGER, allowNull: true, default: 0},
        dislikes: { type: DataTypes.INTEGER, allowNull: true, default: 0 },
        usersLiked: { type: DataTypes.INTEGER },
        usersDisliked: { type: DataTypes.INTEGER }
    },
    {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};