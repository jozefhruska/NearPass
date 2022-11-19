import React ,{ Component }from "react";
import { FiCast , FiLayers , FiUsers , FiMonitor } from 'react-icons/fi';
import { IoWalletOutline, IoLockClosedOutline, IoLockOpenOutline, IoSaveOutline, IoIosSend, FaFileContract, HiOutlineDownload, GiGlassCelebration } from 'react-icons/all';

const ServiceList = [
  {
    icon: <IoWalletOutline />,
    title: '1',
    description: 'Create or log in with your wallet.'
  },
  {
    icon: <IoLockClosedOutline />,
    title: '2',
    description: 'Set up your secure passphrase - it will be used to encrypt your password records.'
  },
  {
    icon: <IoSaveOutline />,
    title: '3',
    description: 'You can now safely save your first password record in the smart contract (on blockchain). '
  },
  {
    icon: <FiLayers />,
    title: '4',
    description: 'Your password (and related metadata, i.e. username) is encrypted on your computer with your passphrase (using AES-256 encryption).'
  },
  {
    icon: <IoIosSend />,
    title: '5',
    description: 'Encrypted password (and metadata) is then send to webservice which further encrypts this passwords using AES-256 encryption with different key to protect users from weak passphrases.'
  },
  {
    icon: <FaFileContract />,
    title: '6',
    description: 'After your password record is encrypted twice it is then send to be saved in the smart contract.'
  },
  {
    icon: <HiOutlineDownload />,
    title: '7',
    description: 'App requests the data from smart contract\'s state. In the response, we receive all your passwords with metadata safely encrypted.'
  },
  {
    icon: <IoIosSend />,
    title: '8',
    description: 'We send these passwords to be decrypted by the webservice which has securely stored AES-256 key specific to your account.'
  },
  {
    icon: <IoLockOpenOutline />,
    title: '9',
    description: 'After the data is decrypted by the webservice, we finally decrypt the data using your custom passphrase.'
  },
]


class PropertiesList extends Component{
  render(){
    const firstSection = ServiceList.slice(0 , 3);
    const secondSection = ServiceList.slice(3 , 6);
    const thirdSection = ServiceList.slice(6 , 9);
    const getSectionLayout = (val, i) => (
      <div className="col-lg-4 col-md-6 col-sm-6 col-12 text-center" key={i}>
        <div className="service service__style--2">
          <div className="icon">
            {val.icon}
          </div>
          <div className="content">
            <h3 className="title">{val.title}</h3>
            <p>{val.description}</p>
          </div>
        </div>
      </div>
    )
    return(
      <React.Fragment>
        <h3>
          Getting Started:
        </h3>
        <div className="row">
          {firstSection.map( (val , i) => (getSectionLayout(val, i)))}
        </div>
        <h3>
          Keeping your data secured:
        </h3>
        <div className="row">
          {secondSection.map( (val , i) => (getSectionLayout(val, i)))}
        </div>
        <h3>
          Decrypting the data:
        </h3>
        <div className="row">
          {thirdSection.map( (val , i) => (getSectionLayout(val, i)))}
        </div>
      </React.Fragment>
    )
  }
}
export default PropertiesList;
