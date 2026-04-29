'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data.items))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">天策三角洲社区</h1>
            <nav className="flex gap-4">
              <Link href="/" className="px-4 py-2 text-blue-600 font-semibold">首页</Link>
              <Link href="/teams" className="px-4 py-2 text-gray-600 hover:text-blue-600">组队大厅</Link>
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">登录</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.content.substring(0, 200)}...</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>作者：{post.author.nickname}</span>
                <span>👁️ {post.views} | ❤️ {post.likes} | 💬 {post.commentsCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
