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
        {/* ✅ Browser Tab Title */}
        <title>THE BLUEX — Rwanda's Premier News & Entertainment Platform</title>

        {/* ✅ Rounded Icon in Tab */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        <meta
          name="description"
          content="THE BLUEX — Your premier destination for news, movies, stories, and job vacancies from Rwanda and beyond."
        />

        {/* ✅ Open Graph for Social Sharing */}
        <meta property="og:title" content="THE BLUEX — Rwanda's Premier Platform" />
        <meta property="og:description" content="News, Movies, Stories & Jobs from Rwanda and beyond." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thebluexx.com" />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="THE BLUEX" />
        <meta name="twitter:description" content="Rwanda's #1 Digital Platform" />
      </Helmet>

      <HeroSection />
      <BreakingNewsTicker />

      {/* Slim top banner */}
      <AdBanner position="top-banner" />

      <NewsSection />
      <CategoriesSection />

      {/* Native in-feed ad */}
      <AdBanner position="in-feed" />

      <MovieSection />
      <SubscribeSection />

      {/* Floating corner notification ad */}
      <AdBanner position="floating" />
    </>
  );
};

export default Home;