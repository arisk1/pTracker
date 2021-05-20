import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import Home from './components/Home/homepage.js'
import Profile from './components/Profile/Profile';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import AuthState from './context/auth/AuthState';
import CurrencyState from './context/currency/CurrencyState';
import PrivateRoute from './components/routing/PrivateRoute';
import NotFound from './components/NotFound/NotFound';
import Heatmap from './components/Heatmap/Heatmap';
import Converter from './components/Tools/Converter';


function App() {
    return (
        <CurrencyState>
        <AuthState>
        <Router >
            <div className="App">
            <Header/>
                <Container>
                    <Switch >
                        <Route exact path="/" component={Home}></Route>
                        <Route exact path="/heatmap" component={Heatmap}></Route>
                        <Route exact path="/converter" component={Converter}></Route>
                        <PrivateRoute exact path="/profile" component={Profile}></PrivateRoute>
                        <Route component={NotFound} />
                    </Switch>
                </Container>
                <Footer/>
            </div>
        </Router>
        </AuthState>
        </CurrencyState>
    );
}

export default App;
