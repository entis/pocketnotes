import React from "react";
import { Link } from "react-router-dom";
import sendAsync from "./renderer";

class Bookdetail extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         highlights: [],
         bookData: [],
      };
   }

   fetchNotes() {
      let bookId = this.props.match.params.id;

      let highlight_sql = `select json_extract(Highlight, '$.text') as Text
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
                                 -- Vybere všechny objekty s citacemi
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
            where OID = ${bookId};`;

      sendAsync(highlight_sql)
         .then((rows) => {
            /*  rows.forEach((element) => {
            element.Text = element.Text.replace(/\u2029/g, "<br>");
         }); */

            this.setState({
               highlights: rows,
            });
         })
         .then(() => sendAsync(`select *  from Books where OID = ${bookId}`))
         .then((data) => {
            this.setState({
               bookData: data,
            });
         });
   }

   componentDidMount() {
      this.fetchNotes();
   }

   render() {
      let highlights = this.state.highlights;

      let bookData = this.state.bookData[0] ? this.state.bookData[0] : {};

      return (
         <div className="container">
            <h1>
               {bookData.Title} <small>{bookData.Authors}</small>
            </h1>
            <p className="text-center">
               <Link to="/">Back</Link>
            </p>
            <ul>
               {highlights.map((note, i) => {
                  return <p key={i}>{note.Text}</p>;
               })}
            </ul>
         </div>
      );
   }
}

export default Bookdetail;
