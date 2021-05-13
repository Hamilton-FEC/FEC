import React from 'react';
import AnswerEntryPhotos from './AnswerEntryPhotos.jsx';
import ReportedAnswerButton from './ReportedAnswerButton.jsx';
import HelpfulAnswer from './HelpfulAnswer.jsx';


const AnswerListEntry = function ({ answer, date, reportAnswer, state, updateAnswerHelpfulness }) {
  return (
    <div>
      <span className="qa-answer-body"> {answer.body}</span>
      <div className="qa-answer-footer">
            by
            {` ${  answer.answerer_name}`}
,{` ${date(answer.date)} | `}
            <span>
            <HelpfulAnswer answer={answer} state={state} updateAnswerHelpfulness={updateAnswerHelpfulness} />
              <ReportedAnswerButton answer={answer} reportAnswer={reportAnswer} state={state}/>
            </span>
          </div>
          <AnswerEntryPhotos photos={answer.photos}/>
    </div>
  );
};

export default AnswerListEntry;
