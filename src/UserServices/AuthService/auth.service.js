const promisePool = require("../../config/dbConfig");
const { generateToken } = require("./jwt.util");
const bcrypt = require("bcryptjs");

const AuthService = {
    login: async (email, password) => {
        // Find user
        const [rows] = await promisePool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        const user = rows[0];

        if (!user) throw new Error("Invalid email or password");

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        // Remove password from user object
        delete user.password;

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return { user, token };
    },

    register: async (userData) => {
        let password = userData?.password ? userData?.password : userData?.name;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [data] = await promisePool.query(
            "SELECT * FROM users WHERE email = ?",
            [userData.email]
        );
        const user = data[0];
        if (user) throw new Error("User already exists");

        const [result] = await promisePool.query(
            "INSERT INTO users (name, email, password, role, mobile_number) VALUES (?, ?, ?, ?, ?)",
            [
                userData.name,
                userData.email,
                hashedPassword,
                userData.role || "user",
                userData.mobile_number,
            ]
        );

        if (!result.affectedRows) throw new Error("User registration failed");

        // Get the newly created user
        const [rows] = await promisePool.query("SELECT * FROM users WHERE id = ?", [
            result.insertId,
        ]);
        const newUser = rows[0];

        // Remove password from user object
        delete newUser.password;
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
        return { user: newUser, token };
    },
};

module.exports = AuthService;
