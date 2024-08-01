import { cigarItem } from "./models";
import * as SQLite from "expo-sqlite";
import { SearchFilter } from "../Components/SearchBar/SearchBar";

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

export const updateCigarItem = async (
  db: SQLite.SQLiteDatabase,
  item: cigarItem,
) => {
  const updateQuery = `UPDATE ${tableName} SET cigarName = ?, drawRating = ?, appearanceRating = ?, burnRating = ?, aromaRating = ?, tasteRating = ?, smokeTime = ?, review = ?, image = ? WHERE id = ?;`;
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
    item.id,
  ];

  console.log(values);

  try {
    await db.runAsync(updateQuery, values);
    console.log("Item updated successfully, ID:", item.id, updateQuery);
  } catch (error) {
    console.error("Error updating item", error);
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
    return await db.getAllAsync(fetchQuery, [limit, offset]);
  } catch (error) {
    console.error("Error fetching items", error);
    throw new Error("Error fetching items");
  }
};

export const deleteCigarItem = async (
  db: SQLite.SQLiteDatabase,
  id: number,
) => {
  const deleteQuery = `DELETE FROM ${tableName} WHERE id = ?;`;
  console.log(`Executing query: ${deleteQuery} with id: ${id}`);
  try {
    await db.runAsync(deleteQuery, [id]);
    console.log("Item deleted successfully, ID:", id);
  } catch (error) {
    console.error("Error deleting item", error);
  }
};

export const searchCigarItems = async (
  db: SQLite.SQLiteDatabase,
  cigarName: string,
  filter: SearchFilter = SearchFilter.Newest,
  limit = 20,
  offset = 0,
) => {
  let orderByClause = "ORDER BY id DESC"; // Default to newest

  switch (filter) {
    case SearchFilter.Newest:
      orderByClause = "ORDER BY id DESC";
      break;
    case SearchFilter.Oldest:
      orderByClause = "ORDER BY id ASC";
      break;
    case SearchFilter.RatingAscending:
      orderByClause =
        "ORDER BY (drawRating + appearanceRating + burnRating + aromaRating + tasteRating) / 5 ASC";
      break;
    case SearchFilter.RatingDescending:
      orderByClause =
        "ORDER BY (drawRating + appearanceRating + burnRating + aromaRating + tasteRating) / 5 DESC";
      break;
  }

  const searchQuery = `SELECT * FROM ${tableName} WHERE cigarName LIKE ? ${orderByClause} LIMIT ? OFFSET ?;`;
  const searchValue = `%${cigarName}%`;
  console.log(
    `Executing query: ${searchQuery} with searchValue: ${searchValue}, limit: ${limit}, offset: ${offset}`,
  );
  try {
    return await db.getAllAsync(searchQuery, [searchValue, limit, offset]);
  } catch (error) {
    console.error("Error searching items", error);
    throw new Error("Error searching items");
  }
};
