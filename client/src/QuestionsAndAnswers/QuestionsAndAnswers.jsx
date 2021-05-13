import React from 'react';
import axios from 'axios';
import QuestionList from './QuestionList.jsx';
import SearchQuestions from './SearchQuestions.jsx';
import ComponentFooter from './ComponentFooter.jsx';
import QuestionModal from './QuestionModal/QuestionModal.jsx';
import AnswerModal from './AnswerModal/AnswerModal.jsx';

class QuestionsAndAnswers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfQuestionsToRender: 4,
      searchBarText: '',
      showQuestionModal: false,
      showAnswerModal: false,
      validQuestionForm: null,
      questionToBeAnswered: null,
      answerModalPhotos: [],
    };

    // BINDINGS

    this.moreAnswersClicked = this.moreAnswersClicked.bind(this);
    this.collapseAnswers = this.collapseAnswers.bind(this);
    this.increaseNumberOfQuestionsToRender = this.increaseNumberOfQuestionsToRender.bind(this);
    this.userWantsMoreAnswers = this.userWantsMoreAnswers.bind(this);
    this.findNumberOfQuestionsToRender = this.findNumberOfQuestionsToRender.bind(this);
    this.onChangeSearchHandler = this.onChangeSearchHandler.bind(this);
    this.sortQuestions = this.sortQuestions.bind(this);
    this.searchQuestions = this.searchQuestions.bind(this);
    this.getFormattedDate = this.getFormattedDate.bind(this);
    this.answerModalClickHandler = this.answerModalClickHandler.bind(this);
    this.questionModalClickHandler = this.questionModalClickHandler.bind(this);
    this.showAnswerModalHandler = this.showAnswerModalHandler.bind(this);
    this.showQuestionModalHandler = this.showQuestionModalHandler.bind(this);
    this.hideAnswerModalHandler = this.hideAnswerModalHandler.bind(this);
    this.hideQuestionModalHandler = this.hideQuestionModalHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    this.verifyQuestionForm = this.verifyQuestionForm.bind(this);
    this.resetQuestionForm = this.resetQuestionForm.bind(this);
    this.submitValidForm = this.submitValidForm.bind(this);
    this.setQuestionBody = this.setQuestionBody.bind(this);
    this.addAnswerPhotos = this.addAnswerPhotos.bind(this);
    this.submitValidAnswerForm = this.submitValidAnswerForm.bind(this);
    this.verifyAnswerForm = this.verifyAnswerForm.bind(this);
    this.resetAnswerForm = this.resetAnswerForm.bind(this);
    this.getAnswers = this.getAnswers.bind(this);
    this.removeAnswerPhoto = this.removeAnswerPhoto.bind(this);
    this.reportAnswer = this.reportAnswer.bind(this);
    this.updateQuestionHelpfulness = this.updateQuestionHelpfulness.bind(this);
    this.updateAnswerHelpfulness = this.updateAnswerHelpfulness.bind(this);
  }

  // REQUESTS

  submitValidForm(questionData) {
    axios
      .post('api/qa/questions', questionData)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.props.getQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  submitValidAnswerForm(answerData) {
    const { questionIdOfQuestionToBeAnswered } = this.state;
    axios.post(`api/qa/questions/${questionIdOfQuestionToBeAnswered}/answers`, answerData)
    .then((response) => {
      this.getAnswers();
      this.props.getQuestions();
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  reportAnswer(answerId) {
    axios.put(`api/qa/answers/${answerId}/report`)
      .then(() => {
        this.setState({
          [`reportedAnswer${answerId}`]: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAnswers() {
    const { questionIdOfQuestionToBeAnswered } = this.state;
    axios
      .get(`api/qa/questions/${questionIdOfQuestionToBeAnswered}/answers?count=50`)
      .then((response) => {
        this.setState({
          answers: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateQuestionHelpfulness(questionId) {
    axios
      .put(`api/qa/questions/${questionId}/helpful`)
      .then(() => {
        this.setState({
          [`answer${questionId}Helpful`]: true,
        });}
      )
      .then(() => {
        this.props.getQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateAnswerHelpfulness(answerId) {
    axios
      .put(`api/qa/answers/${answerId}/helpful`)
      .then(() => {
        this.setState({
          [`answer${answerId}Helpful`]: true,
        });}
      )
      .then(() => {
        this.props.getQuestions()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // HANDLERS

  // ModalImages

  addAnswerPhotos(e) {
    const photos = this.state.answerModalPhotos;

    const file = new File(
      [e.target.files[0]],
      e.target.files[0].name,
      {type: e.target.files[0].type,
      });

    var config = {
      method: 'post',
      url: '/api/images',
      headers: {
        'Content-Type': 'image/png',
        'fileName': e.target.files[0].name,
        'fileType': e.target.files[0].type,
      },
      data : file
    };
    axios(config)
    .then((data)=>{
      let photo = data.data;

      photos.push(photo);
      this.setState({
        answerModalPhotos: photos,
      });
    })
    .catch((e)=>{console.log(e)});


  }

  removeAnswerPhoto(e, photo) {
    const { answerModalPhotos } = this.state;
    const newPhotoArray = answerModalPhotos;
    newPhotoArray.splice(answerModalPhotos.indexOf(photo), 1);
    URL.revokeObjectURL(photo);
    this.setState({
      answerModalPhotos: newPhotoArray,
    });
  }

  setQuestionBody(questionId, questionBody) {
    this.setState({
      questionToBeAnswered: questionBody,
      questionIdOfQuestionToBeAnswered: questionId,
    });
  }

//Forms
  resetAnswerForm() {
    this.setState({
      answerFormNameValidation: true,
      answerFormAnswerValidation: true,
      answerFormEmailValidation: true,
    });
  }

  resetQuestionForm() {
    this.setState({
      questionFormNameValidation: true,
      questionFormQuestionValidation: true,
      questionFormEmailValidation: true,
    });
  }

  verifyAnswerForm() {
    const {
      AnswerModalNameInput,
      AnswerModalTextAreaInput,
      AnswerModalEmailInput,
      answerModalPhotos,
    } = this.state;
    let verified = true;

    if (!AnswerModalNameInput || AnswerModalNameInput === '') {
      verified = false;
      this.setState({
        answerModalNameValidation: false,
      });
    } else {
      this.setState({
        answerModalNameValidation: true,
      });
    }

    if (!AnswerModalTextAreaInput || AnswerModalTextAreaInput === '') {
      verified = false;
      this.setState({
        answerModalTextAreaValidation: false,
      });
    } else {
      this.setState({
        answerModalTextAreaValidation: true,
      });
    }

    const email = AnswerModalEmailInput;

    if (!/\S+@\S+\.\S+/.test(email)) {
      verified = false;
      this.setState({
        answerModalEmailValidation: false,
      });
    } else {
      this.setState({
        answerModalEmailValidation: true,
      });
    }
    if (!verified) {
      return null;
    }

const answerDataToSend = {
  body: AnswerModalTextAreaInput,
  name: AnswerModalNameInput,
  email: AnswerModalEmailInput,
  photos: answerModalPhotos,
};

    this.submitValidAnswerForm(answerDataToSend);

    this.setState({
      AnswerModalEmailInput: '',
      AnswerModalNameInput: '',
      AnswerModalTextAreaInput: '',
      showAnswerModal: false,
    });
  }

  verifyQuestionForm() {
    const {
      QuestionModalTextArea,
      QuestionModalNameInput,
      QuestionModalEmailInput,
    } = this.state;
    let verified = true;

    if (!QuestionModalNameInput || QuestionModalNameInput === '') {
      verified = false;
      this.setState({
        questionFormNameValidation: false,
      });
    } else {
      this.setState({
        questionFormNameValidation: true,
      });
    }

    if (!QuestionModalTextArea || QuestionModalTextArea === '') {
      verified = false;
      this.setState({
        questionFormQuestionValidation: false,
      });
    } else {
      this.setState({
        questionFormQuestionValidation: true,
      });
    }

    const email = QuestionModalEmailInput;

    if (!/\S+@\S+\.\S+/.test(email)) {
      verified = false;
      this.setState({
        questionFormEmailValidation: false,
      });
    } else {
      this.setState({
        questionFormEmailValidation: true,
      });
    }

    if (!verified) {
      return null;
    }

    const formDataToSend = {
      body: QuestionModalTextArea,
      name: QuestionModalNameInput,
      email: QuestionModalEmailInput,
      product_id: parseInt(this.props.selectedProductsQuestions.product_id, 10),
    };

    this.submitValidForm(formDataToSend);

    this.setState({
      QuestionModalEmailInput: '',
      QuestionModalNameInput: '',
      QuestionModalTextArea: '',
      showQuestionModal: false,
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  moreAnswersClicked(id) {
    this.setState({
      [id]: true,
    });
  }

  collapseAnswers(id) {
    this.setState({
      [id]: false,
    });
  }

  userWantsMoreAnswers(id) {
    return this.state[id];
  }

  // QUESTION LIST HANDLERS

  findNumberOfQuestionsToRender() {
    const { selectedProductsQuestions } = this.props;
    const numberOfQuestions = selectedProductsQuestions.results
      ? selectedProductsQuestions.results.length
      : undefined;

    if (numberOfQuestions === undefined) {
      this.setState({
        noProduct: true,
      });
    }

    if (numberOfQuestions < 4) {
      this.setState({
        numberOfQuestionsToRender: numberOfQuestions,
        noProduct: false,
      });
    }
  }

  increaseNumberOfQuestionsToRender() {
    const { numberOfQuestionsToRender } = this.state;
    this.setState({
      numberOfQuestionsToRender: numberOfQuestionsToRender + 2,
    });
  }

  // SEARCH BAR HANDLERS

  onChangeSearchHandler(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        this.searchQuestions();
      },
    );
  }

  // MODAL HANDLERS

  // Answers
  answerModalClickHandler(e) {
    e.preventDefault();
    if (this.state.showAnswerModal) {
      this.hideAnswerModalHandler();
    } else {
      this.showAnswerModalHandler();
    }
  }

  showAnswerModalHandler() {
    this.setState({
      showAnswerModal: true,
    });
  }

  hideAnswerModalHandler() {
    this.setState({
      showAnswerModal: false,
    });
  }

  // Questions

  questionModalClickHandler(e) {
    e.preventDefault();
    if (this.state.showQuestionModal) {
      this.hideQuestionModalHandler();
    } else {
      this.showQuestionModalHandler();
    }
  }

  showQuestionModalHandler() {
    this.setState({
      showQuestionModal: true,
    });
  }

  hideQuestionModalHandler() {
    this.setState({
      showQuestionModal: false,
    });
  }

  // FILTERS
  sortQuestions() {
    const questions = this.props.selectedProductsQuestions;
    if (questions.results === undefined) {
      return console.error('Nothing to Sort');
    }
    questions.results.sort((a, b) => {
      if (b.question_helpfulness < a.question_helpfulness) {
        return -1;
      }
      if (a.question_helpfulness < b.question_helpfulness) {
        return 1;
      }
      return 0;
    });
  }

  searchQuestions() {
    // Part 1: Search and Filter State
    const { searchBarText } = this.state;
    const questions = this.props.selectedProductsQuestions;

    if (questions.results === undefined) {
      return console.error('Nothing to Search');
    }

    const search = searchBarText;
    const foundQuestions = [];
    const copy = {};
    copy.product_id = questions.product_id;
    copy.results = foundQuestions;

    for (let i = 0; i < questions.results.length; i++) {
      const questionText = questions.results[i].question_body;

      if (questionText.match(new RegExp(search, 'gi'))) {
        foundQuestions.push(questions.results[i]);
      } else {
        continue;
      }
    }
    this.setState({
      searchResults: copy,
    });

    // Part 2: Search and replace HTML

    const htmlQuestions = document.getElementsByClassName('qa-question-text-only');

    for (const element of htmlQuestions) {
      // Remove <mark> tags if they exist
      const removeMarks = '<mark className="qa-questions-searched">|</mark>';
      element.innerHTML = element.innerHTML.replace(new RegExp(removeMarks, 'gi'), () => '');
      // Add <mark> tags
      element.innerHTML = element.innerHTML.replace(
        new RegExp(search, 'gi'),
        (same) => `<mark className="qa-questions-searched">${same}</mark>`
      );
    }
  }

  // DATES

  getFormattedDate(unformatedDate) {
    const date = new Date(unformatedDate);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let day = date.getDate().toString();
    if (day.length < 2) {
      day = `0${day}`;
    }
    const formattedDate = `${months[date.getMonth()]} ${day}, ${date.getFullYear()}`;
    return formattedDate;
  }

  componentDidMount() {
    this.findNumberOfQuestionsToRender();
    this.sortQuestions();
  }

  render() {
    return (
        <div className="qa-main-container">
          <h2 className="qa-qna-title">QUESTIONS & ANSWERS</h2>
          <SearchQuestions onChange={this.onChangeSearchHandler} />
          {/* Modals */}
          <AnswerModal
            show={this.state.showAnswerModal}
            onClick={this.answerModalClickHandler}
            productName={this.props.selectedProduct.name}
            onChange={this.onChange}
            state={this.state}
            addAnswerPhotos={this.addAnswerPhotos}
            verifyForm={this.verifyAnswerForm}
            resetForm={this.resetAnswerForm}
            imageClose={this.removeAnswerPhoto}
          />
          <QuestionModal
            show={this.state.showQuestionModal}
            onClick={this.questionModalClickHandler}
            productName={this.props.selectedProduct.name}
            onChange={this.onChange}
            state={this.state}
            verifyForm={this.verifyQuestionForm}
            resetForm={this.resetQuestionForm}
          />
          {/* QuestionList */}
          <QuestionList
            questions={
              this.state.searchBarText.length > 3
                ? this.state.searchResults
                : this.props.selectedProductsQuestions
            }
            moreAnswersClicked={this.moreAnswersClicked}
            collapseAnswers={this.collapseAnswers}
            numberOfQuestionsToRender={this.state.numberOfQuestionsToRender}
            userWantsMoreAnswers={this.userWantsMoreAnswers}
            date={this.getFormattedDate}
            onClick={this.answerModalClickHandler}
            setQuestionBody={this.setQuestionBody}
            reportAnswer={this.reportAnswer}
            state={this.state}
            updateQuestionHelpfulness={this.updateQuestionHelpfulness}
            updateAnswerHelpfulness={this.updateAnswerHelpfulness}
          />
          <ComponentFooter
            questions={
              this.state.searchBarText.length > 3
                ? this.state.searchResults
                : this.props.selectedProductsQuestions
            }
            numberOfQuestionsToRender={this.state.numberOfQuestionsToRender}
            incrementQuestions={this.increaseNumberOfQuestionsToRender}
            onClick={this.questionModalClickHandler}
          />
      </div>
    );
  }
}

export default QuestionsAndAnswers;
