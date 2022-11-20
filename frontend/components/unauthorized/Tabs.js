import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FiCheck } from "react-icons/fi";
import { IoLockClosedOutline, IoLockOpenOutline } from 'react-icons/all';

class TabsOne extends Component{
  render(){
    const tab1 = "Our Solution";
    const tab2 = "Future Plans";
    const tab3 = "What is saved in the smart contract?";
    const namesItemOne = [
      'Security',
      'Look and feel of Web2 while being powered by Web3',
      'Easy to use and understand',
      'Onboard users not familiar with blockchain to Web3',
    ];
    const namesItemTwo = [
      'Implement browser extension to automatically save & prefill passwords',
      'Implement mobile application so users can access their passwords on the go',
      'Allow users to customize their security settings',
      'Enable saving of other data, i.e. credit card information',
    ];
    const namesItemThree = [
      'Password name - your custom name for the password',
      'Username - username or email you use for logging in.',
      'Password',
      'Link - URL where you can use this password record',
      'Index - used to edit / delete password record - only not encrypted entry',
    ];

    return(
      <div>
        <div className="tabs-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <Tabs>
                  <TabList  className="tab-style--1">
                    <Tab>{tab1}</Tab>
                    <Tab>{tab2}</Tab>
                    <Tab>{tab3}</Tab>
                  </TabList>

                  <TabPanel>
                    <div className="single-tab-content">
                      <p>
                        Because of this we implemented NearPass - decentralized password manager. Main priority was to safely store user data, with as little interaction with services other than the smart contract itself.
                      </p>
                      <div className="mt--30">
                        <h4>Main goals during development:</h4>
                        <ul className="list-style--1">
                          {namesItemOne.map((name, index) => {
                            return <li key={ index }><FiCheck /> {name}</li>;
                          })}
                        </ul>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="single-tab-content">
                      <div>
                        <h4>Next milestones:</h4>
                        <ul className="list-style--1">
                          {namesItemTwo.map((name, index) => {
                            return <li key={ index }><FiCheck /> {name}</li>;
                          })}
                        </ul>
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="single-tab-content">
                      <p>
                        When user starts saving passwords in the smart contract, there are generally two types of data that will be saved:
                      </p>
                      <p>
                        a) Unencrypted data - user's prepaid storage (how many password records can be stored in the smart contract for the user)
                      </p>
                      <p>
                        b) Encrypted data - password records (in the future we plan to add other data you would like to securely store).
                      </p>
                      <div className="mt--30">
                        <h4>Password record contains:</h4>
                        <ul className="list-style--1">
                          {namesItemThree.map((name, index) => {
                            return (
                              <li key={ index }>
                                {
                                  (index) === (namesItemThree.length - 1)
                                    ? <><IoLockOpenOutline /> {name}</>
                                    : <><IoLockClosedOutline /> {name}</>
                                }
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </TabPanel>

                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default TabsOne;
