import React from 'react';
import { Row, Col, Carousel, Panel } from 'react-bootstrap';
import coin1 from '../../img/HotCoin/1.jpg';
import coin2 from '../../img/HotCoin/2.jpg';
import coin3 from '../../img/HotCoin/3.jpg';
import coin4 from '../../img/HotCoin/4.jpg';
import {getETC, icoCount} from '../../lib/counter.js';
export const Information = (props) => {
console.log(getETC);
    return (
      <Row>
        <Col sm={12}>
         <div className="col-md-3 col-sm-3 col-xs-6">
            <div className="alert alert-info back-widget-set text-center">
              <i className="fa fa-history fa-5x"></i>
              <h3>{getETC.length} <i className="fa fa-dot-circle-o"></i></h3>
              Tokens Minted (ETC)
            </div>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-6">
            <div className="alert alert-success back-widget-set text-center">
              <i className="fa fa-bars fa-5x"></i>
              <h3> {icoCount.length} </h3>
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
                  <img width={900} height={500} alt="900x500" src={coin1}/>
                </Carousel.Item>
                <Carousel.Item>
                  <img width={900} height={500} alt="900x500" src={coin2}/>
                </Carousel.Item>
                <Carousel.Item>
                  <img width={900} height={500} alt="900x500" src={coin3}/>
                </Carousel.Item>
                <Carousel.Item>
                  <img width={900} height={500} alt="900x500" src={coin4}/>
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

      </Row>
    );
};
