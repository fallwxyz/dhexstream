import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Loading from './components/common/Loading';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const AnimeDetail = lazy(() => import('./pages/AnimeDetail'));
const Watch = lazy(() => import('./pages/Watch'));
const Search = lazy(() => import('./pages/Search'));
const Schedule = lazy(() => import('./pages/Schedule'));
const AnimeList = lazy(() => import('./pages/AnimeList'));
const History = lazy(() => import('./pages/History'));
const Genre = lazy(() => import('./pages/Genre'));

const NotFound = () => <div className="min-h-screen flex items-center justify-center text-dhex-text text-xl font-bold">404 Not Found</div>;

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="schedule" element={<Schedule />} />
                        <Route path="history" element={<History />} />
                        <Route path="anime/:id" element={<AnimeDetail />} />
                        <Route path="watch/ongoing" element={<AnimeList type="ongoing" />} />
                        <Route path="watch/completed" element={<AnimeList type="complete" />} />
                        <Route path="watch/popular" element={<AnimeList type="popular" />} />
                        <Route path="watch/top-rated" element={<AnimeList type="top_rated" />} />
                        <Route path="genre" element={<Genre />} />
                        <Route path="genre/:id" element={<AnimeList type="genre" />} />
                        <Route path="watch/:id/:ep" element={<Watch />} />
                        <Route path="search/:query?" element={<Search />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
