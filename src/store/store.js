import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { gotoScreen } from './screenActions';
import screenReducers from './screenReducers';
import walletReducers from './walletReducers';
import transactionReducers from './transactionReducers';

const stateTransformer = (state) => ({
    //tokens: state.tokens.toJS(),
    screen: state.screen.toJS(),
    wallet: state.wallet.toJS(),
    transaction: state.transaction.toJS(),
});

const logger = createLogger({
    stateTransformer,
});

const reducers = {
    screen: screenReducers,
    wallet: walletReducers,
    transaction: transactionReducers,
};


export const store = createStore(
    combineReducers(reducers),
    applyMiddleware(
        thunkMiddleware,
        logger
    )
);

export function start() {
    console.log("start store")
    // store.dispatch(loadTokenList());
    store.dispatch(gotoScreen('home'));
}