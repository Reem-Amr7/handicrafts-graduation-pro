import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { TokenContext } from "../../Context/TokenContext";

const currentYear = new Date().getFullYear();
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const recentOrders = [
  { product: "Smart Phone", category: "Mobiles", price: "$199.99" },
  { product: "White Headphones", category: "Music", price: "$79.49" },
  { product: "Stop Watch", category: "Electronics", price: "$49.29" },
  { product: "Nikon Camera", category: "Electronics", price: "$1,699.00" },
  { product: "Photo Frame", category: "Furniture", price: "$29.99" },
];

const topCustomers = [
  { name: "Emma Wilson", purchases: 15, amount: "$1,835" },
  { name: "Robert Lewis", purchases: 18, amount: "$2,341" },
  { name: "Angelina Hose", purchases: 12, amount: "$2,415" },
];

export default function AdminDashboard() {
  const [totalHandicrafts, setTotalHandicrafts] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState(null);
  const [lastMonthData, setLastMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { token } = useContext(TokenContext);

  // New state for additional stats from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCulturalArticles: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFollows: 0,
    totalCategories: 0,
    activeUsersToday: 0,
  });
  const [topActiveUsers, setTopActiveUsers] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [popularHandiCrafts, setPopularHandiCrafts] = useState([]);

  // Authentication token - replace with your actual token
const authToken = token;

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch admin statistics
        const adminStatsRes = await fetch(
          "https://ourheritage.runasp.net/api/Statistics/admin",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: '*/*',
            },
          }
        );
        const adminStatsResult = await adminStatsRes.json();

        if (!adminStatsResult.isSucceeded) {
          throw new Error(adminStatsResult.message || 'Failed to fetch admin statistics');
        }

        const { model } = adminStatsResult;

        // Update stats
        setStats({
          totalUsers: model.totalUsers,
          totalCulturalArticles: model.totalCulturalArticles,
          totalHandiCrafts: model.totalHandiCrafts,
          totalLikes: model.totalLikes,
          totalComments: model.totalComments,
          totalFollows: model.totalFollows,
          totalCategories: model.totalCategories,
          activeUsersToday: model.activeUsersToday,
        });

        // Update total handicrafts
        setTotalHandicrafts(model.totalHandiCrafts);

        // Update top active users, popular articles, and handicrafts
        setTopActiveUsers(model.topActiveUsers);
        setPopularArticles(model.popularArticles);
        setPopularHandiCrafts(model.popularHandiCrafts);

        // Process monthly activity for the selected year
        const filteredMonthlyData = model.monthlyActivity
          .filter(activity => activity.year === selectedYear)
          .map((activity, index) => {
            const monthName = monthNames[index].substring(0, 3);
            return {
              month: monthName,
              monthNumber: index + 1,
              newUsers: activity.newUsers,
              newArticles: activity.newArticles,
              newHandiCrafts: activity.newHandiCrafts,
              totalEngagement: activity.totalLikes + activity.totalComments,
              totalActivity: activity.newUsers + activity.newArticles + activity.newHandiCrafts,
            };
          });

        // Ensure all 12 months are represented
        const chartData = Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          const monthName = monthNames[index].substring(0, 3);
          const existingData = filteredMonthlyData.find(data => data.monthNumber === month);
          return existingData || {
            month: monthName,
            monthNumber: month,
            newUsers: 0,
            newArticles: 0,
            newHandiCrafts: 0,
            totalEngagement: 0,
            totalActivity: 0,
          };
        });

        setMonthlyData(chartData);

        // Fetch current month data
        const currentMonthRes = await fetch(
          "https://ourheritage.runasp.net/api/Statistics/current-month",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const currentMonthResult = await currentMonthRes.json();
        if (currentMonthResult.isSucceeded) {
          setCurrentMonthData(currentMonthResult.model);
        }

        // Fetch last month data
        const lastMonthRes = await fetch(
          "https://ourheritage.runasp.net/api/Statistics/last-month",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const lastMonthResult = await lastMonthRes.json();
        if (lastMonthResult.isSucceeded) {
          setLastMonthData(lastMonthResult.model);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (err.message.includes('Failed to fetch')) {
          console.error('Possible CORS or network issue. Check server configuration or token validity.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Calculate totals from monthly data
  const yearlyTotals = monthlyData.reduce((acc, month) => ({
    totalNewUsers: acc.totalNewUsers + month.newUsers,
    totalNewArticles: acc.totalNewArticles + month.newArticles,
    totalNewHandiCrafts: acc.totalNewHandiCrafts + month.newHandiCrafts,
    totalEngagement: acc.totalEngagement + month.totalEngagement,
  }), { totalNewUsers: 0, totalNewArticles: 0, totalNewHandiCrafts: 0, totalEngagement: 0 });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-2 hover:text-blue-400 text-blue-400">📊 Dashboard</a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-400">📋 Orders</a>
          <Link 
            to="/allcat" 
            className="flex items-center gap-2 hover:text-blue-400"
          >
            📋 Total Categories
          </Link>
          <Link 
            to="/users" 
            className="flex items-center gap-2 hover:text-blue-400"
          >
            👥 Users
          </Link>     
          <Link 
            to="/top-users" 
            className="flex items-center gap-2 hover:text-blue-400"
          >
            👑 Top Users
          </Link>
          <Link 
            to="/Populararticles" 
            className="flex items-center gap-2 hover:text-blue-400"
          >
            📰 Popular Articles
          </Link>
          <a href="#" className="flex items-center gap-2 hover:text-blue-400">⚙️ Settings</a>
          <a href="#" className="flex items-center gap-2 text-red-400 hover:text-red-500">🚪 Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        {/* Year Selection */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-blue-600 text-3xl">📅</div>
            <div className="flex items-center gap-2">
              <label className="text-gray-700 font-medium">Year:</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            {loading && <div className="text-blue-600">Loading...</div>}
          </div>
        </div>

        {/* Current Month vs Last Month Comparison */}
        {currentMonthData && lastMonthData && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Monthly Comparison</h3>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {/* New Users Comparison */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-600 text-3xl">👥</div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    calculatePercentageChange(currentMonthData.newUsers, lastMonthData.newUsers) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculatePercentageChange(currentMonthData.newUsers, lastMonthData.newUsers)}%
                  </div>
                </div>
                <h4 className="text-gray-500 mb-2">New Users</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{currentMonthData.newUsers}</p>
                    <p className="text-sm text-gray-500">{currentMonthData.monthName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-600">{lastMonthData.newUsers}</p>
                    <p className="text-sm text-gray-500">{lastMonthData.monthName}</p>
                  </div>
                </div>
              </div>

              {/* New Articles Comparison */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-green-600 text-3xl">📰</div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    calculatePercentageChange(currentMonthData.newArticles, lastMonthData.newArticles) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculatePercentageChange(currentMonthData.newArticles, lastMonthData.newArticles)}%
                  </div>
                </div>
                <h4 className="text-gray-500 mb-2">New Articles</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{currentMonthData.newArticles}</p>
                    <p className="text-sm text-gray-500">{currentMonthData.monthName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-600">{lastMonthData.newArticles}</p>
                    <p className="text-sm text-gray-500">{lastMonthData.monthName}</p>
                  </div>
                </div>
              </div>

              {/* New Handicrafts Comparison */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-purple-600 text-3xl">🎨</div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    calculatePercentageChange(currentMonthData.newHandiCrafts, lastMonthData.newHandiCrafts) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculatePercentageChange(currentMonthData.newHandiCrafts, lastMonthData.newHandiCrafts)}%
                  </div>
                </div>
                <h4 className="text-gray-500 mb-2">New Handicrafts</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{currentMonthData.newHandiCrafts}</p>
                    <p className="text-sm text-gray-500">{currentMonthData.monthName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-600">{lastMonthData.newHandiCrafts}</p>
                    <p className="text-sm text-gray-500">{lastMonthData.monthName}</p>
                  </div>
                </div>
              </div>

              {/* Total Engagement Comparison */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-600 text-3xl">📈</div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    calculatePercentageChange(currentMonthData.totalEngagement, lastMonthData.totalEngagement) >= 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {calculatePercentageChange(currentMonthData.totalEngagement, lastMonthData.totalEngagement)}%
                  </div>
                </div>
                <h4 className="text-gray-500 mb-2">Total Engagement</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{currentMonthData.totalEngagement}</p>
                    <p className="text-sm text-gray-500">{currentMonthData.monthName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-600">{lastMonthData.totalEngagement}</p>
                    <p className="text-sm text-gray-500">{lastMonthData.monthName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-blue-600 text-3xl">👥</div>
            <div>
              <h4 className="text-gray-500">Total Users</h4>
              <p className="text-xl font-bold">{stats.totalUsers}</p>
              <span className="text-sm text-blue-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-green-600 text-3xl">📰</div>
            <div>
              <h4 className="text-gray-500">Total Articles</h4>
              <p className="text-xl font-bold">{stats.totalCulturalArticles}</p>
              <span className="text-sm text-green-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-purple-600 text-3xl">📦</div>
            <div>
              <h4 className="text-gray-500">Total Handicrafts</h4>
              <p className="text-xl font-bold">{stats.totalHandiCrafts}</p>
              <span className="text-sm text-purple-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-orange-600 text-3xl">📈</div>
            <div>
              <h4 className="text-gray-500">Total Engagement ({selectedYear})</h4>
              <p className="text-xl font-bold">{yearlyTotals.totalEngagement}</p>
              <span className="text-sm text-orange-600">Total for year</span>
            </div>
          </div>

          {/* New Stats Cards */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-red-600 text-3xl">❤️</div>
            <div>
              <h4 className="text-gray-500">Total Likes</h4>
              <p className="text-xl font-bold">{stats.totalLikes}</p>
              <span className="text-sm text-red-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-teal-600 text-3xl">💬</div>
            <div>
              <h4 className="text-gray-500">Total Comments</h4>
              <p className="text-xl font-bold">{stats.totalComments}</p>
              <span className="text-sm text-teal-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-indigo-600 text-3xl">👤➕</div>
            <div>
              <h4 className="text-gray-500">Total Follows</h4>
              <p className="text-xl font-bold">{stats.totalFollows}</p>
              <span className="text-sm text-indigo-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-pink-600 text-3xl">📂</div>
            <div>
              <h4 className="text-gray-500">Total Categories</h4>
              <p className="text-xl font-bold">{stats.totalCategories}</p>
              <span className="text-sm text-pink-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-yellow-600 text-3xl">👀</div>
            <div>
              <h4 className="text-gray-500">Active Users Today</h4>
              <p className="text-xl font-bold">{stats.activeUsersToday}</p>
              <span className="text-sm text-yellow-600">Today</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
          {/* Monthly Activity Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Monthly Activity Overview ({selectedYear})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name.replace(/([A-Z])/g, ' $1').trim()]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="newUsers" fill="#3B82F6" name="New Users" />
                <Bar dataKey="newArticles" fill="#10B981" name="New Articles" />
                <Bar dataKey="newHandiCrafts" fill="#8B5CF6" name="New Handicrafts" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Trend */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Engagement Trend ({selectedYear})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="totalEngagement" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Data Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Monthly Statistics ({selectedYear})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-left p-2">New Users</th>
                  <th className="text-left p-2">New Articles</th>
                  <th className="text-left p-2">New Handicrafts</th>
                  <th className="text-left p-2">Total Engagement</th>
                  <th className="text-left p-2">Activity Score</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{monthNames[index]}</td>
                    <td className="p-2">{month.newUsers}</td>
                    <td className="p-2">{month.newArticles}</td>
                    <td className="p-2">{month.newHandiCrafts}</td>
                    <td className="p-2">{month.totalEngagement}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        month.totalActivity > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {month.totalActivity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Cards and Other Sections */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-blue-500 text-4xl">👤➕</div>
              <div>
                <h4 className="text-lg font-semibold">Add New Admin</h4>
                <p className="text-sm text-gray-500">Create and assign roles</p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Add Admin</button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-yellow-500 text-4xl">👑</div>
              <div>
                <h4 className="text-lg font-semibold">Top Active Users</h4>
                <p className="text-sm text-gray-500">View most active users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-purple-600 text-4xl">📦</div>
              <div>
                <h4 className="text-lg font-semibold">Total Handicrafts</h4>
                <p className="text-xl font-bold">{totalHandicrafts}</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <ul className="space-y-2">
              {recentOrders.map((order, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{order.product}</span>
                  <span className="text-gray-500">{order.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Customers */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
            <ul className="space-y-2">
              {topCustomers.map((cust, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-purple-500">👤</span> {cust.name}
                  </span>
                  <span className="text-gray-500">{cust.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Active Users */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Top Active Users</h3>
            <ul className="space-y-2">
              {topActiveUsers.map((user, index) => (
                <li key={user.userId} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-yellow-500">👑</span> {user.userName}
                  </span>
                  <span className="text-gray-500">Score: {user.activityScore}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Articles */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
            <ul className="space-y-2">
              {popularArticles.map((article, index) => (
                <li key={article.id} className="flex justify-between text-sm">
                  <span>{article.title}</span>
                  <span className="text-gray-500">Likes: {article.likeCount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Handicrafts */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Popular Handicrafts</h3>
            <ul className="space-y-2">
              {popularHandiCrafts.map((craft, index) => (
                <li key={craft.id} className="flex justify-between text-sm">
                  <span>{craft.title}</span>
                  <span className="text-gray-500">Favorites: {craft.favoriteCount}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* View Reports Button */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              View All Reports
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}