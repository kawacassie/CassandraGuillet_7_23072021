const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            models.Category.hasMany(models.Post);
        }
    }
    Category.init(
        {
            category: { type: DataTypes.STRING, allowNull: false},
        },
        {
            sequelize, 
            modelName: 'Category',
        }
    );
    return Category;
};