import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';


export default class StarRating extends Component {
  static defaultProps = {
    minRating: 0,
    maxRating: 5,
    rating: 5,
    starRatio: 1,
    limit: 1000
  }

  maxStars() {
    let { maxRating, starRatio } = this.props
    return Math.ceil(maxRating / starRatio)
  }

  fullStars() {
    let { rating, starRatio } = this.props
    return Math.floor(rating / starRatio)
  }

  halfStars() {
    let { rating, starRatio } = this.props
    let x = rating % starRatio
    let i = (1 / 2) * starRatio
    return x >= i ? 1 : 0
  }

  emptyStars() {
    return this.maxStars() - this.fullStars() - this.halfStars()
  }

  render() {
    let fullStars = this.fullStars()
    let halfStars = this.halfStars()
    let emptyStars = this.emptyStars()

    let renderFullStars = () => {
      return fullStars !== 0
        ? Array(fullStars)
          .fill(null)
          .map((item, i) => {
            return <FontAwesomeIcon className="star" key={`fs${i}`} icon={faStar} />
          })
        : ''
    }

    let renderHalfStars = () => {
      return halfStars !== 0
        ? Array(halfStars)
          .fill(null)
          .map((item, i) => {
            return <FontAwesomeIcon className="star-half" key={`hs${i}`} icon={faStarHalfAlt} />
          })
        : ''
    }

    let renderEmptyStars = () => {
      return emptyStars !== 0
        ? Array(emptyStars)
          .fill(null)
          .map((item, i) => {
            return <FontAwesomeIcon className="star" key={`es${i}`} icon={faStarRegular} />
          })
        : ''
    }

    return (
      <div className="star-rating">
        {renderFullStars()}
        {renderHalfStars()}
        {renderEmptyStars()}
      </div>
    )
  }
}
