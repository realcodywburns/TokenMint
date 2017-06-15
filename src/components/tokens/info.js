import React from 'react';
import { Row, Col, Carousel, Panel } from 'react-bootstrap';
import { welcome } from './welcome';


export const Information = (props) => {

    return (
      <Row>
        <Col sm={12}>
         <div className="col-md-3 col-sm-3 col-xs-6">
            <div className="alert alert-info back-widget-set text-center">
              <i className="fa fa-history fa-5x"></i>
              <h3>0 <i className="fa fa-dot-circle-o"></i></h3>
              Tokens Minted (ETC)
            </div>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-6">
            <div className="alert alert-success back-widget-set text-center">
              <i className="fa fa-bars fa-5x"></i>
              <h3> 0 </h3>
              Live Crowdsales (ETC)
            </div>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-6">
            <div className="alert alert-warning back-widget-set text-center">
              <i className="fa fa-exchange fa-5x"></i>
              <h3>0 </h3>
              Tokens Minted (ETH)
            </div>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-6">
            <div className="alert alert-success back-widget-set text-center">
              <i className="fa fa fa-users fa-5x"></i>
              <h3>0 </h3>
              Live Crowdsales (ETH)
            </div>
          </div>
        </Col>
        <Col sm={8}>
             <Carousel>
                <Carousel.Item>
                  <img width={900} height={500} alt="900x500" src={process.env.PUBLIC_URL + "img/hotcoin/1.jpg"}/>
                </Carousel.Item>
                <Carousel.Item>
                  <img width={900} height={500} alt="900x500" src={process.env.PUBLIC_URL + "img/hotcoin/2.jpg"}/>
                </Carousel.Item>
                <Carousel.Item>
                  <img width={900} height={500} alt="900x500" src={process.env.PUBLIC_URL + "img/hotcoin/3.jpg"}/>
                </Carousel.Item>
              </Carousel>
            </Col>
            <Col sm = {4}>
            <Panel header={"Events"} bsStyle="primary">
            <div>
              <Panel footer="Token Minter | Time 2:00 pm at 25th july" bsStyle="success">

              Greg Coin Minted!
              </Panel>
            </div>
            <div>
              <Panel footer=" CrowdSale | Time 2:00 pm at 25th july" bsStyle="info">

              DontPanic Coin launched a crowdsale!
            </Panel>
            </div>
            </Panel>
        </Col>

        <Col sm ={12}>
        <div>
          <welcome />
          </div>
        </Col>
          </Row>
    );
};
