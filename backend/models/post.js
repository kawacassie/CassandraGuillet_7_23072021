const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            models.Post.belongsTo(models.Category, {
                foreignKey: { allowNull: false }, onDelete: 'CASCADE',
            }),
            models.Post.belongsTo(models.Category, {
                foreignKey: { allowNull: false }, onDelete: 'CASCADE',
            }),
            models.Post.hasMany(models.Comment);
        }
    };
    Post.init({
        user_id: { type: DataTypes.STRING, allowNull: false},
        category_id: { type: DataTypes.STRING, allowNull: false},
        title: { type: DataTypes.STRING, allowNull: false},
        content: { type: DataTypes.TEXT, allowNull: false},
        image_url: { type: DataTypes.STRING, allowNull: true},
        post_date: { type: DataTypes.STRING, allowNull: false},
        likes: { type: DatatType.NUMBER, allowNull: false, default: 0},
        dislikes: { type: DataTypes.NUMBER, allowNull: false, default: 0 },
        usersLiked: { type: DataTypes.ARRAY },
        usersDisliked: { type: DataTypes.ARRAY }
    },
    {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};