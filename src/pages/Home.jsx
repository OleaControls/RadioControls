import React from 'react';
import Hero from '../components/Hero';
import Player from '../components/Player';
import Providers from '../components/Providers';
import WaveCursor from '../components/WaveCursor';

const Home = () => {
  return (
    <div className="pt-20">
      <WaveCursor />
      <Hero />
      <Player />
      <Providers />
    </div>
  );
};

export default Home;
