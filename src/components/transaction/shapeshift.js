import React from 'react';
import { connect } from 'react-redux';
import { FormGroup, FormControl, ControlLabel, DropdownButton, Button } from 'react-bootstrap';
import { Grid, Panel, MenuItem } from 'react-bootstrap';
import { loadSSCoins, getMarketData } from '../../store/ssActions';

class RenderSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount = () => {
        this.props.dispatch(loadSSCoins());
    }

    render() {
        return (
            <Grid>
            <DropdownButton 
                bsStyle="success"
                title="PAY WITH BTC">
                <MenuItem eventKey="1" onClick={getMarketData}>coin.symbol</MenuItem>
            </DropdownButton>
            <FormGroup controlId="returnAddress" >
            <ControlLabel>Return Address (for refunds)</ControlLabel>
            <FormControl type="text"/>
            </FormGroup>
            {/* this should be a modal
            
            <Panel header="Pay with BLAH">
                    <div>Deposit Limit: {{marketData.limit}}</div>
                    <div>Minimum Amount: {{marketData.minimum}}</div>
                    <div>MinerFee: {{marketData.minerFee}}</div>
                    <div>Rate: {{marketData.rate}}</div>
                    <Button 
                      bsStyle="primary"
                      onClick={ShiftIt} >
                      ACCEPT
                    </Button>
            </Panel>*/}
          </Grid>

        );

    }
}

const ShapeShift = connect(
    (state, ownProps) => {

    },
    (dispatch, ownProps) => ({
      dispatch,

    })
)(RenderSS);

export default ShapeShift;