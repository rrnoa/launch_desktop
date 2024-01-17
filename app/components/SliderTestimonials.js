import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const data = [
  {
    name: 'Sebastian Rojas',
    prefession: 'Developer',
    avatar: 'images/image-3-3.png',
    text: 'WOODEXEL is a game-changer. The precision of pixel art combined with traditional woodworking is incredible.'
  },
  {
    name: 'Roiky Rodríguez Noa',
    prefession: 'Developer',
    avatar: 'images/image-3-3.png',
    text: 'WOODEXEL is a game-changer. The precision of pixel art combined with traditional woodworking is incredible.'
  },
  {
    name: 'Sebastian Rojas',
    prefession: 'Developer',
    avatar: 'images/image-3-3.png',
    text: 'WOODEXEL is a game-changer. The precision of pixel art combined with traditional woodworking is incredible.'
  },
  {
    name: 'Roiky Rodríguez',
    prefession: 'Developer',
    avatar: 'images/image-3-3.png',
    text: 'WOODEXEL is a game-changer. The precision of pixel art combined with traditional woodworking is incredible.'
  },
  {
    name: 'Sebastian Rojas',
    prefession: 'Developer',
    avatar: 'images/image-3-3.png',
    text: 'WOODEXEL is a game-changer. The precision of pixel art combined with traditional woodworking is incredible.'
  }
];

const SliderTestimonials = () => {  
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
          breakpoint: 1024,
          settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
          }
      },
      {
          breakpoint: 600,
          settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: 1
          }
      }
  ]
  };

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div className='arrow arrow-right'
        style={{ ...style, display: "block", cursor: 'pointer'}}
        onClick={onClick}
      >
        <img src='images/round-arrow-right-svgrepo-com.svg'/>
      </div>
    );
  }
  
  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div  className='arrow arrow-left'      
        style={{ ...style, display: "block", cursor: 'pointer' }}
        onClick={onClick}
      >
        <img src='images/round-arrow-left-svgrepo-com.svg'/>
      </div>
    );
  }

  return (
    <div className='slider-reviews'>
      <Slider {...settings}>
      {data.map((d, i) => (      

      <div className="content-box" key={i}>
      <div className="content">
        <p className="text-wrapper-5">{d.text}</p>
        <div className="user-card"><div className="user-thumb">
          <img className="image-3" alt="Image" src={d.avatar}/>
        </div>
        <div className="div-2">
          <div className="text-wrapper-5">{d.name}</div>
          <div className="category">{d.prefession}</div>
        </div>
        </div>
      </div>
      </div>

      ))
      }
      </Slider>
      
    </div>
  )
}

export default SliderTestimonials