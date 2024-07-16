import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
import { cigarItem } from "./models";

const tableName = "cigarData";

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: "cigar-data.db", location: "default" });
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        value TEXT NOT NULL
    );`;

  await db.executeSql(query);
};
