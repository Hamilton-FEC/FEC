import React from 'react';
import axios from 'axios';
import ImageGallery from './ImageGallery.jsx';
import ProductInfo from './ProductInfo.jsx';
import StyleSelector from './StyleSelector.jsx';
import AddToCart from './AddToCart.jsx';
import ProductOverview from './ProductOverview.jsx';
import Header from './Header.jsx';

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // selectedProduct: null, this comes in as a prop now
      selectedProductStyles: [],
      selectedStyle: null, // set the first style as default
      outOfStock: false,
      allSizes: [],
      expandedGallery: false,
    };

    this.getProductStyles = this.getProductStyles.bind(this);
    this.selectStyleThumbnail = this.selectStyleThumbnail.bind(this);
    this.checkOutOfStock = this.checkOutOfStock.bind(this);
    this.checkExpandedGallery = this.checkExpandedGallery.bind(this);
  }

  componentDidMount() {
    this.getProductStyles();
    console.log('Selected Product:', this.props.selectedProductId);
  }

  componentDidUpdate(prevsProp) {
    if (this.props.selectedProduct !== prevsProp.selectedProduct) {
      this.getProductStyles();
    }
  }

  // get all the styles associated with the product - get product id as props through App component
  getProductStyles() {
    console.log(this.props.selectedProductId);
    axios.get(`/api/products/${this.props.selectedProductId}/styles`).then((product) => {
      this.setState(
        {
          selectedProductStyles: product.data.results,
          selectedStyle: product.data.results[0], // sets first style to default style for now
        },
        () => {
          this.checkOutOfStock();
          this.props.changeSelectedStyle(product.data.results[0]);
        }
      );
    });
  }

  checkOutOfStock() {
    const { selectedStyle } = this.state;

    const allSizes = Object.values(selectedStyle.skus);
    this.setState({ allSizes });

    const inventory = [];

    allSizes.forEach((item) => {
      if (item.quantity === 0) {
        inventory.push(item);
      }
    });

    if (inventory.length === allSizes.length) {
      this.setState({ outOfStock: true });
    } else {
      this.setState({ outOfStock: false });
    }
  }

  checkExpandedGallery() {
    this.setState({ expandedGallery: !this.state.expandedGallery });
  }

  // change the state of the selectedStyle once we click on a thumbnail
  selectStyleThumbnail(style) {
    this.setState({ selectedStyle: style }, () => {
      this.checkOutOfStock();
      this.props.changeSelectedStyle(this.state.selectedStyle);
      // need to check quantity too once we change a style
    });
  }

  render() {
    const {
      selectedProductStyles,
      selectedStyle,
      outOfStock,
      allSizes,
      selectedSideThumbnail,
      expandedGallery,
    } = this.state;
    const { selectedProduct, starRating } = this.props;
    return (
      <div>
        <Header />
        <div className="o-overView">
          <ImageGallery
            selectedProductStyles={selectedProductStyles}
            selectedStyle={selectedStyle}
            checkExpandedGallery={this.checkExpandedGallery}
          />
          {!expandedGallery && (
            <ProductInfo selectedStyle={selectedStyle} selectedProduct={selectedProduct} starRating={starRating} />
          )}
          {!expandedGallery && (
            <StyleSelector
              selectedProductStyles={selectedProductStyles}
              selectedStyle={selectedStyle}
              selectStyleThumbnail={this.selectStyleThumbnail}
            />
          )}
          {!expandedGallery && (
            <AddToCart
              outOfStock={outOfStock}
              selectedProductStyles={selectedProductStyles}
              selectedStyle={selectedStyle}
              selectedProduct={selectedProduct}
              allSizes={allSizes}
            />
          )}
        </div>
        <ProductOverview selectedProduct={selectedProduct} />
      </div>
    );
  }
}

export default Overview;
