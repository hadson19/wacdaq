import React, { Component } from 'react'

class listing extends Component {
	constructor(props) {
		super(props);		
		this.state = {
		};
        document.title = this.props.t[this.props.language].projectName + " – Listing";
    }
    
    componentDidMount() {
        window.scrollTo(0, 0);
    }
	
	render() {
	    // return <main className="start start_listing">
      //       <h1 className="start-title">
      //           {this.props.t[this.props.language].listingPage.coinListing}
      //       </h1>
      //       <div className="start-paragraph">
      //           {this.props.t[this.props.language].listingPage.coinListingText}
      //       </div>
      //       <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/1YohsZAoOA4B8GLKgBRNxfur8kZx3TTjZB_CV6sVe6Iw/viewform?edit_requested=true" className="start-button">{this.props.t[this.props.language].listingPage.fillForm}</a>
      //   </main>;
    return (
      <main className="main main_center section" aria-label="Content site">
        <div className="container">
          <h1 className="page-name">
            {this.props.t[this.props.language].listingPage.coinListing}
            <span className="page-name__inner">
              {this.props.t[this.props.language].listingPage.coinExchange}
            </span>
          </h1>
          <div className="page-name-description">
            {this.props.t[this.props.language].listingPage.coinListingText}
          </div>
          <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/1YohsZAoOA4B8GLKgBRNxfur8kZx3TTjZB_CV6sVe6Iw/viewform?edit_requested=true" className="link-button link-button_send-request">
            {this.props.t[this.props.language].listingPage.sendRequest}
          </a>
        </div>
      </main>
    );
	}
}

export default listing;