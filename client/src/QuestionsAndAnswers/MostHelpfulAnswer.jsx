import React from 'react';
import ReportedAnswerButton from './ReportedAnswerButton.jsx';
import HelpfulAnswer from './HelpfulAnswer.jsx';
import AnswerEntryPhotos from './AnswerEntryPhotos.jsx';

const MostHelpfulAnswer = function ({ answer, date, reportAnswer, state, updateAnswerHelpfulness={updateAnswerHelpfulness}}) {
  return (
    <div>
      <span  className="qa-helpful-body"> <span id="qa-answerlist-title">A:</span> {' ' + answer.body}</span>
      <div className="qa-mosthelpful-footer">
            by
            {` ${  answer.answerer_name}`}
,{` ${date(answer.date)} | `}
            <span>
             <HelpfulAnswer answer={answer} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness}/>
              <ReportedAnswerButton answer={answer} reportAnswer={reportAnswer} state={state}/>
            </span>
          </div>
          <AnswerEntryPhotos photos={answer.photos}/>
      </div>

  );
};

export default MostHelpfulAnswer;