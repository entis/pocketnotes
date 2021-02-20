import React from 'react'
import { Link } from 'react-router-dom'
import { deleteBook } from './Utils.js'

class Bookdetail extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         highlights: [],
         bookData: [],
      }
   }

   fetchNotes() {
      let bookId = this.props.match.params.id

      fetch(`http://localhost:8000/book/${bookId}`)
         .then(response => response.json())
         .then((rows) => {

            this.setState({
               highlights: rows[0],
               bookData: rows[1],
               tags: rows[2],
            })
         })
   }

   componentDidMount() {
      this.fetchNotes()
   }

   render() {
      let highlights = this.state.highlights
      let tags = this.state.highlights
      let bookData = this.state.bookData[0] ? this.state.bookData[0] : {}

      return (
         <div className="container">
            <h1>
               {bookData.Title} <small>{bookData.Authors}</small>
            </h1>
            <p className="text-center">
               <Link to="/">Back</Link>
            </p>
            <p className="text-center">
               <button onClick={function() { deleteBook(bookData.OID)}}>delete {bookData.OID}</button>
            </p>
            {highlights.map((note, i) => {
               return <p key={i}>{note.Text}</p>
            })}
         </div>
      )
   }
}

export default Bookdetail
