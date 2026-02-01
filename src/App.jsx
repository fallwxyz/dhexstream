import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Schedule from './pages/Schedule';
import AnimeList from './pages/AnimeList';
import Genre from './pages/Genre';

const NotFound = () => <div className="p-10 text-white">404 Not Found</div>;

function App() {
    return (
        <Router basename="/dhexstream">
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="anime/:id" element={<AnimeDetail />} />
                    <Route path="watch/ongoing" element={<AnimeList type="ongoing" />} />
                    <Route path="watch/completed" element={<AnimeList type="complete" />} />
                    <Route path="genre" element={<Genre />} />
                    <Route path="genre/:id" element={<AnimeList type="genre" />} />
                    <Route path="watch/:id/:ep" element={<Watch />} />
                    <Route path="search/:query?" element={<Search />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
