import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

const app = express();
const PORT = 4000;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://aple-react-clone-2024.netlify.app",
    ],
  })
);
console.log();

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
  connectionLimit: 10,
  waitForConnections: true,
  ssl: { rejectUnauthorized: false },
});

// connection.connect((err) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log("Database Connected");
//   }
// });

app.get("/iphone", async (req, res) => {
  try {
    const select = `SELECT 
	  t1.Product_id,
    t1.product_url,
    t1.product_name,
    t2.Product_link,
    t2.Product_img,
    t2.Product_description,
    t2.Product_brief_description,
    t3.Starting_price,
    t3.Price_range
FROM 
   products t1
INNER JOIN 
    product_descriptions t2 ON t1.Product_id = t2.Product_id
INNER JOIN 
    product_prices t3 ON t2.Product_id = t3.Product_id;
`;

    const [rows] = await pool.query(select);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Start the server after database connection
const startServer = async () => {
  const result = await pool.execute("select 'test'");
  console.log("db connected");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
