import React from 'react';
import axios from 'axios';
import style from './style.scss';
import RatingsReviews from './RatingsReviews/RatingsReviews.jsx';
import QuestionsAndAnswers from './QuestionsAndAnswers/QuestionsAndAnswers.jsx';
import Overview from './Overview/Overview.jsx';
import RelatedItemsAndComparison from './RelatedItemsAndComparison/RelatedItemsAndComparison.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.darkMode = false;
    this.state = {
      allProducts: [],
      selectedProduct: {},
      questions: {},
      selectedStyle: null,
      darkMode: false,
    };
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.changeSelectedStyle = this.changeSelectedStyle.bind(this);
    this.getMetaInformation = this.getMetaInformation.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.getInitialProduct = this.getInitialProduct.bind(this);
  }

  componentDidMount() {
    this.getInitialProduct();
    this.getAllProducts();
    this.getProduct();
    this.getMetaInformation();
    console.log('SelectedProduct:', this.state.selectedProduct)
  }

  getAllProducts() {
    axios
      .get('api/products?count=*')
      .then((data) => {
        // data.data is an array of all products, where each product is an object
        this.setState({
          allProducts: data.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getInitialProduct() {
    axios.get('api/products?count=1')
    .then((response) => {
      this.setState(
        {selectedProduct: response.data[0]}
      )
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getMetaInformation() {
    axios
      .get(`/api/reviews/meta?product_id=${this.state.selectedProduct.id}`)
      .then((data) => {
        let totalRatingScore = 0;
        let totalNumberOfRatings = 0;
        const { ratings, recommended } = data.data;
        Object.keys(ratings).forEach((key) => {
          totalRatingScore += parseInt(key, 10) * ratings[key];
          totalNumberOfRatings += parseInt(ratings[key], 10);
        });
        let toNearestDecimal = (totalRatingScore / totalNumberOfRatings).toFixed(2);
        // Calculate the recommended amount and the number of reviewers.
        this.setState({ meta: data.data, starRating: toNearestDecimal, starRatingLoaded: true });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  getProduct(productID = this.state.selectedProduct.id) {
    axios
      .get(`api/products/${productID}`)
      .then((product) => this.setState({ selectedProduct: product.data }))
      .then(() => this.getQuestions());
  }

  getQuestions() {
    axios
      .get(`api/qa/questions/?product_id=${this.state.selectedProduct.id}&count=30`)
      .then((questions) => {
        this.setState({
          questions: questions.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  toggleDarkMode() {
    const body = document.getElementById('bod');
    this.darkMode = !this.darkMode;
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
    }));
    if (!this.darkMode) {
      body.style.background = 'white';
      body.style.color = 'black';
    } else {
      body.style.background = 'rgb(35,35,35)';
      body.style.color = 'white';
    }
  }

  changeSelectedStyle(selectedStyle) {
    this.setState({
      selectedStyle: selectedStyle,
    });
  }

  render() {
    const { selectedProduct } = this.state;
    return (
      <div className="main-app">
        <div onClick={this.toggleDarkMode}>Toggle DarkMode</div>
        {/* react is up and running */}
        {/* need to pass in what item we're on here */}
        {this.state.selectedProduct && this.state.starRating && (
          <Overview
            starRating={this.state.starRating}
            changeSelectedStyle={this.changeSelectedStyle}
            selectedProduct={selectedProduct}
            selectedProductId={this.state.selectedProduct.id}
          />
        )}
        {this.state.selectedProduct && (
          <RelatedItemsAndComparison
            selectedProduct={this.state.selectedProduct}
            changeProduct={this.getProduct}
            selectedStyle={this.state.selectedStyle}
            starRating={this.state.starRating}
            darkMode={this.state.darkMode}
          />
        )}
        {this.state.questions.results && (
          <QuestionsAndAnswers
            selectedProduct={this.state.selectedProduct}
            selectedProductsQuestions={this.state.questions}
            getQuestions={this.getQuestions}
          />
        )}
        <RatingsReviews productData={selectedProduct} />
      </div>
    );
  }
}
export default App;
