// src/TrashBinDashboard.tsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrashBin {
  id: number;
  location: string;
  fillLevel: number;
}

const TrashBinDashboard: React.FC = () => {
  const [bins, setBins] = useState<TrashBin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortedBins, setSortedBins] = useState<TrashBin[]>([]);
  const [sortField, setSortField] = useState<keyof TrashBin>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const highlightThreshold = 80; // Threshold for highlighting

  useEffect(() => {
    // Replace with actual API call or use mock data
    const fetchData = async () => {
      const response = await fetch('/mockData.json'); // Replace with actual API
      const data: TrashBin[] = await response.json();
      setBins(data);
      setSortedBins(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = bins.filter(bin =>
      bin.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedBins(sorted);
  }, [searchTerm, bins, sortField, sortOrder]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field as keyof TrashBin);
    setSortOrder(order as 'asc' | 'desc');
  };

  return (
    <div>
      <h1>Trash Bin Dashboard</h1>
      <input
        type="text"
        placeholder="Search by location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={handleSortChange}>
        <option value="id-asc">Bin ID (Asc)</option>
        <option value="id-desc">Bin ID (Desc)</option>
        <option value="fillLevel-asc">Fill Level (Asc)</option>
        <option value="fillLevel-desc">Fill Level (Desc)</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Bin ID</th>
            <th>Location</th>
            <th>Fill Level</th>
          </tr>
        </thead>
        <tbody>
          {sortedBins.map(bin => (
            <tr key={bin.id} style={{ color: bin.fillLevel > highlightThreshold ? 'red' : 'black' }}>
              <td>{bin.id}</td>
              <td>{bin.location}</td>
              <td>{bin.fillLevel}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sortedBins}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="fillLevel" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrashBinDashboard;
