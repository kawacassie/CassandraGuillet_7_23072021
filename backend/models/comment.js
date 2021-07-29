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
        post_id: {type: DataTypes.STRING, allowNull: false},
        user_id: { type: DataTypes.STRING, allowNull: false},
        content: { type: DataTypes.STRING, allowNull: false},
        comment_date: { type: DataTypes.STRING, allowNull: false},
    },
    {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};