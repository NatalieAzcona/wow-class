import Hero from "../components/Hero"
import WhatIsWow from "../components/WhatIsWow"
import Reviews from "../components/Reviews"
import Prices from "../components/Prices"
import './Home.scss'

const Home = () => {
  return (
    <div>
      <Hero/>
      <WhatIsWow/>
      <Reviews/>
      <div className="home__tagline">
        <p>Empieza pronto. Llega más lejos.</p>
      </div>
      <Prices/>
    </div>
  )
}

export default Home
