'use client'

import { useState } from 'react'
import {
  Shield,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  UserCheck,
  UserX,
  Edit2,
  X,
  Lock,
  Mail,
  User,
  KeyRound,
} from 'lucide-react'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Content Manager' | 'Catalog Editor' | 'Viewer'
  status: 'Active' | 'Inactive'
  lastLogin: string
  avatarColor: string
}

const INITIAL_USERS: AdminUser[] = [
  {
    id: 'USR-01',
    name: 'Aroma Shahzadi',
    email: 'aromashshzadi72@gmail.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2026-09-04 23:02',
    avatarColor: 'bg-red-600',
  },
  {
    id: 'USR-02',
    name: 'Production Lead Manager',
    email: 'production@durablemedical.com',
    role: 'Catalog Editor',
    status: 'Active',
    lastLogin: '2026-09-03 18:40',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'USR-03',
    name: 'Export Manager',
    email: 'exports@durablemedical.com',
    role: 'Content Manager',
    status: 'Active',
    lastLogin: '2026-09-02 11:10',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'USR-04',
    name: 'Quality Inspector Audit',
    email: 'qa@durablemedical.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2026-08-19 09:15',
    avatarColor: 'bg-purple-600',
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<AdminUser['role']>('Content Manager')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenAdd = () => {
    setFormName('')
    setFormEmail('')
    setFormRole('Content Manager')
    setEditingUser(null)
    setShowAddModal(true)
  }

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u)
    setFormName(u.name)
    setFormEmail(u.email)
    setFormRole(u.role)
    setShowAddModal(true)
  }

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim()) return

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: formName.trim(), email: formEmail.trim(), role: formRole }
            : u
        )
      )
      showToast('Admin user details updated successfully!')
    } else {
      const colors = ['bg-[#0B1B3D]', 'bg-[#E31B23]', 'bg-emerald-600', 'bg-purple-600']
      const newU: AdminUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: 'Active',
        lastLogin: 'Never',
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
      }
      setUsers([...users, newU])
      showToast('New admin user created!')
    }

    setShowAddModal(false)
  }

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    )
    showToast('User activation status updated.')
  }

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (user?.role === 'Super Admin') {
      alert('Cannot delete Primary Super Admin user account.')
      return
    }
    if (confirm('Are you sure you want to revoke access for this admin user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      showToast('User removed.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0B1B3D] px-5 py-3 text-white shadow-2xl transition-all">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E31B23]">
            <span>System Administration</span>
            <span>•</span>
            <span>Access Control</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Users & Team Roles
          </h1>
          <p className="text-sm text-gray-600">
            Manage administrative user accounts, edit permissions, and assign role privileges.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-[#0B1B3D] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#E31B23]"
        >
          <Plus className="h-4 w-4" />
          Add Admin User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Total Admin Users</span>
            <Shield className="h-5 w-5 text-[#0B1B3D]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{users.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Active Accounts</span>
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {users.filter((u) => u.status === 'Active').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Super Admins</span>
            <KeyRound className="h-5 w-5 text-[#E31B23]" />
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E31B23]">
            {users.filter((u) => u.role === 'Super Admin').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search admin user by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E31B23] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100/80 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">User Profile</th>
                <th className="px-6 py-3">Role Privilege</th>
                <th className="px-6 py-3">Last Login</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No admin users found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm shadow ${u.avatarColor}`}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          u.role === 'Super Admin'
                            ? 'bg-red-100 text-[#E31B23]'
                            : u.role === 'Catalog Editor'
                            ? 'bg-blue-100 text-blue-800'
                            : u.role === 'Content Manager'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {u.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          u.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {u.status === 'Active' ? (
                          <>
                            <UserCheck className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                          title="Edit User Role"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Revoke User Access"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Edit Admin Permissions' : 'Create New Admin User'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#E31B23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="tariq@durablemedical.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#E31B23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Role & Permission Privilege *
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as AdminUser['role'])}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#E31B23] focus:outline-none"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Catalog Editor">Catalog Editor (Products & Categories)</option>
                  <option value="Content Manager">Content Manager (Blogs & Pages)</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#0B1B3D] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#E31B23]"
                >
                  {editingUser ? 'Update Permissions' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
