import React from 'react';
import { Image } from '@nextui-org/react';
import LogoLight from '../../assets/images/logo/logo-white.svg';
export default ({onLoginPress}) => {
  return (
    <header className={`header-area formobile-menu header--transparent color-white`}>
      <div className="header-wrapper" id="header-wrapper">
        <div className="header-left">
          <div className="logo">
            <a href="/">
              <Image
                src={LogoLight}
                alt="Logo image"
                width={183}
              />
            </a>
          </div>
        </div>
        <div className="header-right">
          <nav className="mainmenunav d-lg-block">
            <ul className="mainmenu">
              <li>
                <a onClick={onLoginPress}>
                  Login
                </a>
              </li>
            </ul>
          </nav>
          <div className="header-btn">
            <a className="rn-btn" onClick={onLoginPress}>
              <span onClick={onLoginPress}>sign up</span>
            </a>
          </div>
          {/* Start Humberger Menu  */}
          <div className="humberger-menu d-block d-lg-none pl--20">
            <a className="rn-btn" onClick={onLoginPress}>
              <span>sign up</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
