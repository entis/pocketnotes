const express = require('express')
//const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(
   //'../books.db',
   'D://system/config/books.db',
   (err) => {
      if (err) console.error('Database opening error: ', err)

      console.log('Connected to the books database.')
   }
)

app.use(cors())

app.get('/booklist/', (req, res) => {
   let sql = `select *
              from Books`

   db.all(sql, (err, rows) => {
      if (err) {
         console.log(err)
      } else {
         res.send(rows)
      }
   })
})

app.get('/book/:bookId/', (req, res) => {
   let bookId = req.params.bookId

   const fetchNotes = new Promise((resolve, reject) => {
      let sql = `select json_extract(Highlight, '$.text') as Text
         from
            Books
            inner join (
                  select
                     OID as BookID,
                     Highlight
                  from
                     Items
                     inner join (
                        select
                              ParentID,
                              Highlight
                        from
                              Items
                              inner join (
                                 select
                                    ItemID,
                                    Val as Highlight
                                 from
                                    Tags
                                 where
                                    TagID = 104
                                    and Val <> '{"text":"Bookmark"}'
                              ) as Highlights on Highlights.ItemID = OID
                     ) as Highlights on Highlights.ParentID = OID
            ) as Highlights on BookID = OID
            where OID = ${bookId};`

      db.all(sql, (err, rows) => {
         if (err) {
            reject(err)
         } else {
            resolve(rows)
         }
      })
   })

   const fetchBookData = new Promise((resolve, reject) => {
      let sql = `select *  from Books where OID = ${bookId}`

      db.all(sql, (err, rows) => {
         if (err) {
            reject(err)
         } else {
            resolve(rows)
         }
      })
   })

   const fetchBookTags = new Promise((resolve, reject) => {
      let sql = `select *  from Tags where ItemID = ${bookId} and TagID != 93 and TagID != 90`

      db.all(sql, (err, rows) => {
         if (err) {
            reject(err)
         } else {
            resolve(rows)
         }
      })
   })

   Promise.all([fetchNotes, fetchBookData, fetchBookTags]).then((values) => {
      res.send(values)
   })
})

app.delete('/delete/:bookId/', (req, res) => {
   let bookId = req.params.bookId

   const deleteFile = new Promise((resolve, reject) => {
      let sql = `delete from Files where BookID = ${bookId}`

      db.all(sql, (err) => {
         if (err) {
            reject(err)
         } else {
            resolve('file deleted')
         }
      })
   })

   const deleteBook = new Promise((resolve, reject) => {
      let sql = `delete from Books where OID = ${bookId}`

      db.all(sql, (err) => {
         if (err) {
            reject(err)
         } else {
            resolve('book deleted')
         }
      })
   })

   const deleteItems = new Promise((resolve, reject) => {
      let sql = `delete from Items where OID = ${bookId} or ParentID = ${bookId}`

      db.all(sql, (err) => {
         if (err) {
            reject(err)
         } else {
            resolve('items deleted')
         }
      })
   })

   const deleteTags = new Promise((resolve, reject) => {
      let sql = `delete from Tags where ItemID = ${bookId}`

      db.all(sql, (err) => {
         if (err) {
            reject(err)
         } else {
            resolve('tags deleted')
         }
      })
   })

   Promise.all([deleteFile, deleteBook, deleteItems, deleteTags]).then((values) => {
      res.send(values)
   })
})

//require('./routes')(app)

app.listen(8000)
console.log('server started')
