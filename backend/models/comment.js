const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            models.Comment.belongsTo(models.User, {
                foreignKey: { allowNull: false }, onDelete: 'CASCADE',
            }),
            models.Comment.belongsTo(models.Post, {
                foreignKey: { allowNull: false }, onDelete: 'CASCADE',
            })
        }
    };
    Comment.init({
        content: { type: DataTypes.STRING, allowNull: false},
        comment_date: { type: DataTypes.STRING, allowNull: false},
        likes: { type: DatatType.NUMBER, allowNull: false, default: 0},
        dislikes: { type: DataTypes.NUMBER, allowNull: false, default: 0 },
        usersLikedPost: { type: DataTypes.ARRAY },
        usersDislikedPost: { type: DataTypes.ARRAY }
    },
    {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};