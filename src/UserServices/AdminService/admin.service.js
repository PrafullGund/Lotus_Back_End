const xlsx = require("xlsx");
const AuthService = require("../AuthService/auth.service");
const promisePool = require("../../config/dbConfig");

const adminService = {
    getReports: async () => {
        try {
            const [rows] = await promisePool.query(
                "SELECT id, email, name, role, mobile_number, course_name, course_status, created_at FROM users where role = ?",
                ["user"]
            );
            if (!rows || !rows.length) throw new Error(error.message);
            return rows;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    importUsers: async (fileBuffer, fileName) => {
        const fileExtension = fileName.split(".").pop().toLowerCase();

        let users = [];

        if (fileExtension === "csv") {
            // For CSV, use `read` with type "buffer" and raw options for accuracy
            const workbook = xlsx.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            users = xlsx.utils.sheet_to_json(sheet, { defval: "" }); // `defval` ensures empty fields are not undefined
        } else if (["xlsx", "xls"].includes(fileExtension)) {
            const workbook = xlsx.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            users = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        } else {
            throw new Error("Unsupported file format");
        }

        const results = [];
        for (const userData of users) {
            try {
                const result = await AuthService.register(userData);
                results.push({
                    email: userData.email,
                    status: "success",
                    user: result.user,
                });
            } catch (err) {
                console.log(err);
                throw new Error("Error importing questions: " + err.message);
            }
        }
        return results;
    },
};

module.exports = adminService;
