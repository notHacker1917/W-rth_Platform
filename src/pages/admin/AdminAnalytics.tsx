import { useMemo } from 'react';
import { MOCK_ANALYTICS_METRICS, MOCK_ROI_DATA } from '../../data/adminMockData';
import type { AnalyticsMetric, ROIDataPoint } from '../../types/admin';
import './AdminAnalytics.css';

/**
 * AdminAnalyticsDashboard: Executive ROI & Analytics Dashboard
 * 
 * High-level visual metrics and charts showing platform performance.
 * Features:
 * - Key performance indicators (KPIs)
 * - ROI trend visualization
 * - Engagement metrics
 * - Revenue tracking
 */
export default function AdminAnalyticsDashboard() {
  const metrics = useMemo(() => MOCK_ANALYTICS_METRICS, []);
  const roiData = useMemo(() => MOCK_ROI_DATA, []);

  const calculateTotalRevenue = () => {
    return roiData.reduce((sum, data) => sum + data.revenue, 0);
  };

  const calculateAverageEngagement = () => {
    const avg = roiData.reduce((sum, data) => sum + data.engagement, 0) / roiData.length;
    return avg.toFixed(1);
  };

  const calculateAverageROI = () => {
    const avg = roiData.reduce((sum, data) => sum + data.roi, 0) / roiData.length;
    return avg.toFixed(1);
  };

  return (
    <div className="admin-analytics">
      <header className="admin-analytics-header">
        <h2>Executive ROI & Analytics Dashboard</h2>
        <p>High-level platform performance metrics and trends</p>
      </header>

      {/* Key Metrics Grid */}
      <section className="analytics-metrics-grid">
        <h3 className="section-title">Key Performance Indicators</h3>
        <div className="metrics-container">
          {metrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* ROI Summary Cards */}
      <section className="analytics-summary">
        <h3 className="section-title">Performance Summary</h3>
        <div className="summary-cards">
          <SummaryCard
            title="Total Revenue (12M)"
            value={`$${(calculateTotalRevenue() / 1000000).toFixed(2)}M`}
            subtitle="Across all streams"
            icon="💰"
          />
          <SummaryCard
            title="Avg Engagement"
            value={`${calculateAverageEngagement()}%`}
            subtitle="User engagement rate"
            icon="📊"
          />
          <SummaryCard
            title="Average ROI"
            value={`${calculateAverageROI()}%`}
            subtitle="Return on investment"
            icon="📈"
          />
          <SummaryCard
            title="Active Users"
            value="18.4K"
            subtitle="Monthly active users"
            icon="👥"
          />
        </div>
      </section>

      {/* ROI Chart Data Table */}
      <section className="analytics-chart-section">
        <h3 className="section-title">Monthly Trends</h3>
        <div className="chart-container">
          <ROIChart data={roiData} />
        </div>
      </section>

      {/* Detailed Table */}
      <section className="analytics-table-section">
        <h3 className="section-title">Detailed Monthly Data</h3>
        <div className="table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Engagement %</th>
                <th>ROI %</th>
              </tr>
            </thead>
            <tbody>
              {roiData.map((data, idx) => (
                <tr key={idx}>
                  <td className="table-month">{data.month}</td>
                  <td className="table-revenue">${(data.revenue / 1000).toFixed(0)}K</td>
                  <td className="table-engagement">{data.engagement}%</td>
                  <td className="table-roi">{data.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/**
 * MetricCard: Individual KPI card component
 */
function MetricCard({ metric }: { metric: AnalyticsMetric }) {
  const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
  const trendColor = metric.trend === 'up' ? '#10b981' : metric.trend === 'down' ? '#ef4444' : '#9ca3af';

  return (
    <div className="metric-card">
      <div className="metric-header">
        <h4 className="metric-label">{metric.label}</h4>
        <span
          className="metric-trend"
          style={{ color: trendColor }}
        >
          {trendIcon} {Math.abs(metric.change)}%
        </span>
      </div>
      <p className="metric-value">{metric.value}</p>
      <span className="metric-date">{metric.timestamp}</span>
    </div>
  );
}

/**
 * SummaryCard: Summary performance card
 */
function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>
      <div className="summary-content">
        <h4 className="summary-title">{title}</h4>
        <p className="summary-value">{value}</p>
        <span className="summary-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}

/**
 * ROIChart: Simple ASCII-style ROI visualization
 */
function ROIChart({ data }: { data: ROIDataPoint[] }) {
  const maxROI = Math.max(...data.map(d => d.roi));
  const chartHeight = 200;

  return (
    <div className="roi-chart">
      <div className="chart-bars">
        {data.map((point, idx) => {
          const heightPercent = (point.roi / maxROI) * 100;
          return (
            <div key={idx} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: `hsl(${200 + idx * 2}, 75%, 50%)`,
                }}
                title={`${point.month}: ${point.roi}% ROI`}
              />
              <span className="chart-label">{point.month}</span>
            </div>
          );
        })}
      </div>
      <div className="chart-legend">
        <span>ROI % by Month</span>
      </div>
    </div>
  );
}
