const { EntitySchema } = require("typeorm");

const UserEntity = new EntitySchema({
    name: "User",
    tableName: "users_assignment3", // Distinct table name to avoid conflicts
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
            nullable: false,
        },
        email: {
            type: "varchar",
            nullable: false,
            unique: true,
        },
        password: {
            type: "varchar",
            nullable: false,
        },
    },
});

module.exports = { UserEntity };
