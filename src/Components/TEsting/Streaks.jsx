import React from 'react';
import LeaderboardPage from '../Comps/LeaderboardPage';

export default function Streaks() {
    return (
        <div className="p-6">
            <LeaderboardPage isMobile={false} />
        </div>
    );
}