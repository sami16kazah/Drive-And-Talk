'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export interface IStoryItem {
  _id: string;
  studentName: string;
  courseTaken: string;
  story: { en: string; nl: string };
  imageUrl?: string;
  cloudinaryPublicId?: string;
  date: string;
}

export const StoryManager: React.FC = () => {
  const [stories, setStories] = useState<IStoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<IStoryItem | null>(null);

  const [form, setForm] = useState({
    studentName: '',
    courseTaken: '',
    storyEn: '',
    storyNl: '',
    imageUrl: '',
    cloudinaryPublicId: '',
  });

  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stories');
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openCreateModal = () => {
    setEditingStory(null);
    setForm({
      studentName: '',
      courseTaken: '',
      storyEn: '',
      storyNl: '',
      imageUrl: '',
      cloudinaryPublicId: '',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (story: IStoryItem) => {
    setEditingStory(story);
    setForm({
      studentName: story.studentName,
      courseTaken: story.courseTaken,
      storyEn: story.story.en,
      storyNl: story.story.nl,
      imageUrl: story.imageUrl || '',
      cloudinaryPublicId: story.cloudinaryPublicId || '',
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
        throw new Error(data.error || 'Upload failed');
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
      studentName: form.studentName,
      courseTaken: form.courseTaken,
      story: { en: form.storyEn, nl: form.storyNl },
      imageUrl: form.imageUrl,
      cloudinaryPublicId: form.cloudinaryPublicId,
    };

    try {
      let res;
      if (editingStory) {
        res = await fetch(`/api/stories/${editingStory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save story');
      }

      setIsModalOpen(false);
      fetchStories();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving story');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Wilt u dit succesverhaal verwijderen?')) return;
    try {
      const res = await fetch(`/api/stories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchStories();
    } catch (err) {
      console.error('Delete story error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-brand-heading">Succesverhalen Beheer</h3>
          <p className="text-xs text-gray-500">Beheer de getuigenissen en ervaringen van cursisten.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-green hover:bg-brand-hover text-white text-sm font-bold rounded-xl shadow transition-all"
        >
          <AddIcon fontSize="small" />
          <span>Nieuw Verhaal Toevoegen</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Verhalen laden...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((s) => (
            <div
              key={s._id}
              className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4"
            >
              {s.imageUrl ? (
                <img
                  src={s.imageUrl}
                  alt={s.studentName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-green/30 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-brand-lightMint text-brand-green font-bold flex items-center justify-center flex-shrink-0 text-xl">
                  {s.studentName[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-brand-heading text-base truncate">{s.studentName}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(s)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-brand-green mb-1">{s.courseTaken}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{s.story.nl}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStory ? 'Succesverhaal Bewerken' : 'Nieuw Succesverhaal Aanmaken'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{errorMsg}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Naam Cursist *
              </label>
              <input
                type="text"
                required
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Gevolgde Cursus *
              </label>
              <input
                type="text"
                required
                value={form.courseTaken}
                onChange={(e) => setForm({ ...form, courseTaken: e.target.value })}
                placeholder="bijv. Dutch B1/B2 Immersion"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Verhaal (Nederlands) *
            </label>
            <textarea
              rows={3}
              required
              value={form.storyNl}
              onChange={(e) => setForm({ ...form, storyNl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Verhaal (Engels) *
            </label>
            <textarea
              rows={3}
              required
              value={form.storyEn}
              onChange={(e) => setForm({ ...form, storyEn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green outline-none text-sm resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Foto Cursist (Cloudinary)
            </label>
            <div className="flex items-center gap-4">
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Student Photo"
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-brand-heading font-semibold text-xs rounded-xl transition-colors">
                <CloudUploadIcon fontSize="small" />
                <span>{uploading ? 'Uploaden...' : 'Foto Uploaden'}</span>
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
              {saveLoading ? 'Opslaan...' : 'Verhaal Opslaan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StoryManager;
