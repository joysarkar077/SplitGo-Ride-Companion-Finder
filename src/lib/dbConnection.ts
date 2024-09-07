import mysql from "mysql2/promise";

let connection: mysql.Connection | null;
const dbConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      port: Number(process.env.DATABASE_PORT),
    });
    console.log("db connected");
    return connection;
  } else {
    console.log("db already connected");
    return connection;
  }
};

export default dbConnection;
