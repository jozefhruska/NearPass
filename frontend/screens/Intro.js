import React from 'react';
import ScrollToTop from 'react-scroll-up';
import { Image } from '@nextui-org/react';
import Header from '../components/unauthorized/Header';
import PropertiesList from '../components/unauthorized/PropertiesList';
import AboutImage from '../assets/images/about/about.png';
import Tabs from '../components/unauthorized/Tabs';
import { FiChevronUp } from 'react-icons/all';
import CallAction from '../components/unauthorized/CallToAction';
import Footer from '../components/unauthorized/Footer';

export default ({ onLoginPress }) => {
  return (
    <div>
      <Header onLoginPress={onLoginPress} />
      <div className="slider-wrapper color-white">
        <div className={`slide slide-style-2 fullscreen d-flex align-items-center justify-content-center bg_image bg_image--2`} data-black-overlay="2">
          <div className="container container-lg">
            <div className="row">
              <div className="col-lg-12">
                <div className={`inner text-center`}>
                  <h1 className="title">
                    NearPass
                  </h1>
                  <p className="description">
                    Decentralized password manager. <br />
                    Don't let corporations store & handle your passwords.
                  </p>
                  <div className="slide-btn">
                    <a className="rn-button-style--2 btn-primary-color" onClick={onLoginPress}>
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="service-area pt--120 pb--50 bg_color--1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center service-style--3 mb--30">
                <h2 className="title">How it works?</h2>
                <p>
                  Even though there are a lot of steps, keep in mind that it all happens under the hood and the entire process to encrypt and decrypt usually takes just a couple of seconds.
                </p>
              </div>
            </div>
          </div>
          <PropertiesList />
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            After that you can access your password records 🎉
          </p>
        </div>
      </div>


      <div className="about-area ptb--120 bg_image bg_image--1">
        <div className="about-wrapper">
          <div className="container">
            <div className="row row--35">
              <div className="col-lg-5" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="thumbnail">
                  <Image
                    src={AboutImage}
                    alt="About us image"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <div className="about-inner inner">
                  <div className="section-title">
                    <h2 className="title">About NearPass</h2>
                    <p className="description">
                      This project started because in this digital age you just need too many passwords to keep track of. This usually leads to having just one complex password, so if this password gets compromised you need to change it everywhere. Other option is to use password managers, which are usually developed by large companies and you have to trust your data to their servers.
                    </p>
                  </div>
                  <div className="row mt--30">
                    <Tabs />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CallAction onLoginPress={onLoginPress} />
      <div className="backto-top">
        <ScrollToTop showUnder={160}>
          <FiChevronUp />
        </ScrollToTop>
      </div>
      <Footer />
    </div>
  );
}
