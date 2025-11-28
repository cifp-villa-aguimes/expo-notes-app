export { closeDatabase, getDatabase, initDatabase } from "./db";
export { noteEntityToNote, noteToEntity } from "./mappers";
export { notesDao } from "./notesDao";
export {
  CREATE_INDEX_FAVORITE,
  CREATE_INDEX_UPDATED_AT,
  CREATE_NOTES_TABLE,
  DATABASE_NAME,
  DATABASE_VERSION,
  INIT_STATEMENTS,
} from "./schema";
