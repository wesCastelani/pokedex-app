import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-nd navbar-dark bg-dark fixed-top">
          <Link
            to="/"
            className="navbar-brand col-sm-3 col-md-2 mr-0 align-items-center"
          >
            Pokedex
          </Link>
        </nav>
      </div>
    );
  }
}
