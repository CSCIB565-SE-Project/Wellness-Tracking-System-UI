import React from 'react'; 
import heroImg from '../../assests/img/gym-1.png'
import dumbleIcon from '../../assests/img/dumble.jpg'
import "../../styles/hero.css";

const Hero =() => {
    return  (
         <section>
            <div className="container">
                <div className="hero__wrapper">

                    {/* hero content*/ }
                    <div className="hero__content"> 
                        <h2 className="section__title">
                        Exercise is the key to a   
                        <span className= "highlights"> Healthy </span> Lifestyle
                        </h2>
                        <p>Unlock your potential with a commitment to daily exercise, a transformative journey that not only shapes your body but elevates your mind. <br/>  Embrace the vitality of an active lifestyle and experience the joy of a healthier, happier you.
                        </p>
                        <div className="hero__btns">
                            <button className="register__btn">Get Started</button>
                            <button className="watch__btn">
                                <span>
                                    <i class="ri-play-fill"></i>
                                </span>
                                Watch Video
                            </button>
                        </div>
                    </div>

                     {/*================== hero img============*/ }

                    <div className="hero__img">
                        <div className="hero__img-wrapper">

                            <div className="box-01">
                                <div className="box-02">
                                    <div className="box-03">
                                        <div className="box__img">
                                            <img src={heroImg} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="heart__rate">
                                <h5> Heart Rate</h5>
                                <span><i class="ri-heart-pulse-fill"></i></span>
                                <h5> 2567 BPM</h5>
                            </div>

                            <div className="gym__location">
                                <span> <i class="ri-map-pin-2-fill"></i></span>
                                <h5> Workout from  <br/> Anywhere!</h5>
                            </div>

                            <div className="dumble__icon">
                                <img src={dumbleIcon} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}
export default Hero;
