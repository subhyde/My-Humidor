import { cigarItem } from "./models";
import * as SQLite from "expo-sqlite";

const tableName = "cigarReviews";

export const createTable = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
     PRAGMA journal_mode = WAL;
     CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cigarName TEXT NOT NULL,
        drawRating INTEGER,
        appearanceRating INTEGER,
        burnRating INTEGER,
        aromaRating INTEGER,
        tasteRating INTEGER,
        smokeTime INTEGER,
        review TEXT,
        image TEXT);
  `);
};

export const insertCigarItem = async (
  db: SQLite.SQLiteDatabase,
  item: cigarItem,
) => {
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

  try {
    const result = await db.runAsync(insertQuery, values);
    console.log("Item inserted successfully, ID:", result.lastInsertRowId);
  } catch (error) {
    console.error("Error inserting item", error);
  }
};

export const fetchRecentCigarItems = async (
  db: SQLite.SQLiteDatabase,
  limit = 20,
  offset = 0,
) => {
  const fetchQuery = `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT ? OFFSET ?;`;
  console.log(
    `Executing query: ${fetchQuery} with limit: ${limit}, offset: ${offset}`,
  );
  try {
    const items = await db.getAllAsync(fetchQuery, [limit, offset]);
    console.log("Fetched items:", items);
    return items;
  } catch (error) {
    console.error("Error fetching items", error);
    throw new Error("Error fetching items");
  }
};

export const searchCigarItemsByName = async (
  db: SQLite.SQLiteDatabase,
  cigarName: string,
  limit = 20,
  offset = 0,
) => {
  const searchQuery = `SELECT * FROM ${tableName} WHERE cigarName LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?;`;
  const searchValue = `%${cigarName}%`;
  console.log(
    `Executing query: ${searchQuery} with searchValue: ${searchValue}, limit: ${limit}, offset: ${offset}`,
  );
  try {
    const items = await db.getAllAsync(searchQuery, [
      searchValue,
      limit,
      offset,
    ]);
    console.log("Searched items:", items);
    return items;
  } catch (error) {
    console.error("Error searching items", error);
    throw new Error("Error searching items");
  }
};
