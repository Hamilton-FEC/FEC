import React from 'react';
import AnswerModalImages from './AnswerModalImages.jsx';

const AnswerModal = function ({
  addAnswerPhotos,
  show,
  state,
  productName,
  onChange,
  onClick,
  verifyForm,
  resetForm,
  imageClose,
}) {
  const style = {
    background: document.getElementById('bod').style.background,
    color: document.getElementById('bod').style.color,
    overflow: document.getElementById('bod').overflow,
  };

  if (!show) {
    return null;
  }

  return (
    <div className={show ? 'qa-answer-modal-show' : 'qa-answer-modal-hide'} style={style}>
      <form
        className="qa-answer-modal-form"
        onSubmit={(e) => {
          e.preventDefault();
          verifyForm();
        }}
      >
        <h3 className="qa-answer-modal-griditem1">Submit your Answer</h3>
         <h4 className="qa-answer-modal-griditem2">
          About
          {' ' + productName}: {state.questionToBeAnswered}
        </h4>

        <label htmlFor="answerModalTextArea" className={state.answerModalTextAreaValidation === false ? "qa-answer-modal-griditem3-alert": "qa-answer-modal-griditem3"}>
          {state.answerModalTextAreaValidation === false ? (
            <span className="qa-modal-alert-text">You must submit an Answer! </span>
          ) : (
            'Your Answer*'
          )}
        </label>
        <textarea
          name="AnswerModalTextAreaInput"
          className="qa-answer-modal-griditem4"
          value={state.AnswerModalTextAreaInput || ''}
          onChange={onChange}
          maxLength="1000"
          id="qa-answer-modal-textarea"
          rows="10"
          cols="50"
        />
        <label htmlFor="AnswerModalNameInput" className={state.answerModalTextAreaValidation === false ? "qa-answer-modal-griditem5-alert": "qa-answer-modal-griditem5"}>
          {state.answerModalNameValidation
 === false ? (
            <span className="qa-modal-alert-text">You must enter a NickName! </span>
          ) : (
            'Your Nickname*'
          )}
        </label>

        <input
          name="AnswerModalNameInput"
          className="qa-answer-modal-griditem6"
          value={state.AnswerModalNameInput || ''}
          onChange={onChange}
          maxLength="60"
          placeholder="Example: jack543!"
          type="text"
        />
        <div className="qa-answer-modal-griditem7">
          For privacy reasons, do not use your full name or email address
        </div>

        <label htmlFor="AnswerModalEmailInput" className={state.answerModalTextAreaValidation === false ? "qa-answer-modal-griditem8-alert": "qa-answer-modal-griditem8"}>
          {state.answerModalEmailValidation === false ? (
            <span className="qa-modal-alert-text">
              The email address provided is not in correct email format!
            </span>
          ) : (
            'Your Email*'
          )}
        </label>

        <input
          name="AnswerModalEmailInput"
          value={state.AnswerModalEmailInput || ''}
          onChange={onChange}
          type="text"


          placeholder="Example: jack@email.com"
          className="qa-answer-modal-griditem9"
          maxLength="60"
        />
        <div className="qa-answer-modal-griditem10">
          For authentication reasons, you will not be emailed
        </div>


        <AnswerModalImages photos={state.answerModalPhotos} onChange={addAnswerPhotos} imageClose={imageClose}/>

        <input type="submit" className="qa-answer-modal-griditem11" name="submitAnswerModal" />
        <button
          type="button"
          name="closeAnswerModal"
          onClick={(e) => {
            onClick(e);
            resetForm();
          }}
          className="qa-answer-modal-griditem12"
        >X</button>
      </form>
    </div>
  )
}

export default AnswerModal;