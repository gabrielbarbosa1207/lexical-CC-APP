import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import App from "./App"

function AppRouter(){

    return(     
        <Router>
            <Routes>
                <Route path="/create" element={ <App /> }/>
            </Routes>
        </Router>
    )
}

export default AppRouter;