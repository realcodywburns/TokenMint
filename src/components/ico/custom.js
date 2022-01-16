import React from 'react';
import { Card } from 'react-bootstrap';
import customImg from '../../img/custom-ico.png';

export const CustomHead = (props) => {
    const { name, symbol, icon, blerb } = props;

    return ( 
      <Card>
        <Card.Left align="top">
          {icon && <img width={200} height={200} src={icon} alt={name} />}
          {!icon && <img width={200} height={200} src={customImg} alt={name} />}
        </Card.Left>
        <Card.Body>
          <Card.Heading>
            <Card.Text>{name}
              &nbsp; <small>({symbol})</small>
            </Card.Text> 
          </Card.Heading>
          <div dangerouslySetInnerHTML={{ __html: blerb }} />
        </Card.Body>
      </Card>
      )
  };

export const CustomAbout = (props) => {

  return(
      <p></p>
    )
}