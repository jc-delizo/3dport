import React from 'react';
import { socmed } from '../constants';

const Footer = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-10 pb-10">
      {socmed.map((item) => (
        <div key={item.title}>
          <a href={item.newtab_link} target="_blank" rel="noreferrer">
            <img src={item.icon} alt={item.title} width="50" height="50" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default Footer;
