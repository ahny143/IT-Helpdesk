require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDatabase();

        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Cannot start server:", error.message);
        process.exit(1);
    }
};

startServer();