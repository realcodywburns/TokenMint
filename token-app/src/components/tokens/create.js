import React from 'react';
import { connect } from 'react-redux';

const Render = () => (
    <div>
        Tokens
    </div>
    )

const CreateToken = connect(
    (state, ownProps) => ({
        initialValues: {
        },
    }),
    (dispatch, ownProps) => ({

    })
)(Render);


export default CreateToken;
