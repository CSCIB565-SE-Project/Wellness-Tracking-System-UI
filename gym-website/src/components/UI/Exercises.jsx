import React from 'react'; 
import "../../styles/exercises.css";
import lunges from "../../assests/img/lunges.png";
import yoga  from "../../assests/img/yoga.png";
import extended from "../../assests/img/extended.png"


const Exercises =() => {
    return <section>
        <div className="container exercise__container"> 
            <div className="exercise__top">
                <h2 className="section__title">
                    Benefits of <span className="highlights">Exercise</span>
                
                </h2>
                <p> Unleash your potential with Fit Inc.'s exercise benefits: Sculpt your physique, ignite your energy, and unleash a wave of positivity <br/>
                   as you discover the transformative power of movement. Elevate beyond fitness – embrace a lifestyle of wellness </p>

            </div>
            {/*===========exercise wrapper========== */}
            <div className="exercise__wrapper">
                <div className="exercise__item">
                    <span className="exercise__icon">
                        <img src={lunges} alt=""/>
                    </span>

                    <div className="exercise__content">
                        <h4> Healthy Life </h4>
                        <p>
                        Embrace well-being with Fit Inc. Discover practical tips for a balanced,fulfilling lifestyle that empowers your journey to vitality.
                        </p>
                    </div>
                </div>


                <div className="exercise__item">
                    <span className="exercise__icon">
                        <img src={yoga} alt=""/>
                    </span>

                    <div className="exercise__content">
                        <h4> Increase Flexibility  </h4>
                        <p>
                        Enhance flexibility and find balance through the ancient practice of yoga with our specialized programs.                        
                        </p>
                    </div>
                </div>

                <div className="exercise__item">
                    <span className="exercise__icon">
                        <img src={extended} alt=""/>
                    </span>

                    <div className="exercise__content">
                        <h4> Reducing Blood Pressure  </h4>
                        <p>
                        Take small steps towards significant blood pressure improvements with our tailored exercise plans.
                        </p>
                    </div>
                </div>


            </div>

        </div>

    </section>
};


export default Exercises;
