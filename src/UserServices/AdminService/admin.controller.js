const adminService = require("./admin.service");

const adminController = {
    getReports: async (req, res) => {
        try {
            const result = await adminService.getReports();
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(error?.statusCode || 500).json({ message: error.message });
        }
    },

    importUsers: async (req, res) => {
        try {
            if (!req?.file) {
                return res.status(400).json({ message: "No file buffer provided" });
            }
            if (
                !(
                    req.file.originalname.endsWith(".xlsx") ||
                    req.file.originalname.endsWith(".csv")
                )
            ) {
                return res
                    .status(400)
                    .json({ message: "Only .xlsx or .csv files are allowed" });
            }
            const { buffer, originalname } = req?.file;
            const result = await adminService.importUsers(buffer, originalname);
            return res.status(200).json(result);
        } catch (error) {
            res.status(error?.statusCode || 500).json({ message: error.message });
        }
    },
};

module.exports = adminController;
