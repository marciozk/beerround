import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BeerTracker = () => {
  const { user, logout } = useAuth();
  const [rounds, setRounds] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roundsRes, usersRes] = await Promise.all([
        fetch('/api/rounds'),
        fetch('/api/users')
      ]);
      const [roundsData, usersData] = await Promise.all([
        roundsRes.json(),
        usersRes.json()
      ]);
      setRounds(roundsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRound = async () => {
    try {
      const res = await fetch('/api/rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error adding round:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const nextToPay = users.reduce((prev, current) => {
    const prevCount = rounds.filter(r => r.userId === prev.id).length;
    const currentCount = rounds.filter(r => r.userId === current.id).length;
    return prevCount <= currentCount ? prev : current;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Beer Round Tracker</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Next Round:</h2>
          <div className="text-2xl text-amber-600 font-bold">
            {nextToPay.username}'s Turn!
          </div>
          <button
            onClick={addRound}
            className="mt-4 bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600"
          >
            Record Round
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Round History</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center">
                <span>{user.username}</span>
                <span className="font-semibold">
                  {rounds.filter(r => r.userId === user.id).length} rounds
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
