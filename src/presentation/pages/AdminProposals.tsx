import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import ConfirmDialog from '../components/ConfirmDialog'
import '../styles/admin-proposals.css'

interface Proposal {
  route_id: string
  title: string
  description?: string
  created_by_member?: string
  status: string
  created_at: string
}

const AdminProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [action, setAction] = useState<'PUBLISHED' | 'REJECTED'>('PUBLISHED')
  const [reason, setReason] = useState('')

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/api/v1/admin/routes/proposals/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProposals(data)
      }
    } catch (error) {
      console.error('Error fetching proposals', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (proposal: Proposal, reviewAction: 'PUBLISHED' | 'REJECTED') => {
    setSelectedProposal(proposal)
    setAction(reviewAction)
    if (reviewAction === 'PUBLISHED') {
      submitReview(proposal.route_id, reviewAction, '')
    } else {
      setShowConfirm(true)
    }
  }

  const submitReview = async (routeId: string, status: 'PUBLISHED' | 'REJECTED', rejectReason: string) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/routes/${routeId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, reason: rejectReason }),
      })

      if (response.ok) {
        alert(`Propuesta ${status === 'PUBLISHED' ? 'aprobada' : 'rechazada'} correctamente`)
        setProposals(proposals.filter((p) => p.route_id !== routeId))
      } else {
        alert('Error al procesar la propuesta')
      }
    } catch (error) {
      alert('Error de conexión')
    }
    setShowConfirm(false)
    setReason('')
    setSelectedProposal(null)
  }

  return (
    <AdminLayout>
      <div className="admin-proposals-page">
        <div className="page-header">
          <h2>Propuestas Pendientes</h2>
          <span className="badge">{proposals.length}</span>
        </div>

        {loading ? (
          <p className="info-message">Cargando propuestas...</p>
        ) : proposals.length === 0 ? (
          <div className="empty-state">
            <p className="info-message">No hay propuestas pendientes de revisión</p>
          </div>
        ) : (
          <div className="proposals-list">
            {proposals.map((proposal) => (
              <div key={proposal.route_id} className="proposal-card">
                <div className="proposal-header">
                  <h3>{proposal.title}</h3>
                  <span className="status-badge">{proposal.status}</span>
                </div>

                {proposal.description && <p className="proposal-description">{proposal.description}</p>}

                <div className="proposal-meta">
                  <span className="date">{new Date(proposal.created_at).toLocaleDateString('es-ES')}</span>
                </div>

                <div className="proposal-actions">
                  <button
                    onClick={() => handleReview(proposal, 'PUBLISHED')}
                    className="btn-success"
                  >
                    ✓ Aprobar
                  </button>
                  <button
                    onClick={() => handleReview(proposal, 'REJECTED')}
                    className="btn-danger"
                  >
                    ✕ Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          isOpen={showConfirm}
          title="Rechazar Propuesta"
          message="¿Estás seguro de que deseas rechazar esta propuesta? El socio recibirá una notificación."
          confirmText="Rechazar"
          cancelText="Cancelar"
          isDangerous={true}
          onConfirm={() => {
            if (selectedProposal) {
              submitReview(selectedProposal.route_id, 'REJECTED', reason)
            }
          }}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </AdminLayout>
  )
}

export default AdminProposals
