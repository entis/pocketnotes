import React from "react";
import "./App.css";
import Booklist from "./Booklist";
import Bookdetail from "./Bookdetail";
import { Switch, Route } from "react-router-dom";

function App() {
   return (
      <div className="App">
         <Switch>
            <Route path="/book/:id" component={Bookdetail}/>
            <Route path="/">
               <h1>Books</h1>
               <Booklist/>
            </Route>
         </Switch>
      </div>
   );
}

export default App;
