const AuthService = require("./auth.service");

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const token = await AuthService.login(email, password);
            res.json(token);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },

    register: async (req, res) => {
        const userData = req.body;
        try {
            const newUser = await AuthService.register(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = authController;
