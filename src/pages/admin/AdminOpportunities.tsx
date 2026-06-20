import { useState } from 'react';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { HardwareBounty, MicroInternship } from '../../types/admin';
import './AdminOpportunities.css';

/**
 * AdminOpportunitiesController: Hardware Bounty & Micro-Internship Controller
 * 
 * CRUD operations for managing bounty and internship listings.
 * Features:
 * - Create, read, update, delete operations
 * - Status management (draft, published, completed, archived)
 * - Applicant tracking
 * - Deadline management
 */
export default function AdminOpportunitiesController() {
  const {
    hardwareBounties,
    microInternships,
    createHardwareBounty,
    updateHardwareBounty,
    deleteHardwareBounty,
    publishHardwareBounty,
    createMicroInternship,
    updateMicroInternship,
    deleteMicroInternship,
    publishMicroInternship,
  } = useAdminActions();

  const [activeTab, setActiveTab] = useState<'bounties' | 'internships'>('bounties');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="admin-opportunities">
      <header className="opportunities-header">
        <h2>Hardware Bounty & Micro-Internship Controller</h2>
        <p>Manage and publish bounty listings and internship opportunities</p>
      </header>

      {/* Tab Navigation */}
      <div className="opportunities-tabs">
        <button
          className={`tab-btn ${activeTab === 'bounties' ? 'active' : ''}`}
          onClick={() => setActiveTab('bounties')}
        >
          Hardware Bounties ({hardwareBounties.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'internships' ? 'active' : ''}`}
          onClick={() => setActiveTab('internships')}
        >
          Micro-Internships ({microInternships.length})
        </button>
      </div>

      {/* Bounties Section */}
      {activeTab === 'bounties' && (
        <BountiesSection
          bounties={hardwareBounties}
          onCreateClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          onCreate={createHardwareBounty}
          onUpdate={updateHardwareBounty}
          onDelete={deleteHardwareBounty}
          onPublish={publishHardwareBounty}
        />
      )}

      {/* Internships Section */}
      {activeTab === 'internships' && (
        <InternshipsSection
          internships={microInternships}
          onCreateClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          onCreate={createMicroInternship}
          onUpdate={updateMicroInternship}
          onDelete={deleteMicroInternship}
          onPublish={publishMicroInternship}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingId ? 'Edit' : 'Create New'} {activeTab === 'bounties' ? 'Bounty' : 'Internship'}</h3>
            <p className="modal-note">
              Use the table controls to manage individual items. Form integration coming soon.
            </p>
            <button className="btn-close" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * BountiesSection: Manage hardware bounties
 */
function BountiesSection({
  bounties,
  onCreateClick,
  onDelete,
  onPublish,
}: {
  bounties: HardwareBounty[];
  onCreateClick: () => void;
  onCreate: any;
  onUpdate: any;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  return (
    <section className="opportunities-section">
      <div className="section-header">
        <h3 className="section-title">Hardware Bounties</h3>
        <button className="btn-primary" onClick={onCreateClick}>
          + New Bounty
        </button>
      </div>

      <div className="table-wrapper">
        <table className="opportunities-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Value</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bounties.map(bounty => (
              <tr key={bounty.id} className={`status-${bounty.status}`}>
                <td className="cell-title">{bounty.title}</td>
                <td className="cell-category">{bounty.category}</td>
                <td className="cell-value">${bounty.value}</td>
                <td className="cell-status">
                  <span className={`status-badge status-${bounty.status}`}>
                    {bounty.status}
                  </span>
                </td>
                <td className="cell-applicants">{bounty.applicants}</td>
                <td className="cell-deadline">
                  {new Date(bounty.deadline).toLocaleDateString()}
                </td>
                <td className="cell-actions">
                  {bounty.status === 'draft' && (
                    <button
                      className="btn-action btn-publish"
                      onClick={() => onPublish(bounty.id)}
                      title="Publish bounty"
                    >
                      📤
                    </button>
                  )}
                  <button
                    className="btn-action btn-edit"
                    title="Edit bounty"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(bounty.id)}
                    title="Delete bounty"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bounties.length === 0 && (
          <div className="empty-state">
            <p>No hardware bounties yet. Create one to get started.</p>
          </div>
        )}
      </div>

      <div className="section-stats">
        <StatCard
          label="Total Value"
          value={`$${bounties.reduce((sum, b) => sum + b.value, 0).toLocaleString()}`}
        />
        <StatCard label="Draft" value={bounties.filter(b => b.status === 'draft').length} />
        <StatCard
          label="Published"
          value={bounties.filter(b => b.status === 'published').length}
        />
        <StatCard label="Total Applicants" value={bounties.reduce((sum, b) => sum + b.applicants, 0)} />
      </div>
    </section>
  );
}

/**
 * InternshipsSection: Manage micro-internships
 */
function InternshipsSection({
  internships,
  onCreateClick,
  onDelete,
  onPublish,
}: {
  internships: MicroInternship[];
  onCreateClick: () => void;
  onCreate: any;
  onUpdate: any;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  return (
    <section className="opportunities-section">
      <div className="section-header">
        <h3 className="section-title">Micro-Internships</h3>
        <button className="btn-primary" onClick={onCreateClick}>
          + New Internship
        </button>
      </div>

      <div className="table-wrapper">
        <table className="opportunities-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Duration</th>
              <th>Compensation</th>
              <th>Status</th>
              <th>Applicants</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map(internship => (
              <tr key={internship.id} className={`status-${internship.status}`}>
                <td className="cell-title">{internship.title}</td>
                <td className="cell-company">{internship.company}</td>
                <td className="cell-duration">{internship.duration}</td>
                <td className="cell-compensation">{internship.compensation}</td>
                <td className="cell-status">
                  <span className={`status-badge status-${internship.status}`}>
                    {internship.status}
                  </span>
                </td>
                <td className="cell-applicants">{internship.applicants}</td>
                <td className="cell-deadline">
                  {new Date(internship.deadline).toLocaleDateString()}
                </td>
                <td className="cell-actions">
                  {internship.status === 'draft' && (
                    <button
                      className="btn-action btn-publish"
                      onClick={() => onPublish(internship.id)}
                      title="Publish internship"
                    >
                      📤
                    </button>
                  )}
                  <button
                    className="btn-action btn-edit"
                    title="Edit internship"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(internship.id)}
                    title="Delete internship"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {internships.length === 0 && (
          <div className="empty-state">
            <p>No micro-internships yet. Create one to get started.</p>
          </div>
        )}
      </div>

      <div className="section-stats">
        <StatCard
          label="Total Compensation"
          value={internships.reduce((sum, i) => sum + parseFloat(i.compensation.replace(/\D/g, '') || 0), 0)
            .toLocaleString()}
        />
        <StatCard label="Draft" value={internships.filter(i => i.status === 'draft').length} />
        <StatCard label="Published" value={internships.filter(i => i.status === 'published').length} />
        <StatCard
          label="Total Applicants"
          value={internships.reduce((sum, i) => sum + i.applicants, 0)}
        />
      </div>
    </section>
  );
}

/**
 * StatCard: Summary statistic card
 */
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
