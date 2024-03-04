import React from "react";
import'../../styles/pricing.css';



const Pricing =() =>{
    return <section>
        <div className="container">
            <div className="pricing__top">
                <h2 className="section__title">
                    Gym <span className="highlights">
                        Pricing 
                    </span> Plan 
                </h2>
                <p> lorem ipsumhhjhj hj hj <br/> h hhjhj</p>
            </div>
            {/* ====pricing wrapper =====*/}
            <div className="pricing__wrapper">
                <div className="pricing__item">
                    <div className="pricing__card-top">
                        <h2 className="section__title">Regular Member </h2>
                        <h2 className="pricing section__title"> $50 <span>/month
                            </span> </h2>
                    </div>

                    <div className="services">
                        <ul>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Utilize a variety of exercise programs created by certified trainers, perfect for those starting their fitness journey</li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Monitor daily diet with our basic meal tracking system, promoting consistent health habits. </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Engage with a vibrant community of like-minded individuals for mutual support and motivation </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Flexibly arrange your fitness schedule with our standard workout calendar, designed to fit a regular lifestyle.</li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Regular Performance analysis with feedback and recommendations ensuring continuous improvement</li>
                        </ul>
                    </div>
                    <div className="btn__services">
                        {/* ... other elements ... */}
                        <div className="button-container"> {/* Add this wrapper around your button */}
                            <button className="register__btn">Join Now</button>
                        </div>
                    </div>

                </div>


                <div className="pricing__item pricing__item-01">
                    <div className="pricing__card-top">
                        <h2 className="section__title">Standard Member </h2>
                        <h2 className="pricing section__title"> $70 <span>/month
                            </span> </h2>
                    </div>

                    <div className="services">
                        <ul>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Enjoy access to a wider range of intermediate-level training routines, adding variety and challenge to your workouts</li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Leverage advanced meal tracking tools that offer detailed nutritional insights and diet optimization </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Participate in exclusive community groups for goal-specific support and to share achievements </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Benefit from premium scheduling flexibility that includes priority class booking options </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Get bi-weekly customized feedback based on in-depth performance analysis to fine-tune your fitness strategy </li>
                        </ul>
                    </div>
                    <div className="btn__services">
                        {/* ... other elements ... */}
                        <div className="button-container"> {/* Add this wrapper around your button */}
                            <button className="register__btn">Join Now</button>
                        </div>
                    </div>
                </div>

                <div className="pricing__item pricing__item-02">
                    <div className="pricing__card-top">
                        <h2 className="section__title">Premium Member </h2>
                        <h2 className="pricing section__title"> $100 <span>/month
                            </span> </h2>
                    </div>

                    <div className="services">
                        <ul>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Exclusive access to elite training programs with advanced exercises tailored by top fitness experts </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Comprehensive dietary management with personalized meal planning and one-on-one nutritionist consultations </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Engage in a premium community platform that offers mentorship from wellness gurus and personalized support </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Enjoy the ultimate convenience with a personal assistant for scheduling, ensuring your workouts never conflict </li>
                            <li><span><i class="ri-checkbox-blank-circle-fill"></i></span> Get tailored, in-depth feedback and continuous fitness plan enhancement from personal trainers </li>
                        </ul>
                    </div>
                    <div className="btn__services">
                        {/* ... other elements ... */}
                        <div className="button-container"> {/* Add this wrapper around your button */}
                            <button className="register__btn">Join Now</button>
                        </div>
                    </div>
                </div>





            </div>
        </div>
    </section>
};


export default Pricing;