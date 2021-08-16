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
        UserId: { type: DataTypes.STRING, allowNull: false},
        PostId: { type: DataTypes.STRING, allowNull: false},
        last_name: {type: DataTypes.STRING, allowNull: false},
        first_name: { type: DataTypes.STRING, allowNull: false},
        content: { type: DataTypes.STRING, allowNull: false},
        comment_date: { type: DataTypes.STRING, allowNull: false},
    },
    {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};