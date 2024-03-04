import React from 'react'; 
import "../../styles/start.css";
import trainerImg from "../../assests/img/trainer.jpg";

const Start =() => {

    return <section>
     <div className="container">
        <div className="start__wrapper">
            <div className="start__img">
                <img src={trainerImg} alt=""></img>
            </div>

            <div className="start__content">
                <h2 className="section__title">
                    Ready to make a 
                    <span className="highlights"> change ?</span>
                </h2>
                <p>
                Step into the realm of personalized fitness excellence with Fit Inc. Our tailored training programs are designed to ignite your passion, sculpt your physique, and redefine your limits. Elevate your journey with us and embark on a path to lasting transformation.
                </p>
                <button className="register__btn"> Get Started</button>
            </div>
        </div>
    </div>   
    </section>
    
}

export default Start;
