import React from 'react';
import { connect } from 'react-redux';

import CreateToken from './tokens/create';

const Render = ({ screen, screenItem }) => {

    if (screen === null) {
        return <div>
            <i className="fa fa-spinner fa-spin fa-2x" /> Initializing...
        </div>;
    } else if (screen === 'home') {
        return <div>
            <CreateToken/>
        </div>
    }

    return (
        <div>
            Unknown screen
        </div>
    );
};

const Screen = connect(
    (state, ownProps) => ({
        screen: state.screen.get('screen'),
        screenItem: state.screen.get('item'),
    }),
    (dispatch, ownProps) => ({})
)(Render);

export default Screen;
