import React from 'react';
import AnswerListEntry from './AnswerListEntry.jsx';
import MostHelpfulAnswer from './MostHelpfulAnswer.jsx';

function AnswerList({
  date,
  answers,
  onClick,
  questionId,
  showAnswerModal,
  collapseAnswers,
  moreAnswersClicked,
  userWantsMoreAnswers,
  reportAnswer,
  state,
  updateAnswerHelpfulness
}) {


  let orderedAnswers = Object.values(answers).sort((a, b) => {
    if (b.helpfulness < a.helpfulness) {
      return -1;
    } else if (a.helpfulness < b.helpfulness){
      return 1;
    } else {
      return 0;
    }
  });

  let mostHelpful = orderedAnswers[0];
  orderedAnswers.shift();

  let i = 1;

  const renderHelper = orderedAnswers.map((answer) => {
    if (i > 0) {
      i--;
      return (
        <div className="qa-answer-entry">
          <AnswerListEntry showAnswerModal={showAnswerModal} answer={answer} key={answer.id} date={date} reportAnswer={reportAnswer} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness} />
        </div>
      );
    }
  });

  if (Object.values(answers).length === 0) {
    return <div />;
  }

  if (Object.values(answers).length === 1 || Object.values(answers).length === 2) {
    return (
    <div>
      <MostHelpfulAnswer showAnswerModal={showAnswerModal} answer={mostHelpful} key={mostHelpful.id} date={date} reportAnswer={reportAnswer} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness}/>
      {renderHelper}
    </div>
    )
  }

  if (
    userWantsMoreAnswers(questionId) === false
    || userWantsMoreAnswers(questionId) === undefined
  ) {
    return (
      <div className="qa-answer-entry">
        <MostHelpfulAnswer showAnswerModal={showAnswerModal} answer={mostHelpful} key={mostHelpful.id} date={date} reportAnswer={reportAnswer} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness}/>
        {renderHelper}
        <a className="qa-al-load-more-button"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            moreAnswersClicked(questionId);
          }}
        >
          LOAD MORE ANSWERS
        </a>
      </div>
    );
  }

  return (
    <div>
      <MostHelpfulAnswer answer={mostHelpful} key={mostHelpful.id} date={date} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness}/>
      {orderedAnswers.map((answer) => (
        <div className="qa-answer-entry">

          <AnswerListEntry answer={answer} key={answer.id} date={date} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness}/>
        </div>
      ))}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          collapseAnswers(questionId);
        }}
      >
        COLLAPSE ANSWERS
      </a>
    </div>
  );
}

export default AnswerList;
