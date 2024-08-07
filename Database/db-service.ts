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
        image TEXT,
        blend TEXT,
        visualNotes TEXT,
        coldDraw TEXT,
        firstThird TEXT,
        secondThird TEXT,
        lastThird TEXT,
        smokingDuration TEXT,
        construction TEXT,
        formType TEXT);
  `);
};

export const insertCigarItem = async (
  db: SQLite.SQLiteDatabase,
  item: cigarItem,
) => {
  const insertQuery = `INSERT INTO ${tableName} (cigarName, drawRating, appearanceRating, burnRating, aromaRating, tasteRating, smokeTime, review, image, blend, visualNotes, coldDraw, firstThird, secondThird, lastThird, smokingDuration, construction, formType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
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
    item.blend,
    item.visualNotes,
    item.coldDraw,
    item.firstThird,
    item.secondThird,
    item.lastThird,
    item.smokingDuration,
    item.construction,
    item.formType,
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
  const updateQuery = `UPDATE ${tableName} SET cigarName = ?, drawRating = ?, appearanceRating = ?, burnRating = ?, aromaRating = ?, tasteRating = ?, smokeTime = ?, review = ?, image = ?, blend = ?, visualNotes = ?, coldDraw = ?, firstThird = ?, secondThird = ?, lastThird = ?, smokingDuration = ?, construction = ?, formType = ? WHERE id = ?;`;
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
    item.blend,
    item.visualNotes,
    item.coldDraw,
    item.firstThird,
    item.secondThird,
    item.lastThird,
    item.smokingDuration,
    item.construction,
    item.formType,
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

export const fetchRecentCigarItems = async (db: SQLite.SQLiteDatabase) => {
  const fetchQuery = `SELECT * FROM ${tableName} ORDER BY id DESC;`;
  console.log(`Executing query: ${fetchQuery}`);
  try {
    return await db.getAllAsync(fetchQuery);
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
) => {
  let orderByClause = "ORDER BY id DESC";

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
    `Executing query: ${searchQuery} with searchValue: ${searchValue}`,
  );
  try {
    return await db.getAllAsync(searchQuery, [searchValue]);
  } catch (error) {
    console.error("Error searching items", error);
    throw new Error("Error searching items");
  }
};
