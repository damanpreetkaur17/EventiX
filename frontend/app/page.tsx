import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import PastEvents from "./components/PastEvents";
import Journey from "./components/Journey";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <PastEvents/>
        <Journey />
        <Footer />
      </main>
    </>
  );
}
