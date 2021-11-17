import React, {useEffect} from "react";
import superagent from 'superagent';
import { closeModal } from "../../actions/modal_actions";
import { connect } from "react-redux";
import LoginFormContainer from "../session/login_form_container";
import SignupFormContainer from "../session/signup_form_container";

function Modal({ modal, closeModal }) {
  // useEffect( () => {
  //   const gitInterval = setInterval(() => {
  //     superagent
  //       .get('/version')
  //       .then(res => console.log(res.gitCommit))
  //   }, 5000);

  //   return (() => clearInterval(gitInterval));
  // }, [])

  if (!modal) {
    return null;
  }
  let component;
  switch (modal) {
    case "login":
      component = <LoginFormContainer />;
      break;
    case "signup":
      component = <SignupFormContainer />;
      break;
    default:
      return null;
  }
  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-child" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close-container">
          <div className="modal-close" onClick={closeModal}>
            x
          </div>
        </div>
        {component}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    modal: state.ui.modal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(closeModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
