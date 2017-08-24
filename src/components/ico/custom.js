import React from 'react';
import { Media, PageHeader } from 'react-bootstrap';
import customImg from '../../img/custom-ico.png';

export const CustomHead = (props) => {
    const { name, symbol, icon, blerb } = props;

    return ( 
      <Media>
        <Media.Left align="top">
          {icon && <img width={200} height={200} src={icon} alt={name} />}
          {!icon && <img width={200} height={200} src={customImg} alt={name} />}
        </Media.Left>
        <Media.Body>
          <Media.Heading>
            <PageHeader>{name}
              &nbsp; <small>({symbol})</small>
            </PageHeader> 
          </Media.Heading>
          <div dangerouslySetInnerHTML={{ __html: blerb }} />
        </Media.Body>
      </Media>
      )
  };

export const CustomAbout = (props) => {

  return(
      <p></p>
    )
}