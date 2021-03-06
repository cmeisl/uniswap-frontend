import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { Web3Connect, startWatching, initialize } from '../ducks/web3connect';
import { setAddresses } from '../ducks/addresses';
import Header from '../components/Header';
import Swap from './Swap';
import Send from './Send';
import Pool from './Pool';

import './App.scss';
import { getAssist } from '../libraries/assist';

class App extends Component {
  componentWillMount() {
    const { initialize, startWatching} = this.props;
    initialize().then(() => {
      if (this.props.web3) {
        console.log('calling start watchinh=g')
        startWatching()
      }

      getAssist(this.props.web3)
    }).catch(console.log);
  };

  componentWillUpdate() {
    const { web3, setAddresses } = this.props;

    if (this.hasSetNetworkId || !web3 || !web3.eth || !web3.eth.net || !web3.eth.net.getId) {
      return;
    }

    web3.eth.net.getId((err, networkId) => {
      if (!err && !this.hasSetNetworkId) {
        setAddresses(networkId);
        this.hasSetNetworkId = true;
      }
    });
  }

  render() {
    // if (!this.props.initialized) {
    //   return <noscript />;
    // }

    return (
      <div id="app-container">
        <MediaQuery query="(min-width: 768px)">
          <Header />
        </MediaQuery>
        <Web3Connect />
        <BrowserRouter>
          <Switch>
            <div className="app__wrapper">
              <Route exact path="/swap" component={Swap} />
              <Route exact path="/send" component={Send} />
              <Route exact path="/add-liquidity" component={Pool} />
              <Route exact path="/remove-liquidity" component={Pool} />
              <Route exact path="/create-exchange/:tokenAddress?" component={Pool} />
              <Redirect exact from="/" to="/swap" />
            </div>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(
  state => ({
    account: state.web3connect.account,
    initialized: state.web3connect.initialized,
    web3: state.web3connect.web3,
  }),
  dispatch => ({
    setAddresses: networkId => dispatch(setAddresses(networkId)),
    initialize: () => dispatch(initialize()),
    startWatching: () => dispatch(startWatching()),
  }),
)(App);
