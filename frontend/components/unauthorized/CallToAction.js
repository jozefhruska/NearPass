import React from 'react'

const CallAction = ({onLoginPress}) => {
  return (
    <div className="call-to-action-wrapper call-to-action text-white-wrapper  ptb--120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="inner text-center">
              <span>READY TO DO THIS?</span>
              <h2>Let's get started</h2>
              <a className="rn-button-style--2" onClick={onLoginPress}><span>Sign up</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CallAction;
