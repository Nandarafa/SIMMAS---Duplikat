'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import SiswaLayout from '@/components/SiswaLayout'
import { useAuth } from '@/context/AuthContext'

export default function UbahPasswordPage() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!currentUser) router.push('/login')
  }, [currentUser, router])

  if (!currentUser) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.currentPassword) newErrors.currentPassword = 'Password saat ini harus diisi'
    if (!formData.newPassword) newErrors.newPassword = 'Password baru harus diisi'
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password baru minimal 6 karakter'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Konfirmasi password harus diisi'
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok'
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword)
      newErrors.newPassword = 'Password baru harus berbeda dengan password lama'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setSuccess(false)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => router.push('/dashboard/siswa'), 2000)
    } catch {
      setErrors({ submit: 'Gagal mengubah password. Pastikan password lama benar.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SiswaLayout title="Ubah Kata Sandi">
      <div className="max-w-lg">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-6">
          <Lock className="h-5 w-5 text-blue-600" />
          Ubah Kata Sandi
        </h1>

        {/* Success */}
        {success && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-emerald-900 font-semibold text-sm">Password berhasil diubah!</p>
              <p className="text-emerald-700 text-xs mt-0.5">Anda akan diarahkan ke dashboard...</p>
            </div>
          </div>
        )}

        {/* Error submit */}
        {errors.submit && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-red-900 text-sm font-medium">{errors.submit}</p>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Password Saat Ini <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Masukkan password saat ini"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    errors.currentPassword ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>}
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    errors.newPassword ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Ulangi Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ketik ulang password baru"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-slate-200'
                  }`}
                />
                <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || success}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Password'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </SiswaLayout>
  )
}
