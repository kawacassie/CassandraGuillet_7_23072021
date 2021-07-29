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
        title: { type: DataTypes.STRING, allowNull: false},
        content: { type: DataTypes.TEXT, allowNull: false},
        image_url: { type: DataTypes.STRING, allowNull: true},
        post_date: { type: DataTypes.STRING, allowNull: false},
        likes: { type: DatatType.NUMBER, allowNull: false}, 
    },
    {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};