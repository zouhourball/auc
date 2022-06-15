import { Button } from 'react-md'
import Slider from 'react-slick'

import './style.scss'

const HomeSlider = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  }
  return (
    <Slider {...settings}>
      <div className="slide-section">
        {' '}
        <img src="https://picsum.photos/1000/300" />
        <div className="data-section">
          <h1>Villa</h1>
          <span>Jumeirah, Dubai</span>
          <span>Current Ask: 0</span>
          <span>02 D : 08 H : 35 M : 10 S</span>
          <Button>Bid Now</Button>
        </div>
      </div>
      <div className="slid-section">
        {' '}
        <img src="https://picsum.photos/1000/300" />
        <div className="data-section">
          <h1>Villa</h1>
          <span>Jumeirah, Dubai</span>
          <span>Current Ask: 0</span>
          <span>02 D : 08 H : 35 M : 10 S</span>
          <Button>Bid Now</Button>
        </div>
      </div>
      <div className="slide-section">
        {' '}
        <img src="https://picsum.photos/1000/300" />
        <div className="data-section">
          <h1>Villa</h1>
          <span>Jumeirah, Dubai</span>
          <span>Current Ask: 0</span>
          <span>02 D : 08 H : 35 M : 10 S</span>
          <Button>Bid Now</Button>
        </div>
      </div>
    </Slider>
  )
}
export default HomeSlider
