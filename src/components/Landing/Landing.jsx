import Hero from "./Hero"
import Features from "./Feature"
import Handicrafts from "./Handicraft"
import styles from "./Home.module.css";
import Workshops from "./Workshop";
import CraftTypes from "./heraf";
import Footer from "../Footer/Footer";
import AboutSection from "./how";
export default  function Home(){
    return(
        <>
        
<Hero/>
<AboutSection/>
<Features/>
<Handicrafts/>
<Workshops/>
<CraftTypes/>
<Footer/>

        </>
    )
}