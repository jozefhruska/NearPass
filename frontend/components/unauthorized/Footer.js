import React from 'react';
import {FaTwitter ,FaInstagram ,FaFacebookF , FaLinkedinIn} from "react-icons/fa";
import { Image } from '@nextui-org/react';
import Logo from '../../assets/images/logo/logo-white.svg';

const SocialShare = [
  {Social: <FaInstagram /> , link: 'https://www.instagram.com/nearpassmanager/'},
  {Social: <FaTwitter /> , link: 'https://twitter.com/nearpassmanager'},
]

const Footer = () => {
  return (
    <div className="footer-style-2 ptb--30 bg_image bg_image--1" data-black-overlay="6">
      <div className="wrapper plr--50 plr_sm--20">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="inner">
              <div className="logo text-center text-sm-left mb_sm--20" style={{ display: 'flex' }}>
                <a href="/">
                  <Image
                    src={Logo}
                    alt="Logo image"
                    width={183}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="inner text-center">
              <ul className="social-share rn-lg-size d-flex justify-content-center liststyle">
                {SocialShare.map((val , i) => (
                  <li key={i}><a href={`${val.link}`} target="_blank">{val.Social}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 col-12">
            <div className="inner text-lg-right text-center mt_md--20 mt_sm--20">
              <div className="text">
                <p>Made with {'<'}3 by Oliver</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Footer;
