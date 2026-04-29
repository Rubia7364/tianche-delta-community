'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    mode: '排位赛',
    map: '',
    rankRequirement: '',
    maxMembers: 5,
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const { data } = await api.get('/teams');
      setTeams(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/teams', formData);
      alert('组队成功！');
      setShowCreate(false);
      loadTeams();
    } catch (error) {
      alert('组队失败，请先登录');
    }
  };

  const handleJoin = async (teamId: number) => {
    try {
      await api.post(`/teams/${teamId}/join`);
      alert('加入成功！');
      loadTeams();
    } catch (error) {
      alert('加入失败');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">组队大厅</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            发布组队
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleCreate} className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">发布组队</h2>
              <input
                type="text"
                placeholder="标题（如：钻石排位缺1）"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 mb-4 border rounded"
                required
              />
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full px-4 py-2 mb-4 border rounded"
              >
                <option>排位赛</option>
                <option>休闲模式</option>
                <option>竞技模式</option>
              </select>
              <input
                type="text"
                placeholder="地图（可选）"
                value={formData.map}
                onChange={(e) => setFormData({ ...formData, map: e.target.value })}
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <input
                type="text"
                placeholder="段位要求（如：钻石+）"
                value={formData.rankRequirement}
                onChange={(e) => setFormData({ ...formData, rankRequirement: e.target.value })}
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  发布
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {teams.map((team: any) => (
            <div key={team.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">{team.title}</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>模式：{team.mode}</p>
                    {team.map && <p>地图：{team.map}</p>}
                    {team.rankRequirement && <p>段位要求：{team.rankRequirement}</p>}
                    <p>人数：{team.currentMembers}/{team.maxMembers}</p>
                    <p>队长：{team.creator.nickname} ({team.creator.rank || '未设置段位'})</p>
                  </div>
                </div>
                <button
                  onClick={() => handleJoin(team.id)}
                  disabled={team.status !== 'OPEN'}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {team.status === 'OPEN' ? '加入' : '已满'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
