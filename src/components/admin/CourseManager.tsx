'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export interface ICourseItem {
  _id: string;
  title: { en: string; nl: string };
  slug: string;
  description: { en: string; nl: string };
  category: 'English' | 'Dutch' | 'Driving' | 'Chemistry' | 'Other';
  price: number;
  imageUrl?: string;
  cloudinaryPublicId?: string;
  isActive: boolean;
}

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<ICourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourseItem | null>(null);

  const [form, setForm] = useState({
    titleEn: '',
    titleNl: '',
    slug: '',
    descEn: '',
    descNl: '',
    category: 'Dutch',
    price: 295,
    imageUrl: '',
    cloudinaryPublicId: '',
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses?includeInactive=true');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm({
      titleEn: '',
      titleNl: '',
      slug: '',
      descEn: '',
      descNl: '',
      category: 'Dutch',
      price: 295,
      imageUrl: '',
      cloudinaryPublicId: '',
      isActive: true,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (course: ICourseItem) => {
    setEditingCourse(course);
    setForm({
      titleEn: course.title.en,
      titleNl: course.title.nl,
      slug: course.slug,
      descEn: course.description.en,
      descNl: course.description.nl,
      category: course.category,
      price: course.price,
      imageUrl: course.imageUrl || '',
      cloudinaryPublicId: course.cloudinaryPublicId || '',
      isActive: course.isActive,
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Image upload failed');
      }

      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        imageUrl: data.url,
        cloudinaryPublicId: data.publicId,
      }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMsg('');

    const payload = {
      title: { en: form.titleEn, nl: form.titleNl },
      slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
      description: { en: form.descEn, nl: form.descNl },
      category: form.category,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      cloudinaryPublicId: form.cloudinaryPublicId,
      isActive: form.isActive,
    };

    try {
      let res;
      if (editingCourse) {
        res = await fetch(`/api/courses/${editingCourse._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save course');
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving course');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet u zeker dat u deze cursus wilt verwijderen?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error('Delete course error:', err);
    }
  };

  const toggleActive = async (course: ICourseItem) => {
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !course.isActive }),
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-brand-heading">Cursusbeheer</h3>
          <p className="text-xs text-gray-500">Beheer alle cursussen, prijzen, afbeeldingen en status.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-green hover:bg-brand-hover text-white text-sm font-bold rounded-xl shadow transition-all"
        >
          <AddIcon fontSize="small" />
          <span>Nieuwe Cursus Toevoegen</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Cursussen laden...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-mint text-brand-heading font-bold text-xs uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Afbeelding &amp; Titel</th>
                  <th className="px-6 py-4">Categorie</th>
                  <th className="px-6 py-4">Prijs</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.imageUrl ? (
                          <img
                            src={c.imageUrl}
                            alt={c.title.nl}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-brand-lightMint text-brand-green flex items-center justify-center font-bold text-xs">
                            DT
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-brand-heading">{c.title.nl}</p>
                          <p className="text-xs text-gray-400">/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-600">{c.category}</td>
                    <td className="px-6 py-4 font-bold text-brand-green">€{c.price}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.isActive ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                        <span>{c.isActive ? 'Actief' : 'Inactief'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Bewerken"
                      >
                        <EditIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Verwijderen"
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Cursus Bewerken' : 'Nieuwe Cursus Aanmaken'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errorMsg}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Titel (Nederlands) *
              </label>
              <input
                type="text"
                required
                value={form.titleNl}
                onChange={(e) => setForm({ ...form, titleNl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Titel (Engels) *
              </label>
              <input
                type="text"
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Slug (URL Path) *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="dutch-b1-b2"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Categorie *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              >
                <option value="Dutch">Dutch</option>
                <option value="English">English</option>
                <option value="Driving">Driving</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Prijs (€) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Beschrijving (Nederlands) *
              </label>
              <textarea
                rows={3}
                required
                value={form.descNl}
                onChange={(e) => setForm({ ...form, descNl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Beschrijving (Engels) *
              </label>
              <textarea
                rows={3}
                required
                value={form.descEn}
                onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-none"
              />
            </div>
          </div>

          {/* Cloudinary Image Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Afbeelding Uploaden (Cloudinary)
            </label>
            <div className="flex items-center gap-4">
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Thumbnail Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-heading font-semibold text-xs rounded-xl transition-colors">
                <CloudUploadIcon fontSize="small" />
                <span>{uploading ? 'Uploaden...' : 'Kies Afbeelding'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={saveLoading || uploading}
              className="px-6 py-2 bg-brand-green hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
            >
              {saveLoading ? 'Opslaan...' : 'Cursus Opslaan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManager;
