const { ipcMain } = require("electron");
const sqlite3 = require("sqlite3").verbose();

const database = new sqlite3.Database(
   "G:/system/config/books.db",
   sqlite3.OPEN_READONLY,
   (err) => {
      if (err) console.error("Database opening error: ", err);

      console.log("Connected to the books database.");
   }
);

ipcMain.on("asynchronous-message", (event, sql) => {
   database.all(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
         event.reply("asynchronous-reply", rows);
      }
   });
});
