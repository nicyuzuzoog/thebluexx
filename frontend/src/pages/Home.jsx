import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import BreakingNewsTicker from '../components/home/BreakingNewsTicker';
import AdBanner from '../components/home/AdBanner';
import NewsSection from '../components/home/NewsSection';
import MovieSection from '../components/home/MovieSection';
import CategoriesSection from '../components/home/CategoriesSection';
import SubscribeSection from '../components/home/SubscribeSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>THE BLUEX — Rwanda's Premier News & Entertainment Platform</title>
        <meta name="description" content="THE BLUEX — Your premier destination for news, movies, stories, and job vacancies from Rwanda and beyond." />
      </Helmet>

      <HeroSection />
      <BreakingNewsTicker />
      <AdBanner position="top-banner" />
      <NewsSection />
      <CategoriesSection />
      <MovieSection />
      <AdBanner position="in-feed" />
      <SubscribeSection />
    </>
  );
};

export default Home;