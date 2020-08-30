import React from "react";
import { Link } from "react-router-dom";
import sendAsync from "./db/renderer";

function Book(props) {
   let url = "/book/" + props.data.OID + "/";
   let dateChanged = new Date(props.data.TimeAdd * 1000);

   return (
      <li>
         {props.data.Authors && (
            <span className="author">{props.data.Authors}</span>
         )}
         <Link to={url}>
            <strong>{props.data.Title}</strong>
         </Link>
         {props.data.Subtitle && (
            <span className="subtitle">{props.data.Subtitle} </span>
         )}
         <small>{dateChanged.toLocaleDateString()} | {props.data.OID}</small>
      </li>
   );
}

class Booklist extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         response: [],
      };
   }

   fetchBooklist() {
      let sql = `select *  from Books WHERE Books.OID IN (SELECT ParentID FROM Items)`;
      sendAsync(sql)
         .then((rows) => {
            rows.forEach((current_book) => {
               let originalTitle = current_book.Title.split(":");

               current_book.Title = originalTitle.shift();

               if (originalTitle[0]) {
                  current_book.Subtitle = originalTitle.join(":").trim();
               }
            });

            this.setState({
               response: rows,
            });
         })
         .catch((err) => {
            throw err;
         });
   }
   componentDidMount() {
      this.fetchBooklist();
   }

   render() {
      let booklist = this.state.response.map((book, i) => (
         <Book data={book} key={i}></Book>
      ));

      return (
         <div className="container">
            <ul>{booklist}</ul>
         </div>
      );
   }
}

export default Booklist;
