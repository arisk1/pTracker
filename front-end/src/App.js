import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import Home from './components/Home/homepage.js'
import {BrowserRouter as Router,Switch, Route,Link} from 'react-router-dom';

function App() {
  return (
    <Router >
      <div className="App"  >
      <Header/>
      <Switch >
              <Route exact path="/" component={Home}></Route>   
      </Switch>
      <Footer />
      </div>
    </Router>
  );
}

export default App;