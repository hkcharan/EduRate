import { connectDB } from "./config/database.js";
import app from "./app.js";

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});

