import { cigarItem } from "./models";
import * as SQLite from "expo-sqlite";

const tableName = "cigarData";

export const getDBConnection = () => {
  try {
    return SQLite.openDatabaseAsync("cigar-data.db");
  } catch (err) {
    console.error(err);
    throw new Error("Error opening database");
  }
};

export const createTable = (db) => {
  try {
    if (!db) {
      console.error("Database connection is null");
      throw new Error("Database connection is null");
    }
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cigarName TEXT NOT NULL,
        drawRating INTEGER,
        appearanceRating INTEGER,
        burnRating INTEGER,
        aromaRating INTEGER,
        tasteRating INTEGER,
        smokeTime INTEGER,
        review TEXT,
        image TEXT
    );`;
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          console.log("Table created successfully");
        },
        (tx, error) => {
          console.error("Error creating table", error);
        },
      );
    });
  } catch (err) {
    console.error(err);
    throw new Error("Error creating table");
  }
};

export const insertCigarItem = (db, item) => {
  const insertQuery = `INSERT INTO ${tableName} (cigarName, drawRating, appearanceRating, burnRating, aromaRating, tasteRating, smokeTime, review, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  const values = [
    item.cigarName,
    item.drawRating,
    item.appearanceRating,
    item.burnRating,
    item.aromaRating,
    item.tasteRating,
    item.smokeTime,
    item.review,
    item.image,
  ];
  console.log(db, " printing db");
  db.transaction((tx) => {
    tx.executeSql(
      insertQuery,
      values,
      (tx, result) => {
        console.log("Item inserted successfully");
      },
      (tx, error) => {
        console.error("Error inserting item", error);
      },
    );
  });
};

export const fetchRecentCigarItems = (db, limit = 20, offset = 0) => {
  try {
    const fetchQuery = `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT ? OFFSET ?;`;
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          fetchQuery,
          [limit, offset],
          (tx, results) => {
            const items = [];
            for (let i = 0; i < results.rows.length; i++) {
              items.push(results.rows.item(i));
            }
            resolve(items);
          },
          (tx, error) => {
            console.error("Error fetching items", error);
            reject(error);
          },
        );
      });
    });
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching items");
  }
};
