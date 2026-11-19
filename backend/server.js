require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database");
const scheduler = require("./services/slaScheduler");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDatabase();

        const server = http.createServer(app);

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            scheduler.start();
        });
        const shutdown = () => { scheduler.stop(); server.close(() => process.exit(0)); };
        process.once("SIGINT", shutdown);
        process.once("SIGTERM", shutdown);
    } catch (error) {
        console.error("Cannot start server:", error.message);
        process.exit(1);
    }
};

startServer();
