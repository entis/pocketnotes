export function deleteBook(itemId) {
   if (window.confirm(`Delete book ${itemId}?`)) {

      return fetch(`http://localhost:8000/delete/${itemId}/`, {
         method: 'delete'
      })
         .then(response => {
            console.log(response)

            if (window.location.pathname === "/") {
               window.location.reload();
            } else {
               window.location = "/";
            }
         })
   }
}
