const { Model, Sequelize } = require('sequelize');
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
        UserId: { type: DataTypes.STRING, allowNull: false},
        PostId: { type: DataTypes.STRING, allowNull: false},
        comment: { type: DataTypes.STRING, allowNull: false},
        createdAt: { type: Sequelize.JSON, allowNull: false},
    },
    {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};