import React from 'react';
import { NavLink } from 'react-router-dom';
const NAV = ['Objects,', 'Interview,', 'Contact'];

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <NavLink to="/">WAKAWAKA, ©2024</NavLink>
      </div>
      <nav className="header__nav">
        <ul>
          {NAV.map((item, index) => (
            <li key={index}>
              <NavLink to="/" className="navLink">
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="header__right">
        <span>Collection N01</span>
      </div>
    </header>
  );
}

export default Header;
