import './App.css';
import Header from "./components/Header/Header";
import Hero from "./components/UI/Hero.jsx";
import Exercises from "./components/UI/Exercises.jsx";
import Start from "./components/UI/Start.jsx";
import Pricing from "./components/UI/Pricing.jsx";
import Testimonial from './components/UI/Testimonial.jsx';



function App (){
    return (
        <>
            <Header />
            <Hero/>
            <Exercises/>
            <Start />
            <Pricing />
            <Testimonial/>
        </>
    );
}
export default App;
