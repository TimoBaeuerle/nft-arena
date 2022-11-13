import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ContainerSlider(props) {
    var settings = {
        dots: props.dots || false,
        infinite: props.infinite || false,
        speed: props.speed || 500,
        slidesToShow: props.amount || 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: (props.amount || 5) >= 2 ? 2 : 1,
                    slidesToScroll: 1,
                    dots: props.dots || false,
                    infinite: props.mobileInfinite || false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: props.dots || false,
                    infinite: props.mobileInfinite || false
                }
            }
        ]
    };
    return (
        <Slider className={props.className || ''} {...settings}>
            {props.children}
        </Slider>
    );
}