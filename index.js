import { app } from "./src/application/server.js";
import { connectDB } from "./src/application/database.js";

const port = process.env.PORT || 3000;

await connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});