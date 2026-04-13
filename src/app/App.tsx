import { Hero } from "./components/Hero";
import { Welcome } from "./components/Welcome";
import { GraphicMemes } from "./components/GraphicMemes";
import { Quotes } from "./components/Quotes";
import { About } from "./components/About";
import { Ministries } from "./components/Ministries";
import { Sermons } from "./components/Sermons";
import { Events } from "./components/Events";
import { ChurchMoments } from "./components/ChurchMoments";
import { Visit } from "./components/Visit";
import { Contact } from "./components/Contact";
import { Navbar } from "./components/Navbar";
import { ChurchContentProvider } from "./content/ChurchContentContext";

export default function App() {
  return (
    <ChurchContentProvider>
      <div className="size-full bg-[#FFF8E8]">
        <Navbar />
        <Hero />
        <Welcome />
        <Quotes />
        <GraphicMemes />
        <About />
        <Ministries />
        <Sermons />
        <Events />
        <ChurchMoments />
        <Visit />
        <Contact />
      </div>
    </ChurchContentProvider>
  );
}
