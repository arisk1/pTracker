import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import Home from './components/Home/homepage.js'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import AuthState from './context/auth/AuthState';
import CurrecnyState from './context/currency/CurrencyState';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token) {
    setAuthToken(localStorage.token)
  }

function App() {
    return (
        <CurrecnyState>
        <AuthState>
        <Router >
            <div className="App">
            <Header/>
                <Container>
                    <Switch >
                        {/* <Route exact path="/" component={Home}></Route> */}
                    </Switch>
                </Container>
                <Footer/>
            </div>
        </Router>
        </AuthState>
        </CurrecnyState>
    );
}

export default App;
