'use client';

import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FIELD_OPTIONS } from '@/content/globalDefaults';

type Scope = 'nl' | 'en' | 'global';

const SCOPES: { id: Scope; label: string; description: string }[] = [
  { id: 'nl', label: '🇳🇱 Teksten Nederlands', description: 'Alle teksten van de Nederlandse website.' },
  { id: 'en', label: '🇬🇧 Teksten Engels', description: 'Alle teksten van de Engelse website.' },
  {
    id: 'global',
    label: '⚙️ Algemeen',
    description: 'Contactgegevens, logo & afbeeldingen, kleuren, homepage-indeling, categorieën en e-mailsjablonen.',
  },
];

const SECTION_LABELS: Record<string, string> = {
  // Messages
  Metadata: 'SEO (paginatitel & beschrijving)',
  Navigation: 'Navigatiemenu',
  SchoolInfo: 'Schoolinformatie (tijden, adres)',
  Hero: 'Home – Hero banner',
  Home: 'Home – Secties',
  Forms: 'Formulieren (labels)',
  Courses: 'Cursusoverzicht',
  CourseDetail: 'Cursusdetailpagina & reviews',
  EnrollmentModal: 'Inschrijfformulier',
  About: 'Over ons',
  SuccessStories: 'Succesverhalen',
  Contact: 'Contactpagina',
  Footer: 'Footer',
  // Global
  contact: 'Contactgegevens',
  branding: 'Logo & afbeeldingen',
  theme: 'Kleuren (thema)',
  homepage: 'Homepage-indeling',
  links: 'Links & social media',
  categories: 'Cursuscategorieën',
  email: 'E-mailsjablonen',
};

const FIELD_HINTS: Record<string, string> = {
  whatsappNumber: 'Alleen cijfers inclusief landcode, bijv. 31612345678.',
  value: 'Interne sleutel die aan cursussen gekoppeld is. Wijzigen ontkoppelt bestaande cursussen.',
  showOnHome: 'Toon deze categorie als kaart op de homepage.',
  privacyUrl: 'Pad op de site (bijv. /contact) of volledige URL.',
  termsUrl: 'Pad op de site (bijv. /contact) of volledige URL.',
  faviconUrl: 'Optioneel. Leeg = standaard favicon.',
};

const KEY_LABELS: Record<string, string> = { nl: 'Nederlands', en: 'English' };

function humanize(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

const isPlainObject = (v: unknown): v is Record<string, any> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isImageKey = (name: string) => /(image|logo|favicon|photo|avatar)(url)?$/i.test(name);
const isColorKey = (name: string) => /color$/i.test(name) && name !== 'color';
const isValidHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

/** Build an empty item shaped like `template` (used when adding list items). */
function blankFrom(template: any, key = ''): any {
  if (Array.isArray(template)) return [];
  if (isPlainObject(template)) {
    const out: Record<string, any> = {};
    for (const k of Object.keys(template)) out[k] = blankFrom(template[k], k);
    return out;
  }
  if (typeof template === 'number') return 0;
  if (typeof template === 'boolean') return true;
  if (typeof template === 'string' && (FIELD_OPTIONS[key] || isColorKey(key))) return template;
  return '';
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none text-sm bg-white';

// ---------------------------------------------------------------------------
// Field components
// ---------------------------------------------------------------------------

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload mislukt');
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload mislukt');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="w-20 h-20 rounded-xl object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400">
            Geen
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
          <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-brand-heading font-semibold text-xs rounded-xl transition-colors">
            <CloudUploadIcon fontSize="small" />
            <span>{uploading ? 'Uploaden...' : 'Afbeelding uploaden'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PrimitiveField({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string | number | boolean;
  onChange: (v: any) => void;
}) {
  if (typeof value === 'boolean') {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-brand-green' : 'bg-gray-300'
        }`}
        aria-pressed={value}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    );
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className={`${inputClass} max-w-[160px]`}
      />
    );
  }

  const str = String(value ?? '');

  if (FIELD_OPTIONS[name]) {
    const options = FIELD_OPTIONS[name].includes(str) || !str ? FIELD_OPTIONS[name] : [str, ...FIELD_OPTIONS[name]];
    return (
      <select value={str} onChange={(e) => onChange(e.target.value)} className={`${inputClass} max-w-[220px]`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (isColorKey(name)) {
    return (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={isValidHex(str) ? str : '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer bg-white"
        />
        <input
          type="text"
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} max-w-[140px] font-mono`}
        />
        {!isValidHex(str) && <span className="text-xs text-red-600">Ongeldige kleur (gebruik #RRGGBB)</span>}
      </div>
    );
  }

  if (isImageKey(name)) {
    return <ImageField value={str} onChange={onChange} />;
  }

  const multiline = str.length > 60 || /(text|description|subtitle|message|story)$/i.test(name);
  if (multiline) {
    return (
      <textarea
        value={str}
        rows={Math.min(8, Math.max(2, Math.ceil(str.length / 90)))}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y`}
      />
    );
  }

  return <input type="text" value={str} onChange={(e) => onChange(e.target.value)} className={inputClass} />;
}

function ArrayField({
  name,
  value,
  template,
  onChange,
}: {
  name: string;
  value: any[];
  template: any;
  onChange: (v: any[]) => void;
}) {
  const itemTemplate = Array.isArray(template) && template.length > 0 ? template[0] : value[0] ?? '';

  const updateItem = (idx: number, item: any) => {
    const next = [...value];
    next[idx] = item;
    onChange(next);
  };
  const removeItem = (idx: number) => {
    if (!confirm('Dit item verwijderen?')) return;
    onChange(value.filter((_, i) => i !== idx));
  };
  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };
  const addItem = () => onChange([...value, blankFrom(itemTemplate, name)]);

  const controls = (idx: number) => (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        type="button"
        onClick={() => moveItem(idx, -1)}
        disabled={idx === 0}
        className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
        title="Omhoog"
      >
        <ArrowUpwardIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={() => moveItem(idx, 1)}
        disabled={idx === value.length - 1}
        className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
        title="Omlaag"
      >
        <ArrowDownwardIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={() => removeItem(idx)}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
        title="Verwijderen"
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      {value.map((item, idx) =>
        isPlainObject(item) ? (
          <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-500 uppercase">#{idx + 1}</span>
              {controls(idx)}
            </div>
            <ObjectFields value={item} template={itemTemplate} onChange={(v) => updateItem(idx, v)} />
          </div>
        ) : (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-xs font-bold text-gray-400 pt-3 w-6 text-right">{idx + 1}.</span>
            <div className="flex-1">
              <PrimitiveField name={name} value={item} onChange={(v) => updateItem(idx, v)} />
            </div>
            <div className="pt-1.5">{controls(idx)}</div>
          </div>
        )
      )}
      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-green bg-brand-lightMint hover:bg-brand-green hover:text-white rounded-xl transition-colors"
      >
        <AddIcon fontSize="small" />
        <span>Item toevoegen</span>
      </button>
    </div>
  );
}

function FieldRow({
  name,
  value,
  template,
  onChange,
}: {
  name: string;
  value: any;
  template: any;
  onChange: (v: any) => void;
}) {
  const label = humanize(name);
  const hint = FIELD_HINTS[name];

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        <label className="block text-xs font-bold text-brand-heading uppercase tracking-wide">{label}</label>
        {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
        <ArrayField name={name} value={value} template={template} onChange={onChange} />
      </div>
    );
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    const isTranslationPair = keys.length > 0 && keys.every((k) => k === 'nl' || k === 'en');
    return (
      <fieldset className="p-4 rounded-2xl border border-gray-200 space-y-3">
        <legend className="px-2 text-xs font-bold text-brand-heading uppercase tracking-wide">{label}</legend>
        {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
        <ObjectFields
          value={value}
          template={template}
          onChange={onChange}
          columns={isTranslationPair ? 2 : 1}
        />
      </fieldset>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-brand-heading uppercase tracking-wide">{label}</label>
      <PrimitiveField name={name} value={value} onChange={onChange} />
      {hint && <p className="text-[11px] text-gray-500">{hint}</p>}
    </div>
  );
}

function ObjectFields({
  value,
  template,
  onChange,
  columns = 1,
}: {
  value: Record<string, any>;
  template: any;
  onChange: (v: Record<string, any>) => void;
  columns?: 1 | 2;
}) {
  return (
    <div className={columns === 2 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
      {Object.keys(value).map((key) => (
        <FieldRow
          key={key}
          name={key}
          value={value[key]}
          template={isPlainObject(template) ? template[key] : undefined}
          onChange={(v) => onChange({ ...value, [key]: v })}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main editor
// ---------------------------------------------------------------------------

export const ContentEditor: React.FC = () => {
  const [scope, setScope] = useState<Scope>('nl');
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [defaults, setDefaults] = useState<Record<string, any> | null>(null);
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async (sc: Scope) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/content?scope=${sc}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Laden mislukt');
      setData(json.data);
      setDefaults(json.defaults);
      setSection((prev) => (prev && prev in json.data ? prev : Object.keys(json.data)[0] || ''));
      setDirty(false);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Laden mislukt' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(scope);
  }, [scope, load]);

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const switchScope = (sc: Scope) => {
    if (sc === scope) return;
    if (dirty && !confirm('U heeft niet-opgeslagen wijzigingen. Toch wisselen?')) return;
    setSection('');
    setScope(sc);
  };

  const updateSection = (value: any) => {
    if (!data) return;
    setData({ ...data, [section]: value });
    setDirty(true);
    setMsg(null);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Opslaan mislukt');
      setData(json.data);
      setDirty(false);
      setMsg({ type: 'success', text: 'Wijzigingen opgeslagen en live op de website.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Opslaan mislukt' });
    } finally {
      setSaving(false);
    }
  };

  const resetSection = () => {
    if (!data || !defaults || !(section in defaults)) return;
    if (!confirm(`"${SECTION_LABELS[section] || section}" terugzetten naar de standaardinhoud? (Pas definitief na Opslaan)`)) return;
    updateSection(JSON.parse(JSON.stringify(defaults[section])));
  };

  const resetAll = async () => {
    const scopeLabel = SCOPES.find((s) => s.id === scope)?.label;
    if (!confirm(`ALLE inhoud van "${scopeLabel}" terugzetten naar de standaard? Dit kan niet ongedaan worden.`)) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/content?scope=${scope}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Terugzetten mislukt');
      setData(json.data);
      setDirty(false);
      setMsg({ type: 'success', text: 'Inhoud teruggezet naar de standaard.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Terugzetten mislukt' });
    } finally {
      setSaving(false);
    }
  };

  const sections = data ? Object.keys(data) : [];
  const currentScope = SCOPES.find((s) => s.id === scope)!;
  const previewHref = `/${scope === 'en' ? 'en' : 'nl'}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-brand-heading">Website Inhoud (Headless CMS)</h3>
          <p className="text-xs text-gray-500">
            Pas alle teksten, afbeeldingen, contactgegevens, kleuren en lijsten van de website aan.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-heading border border-gray-200 hover:bg-gray-50 rounded-xl"
          >
            <OpenInNewIcon fontSize="small" />
            <span>Website bekijken</span>
          </a>
          <button
            type="button"
            onClick={resetAll}
            disabled={saving || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-xl disabled:opacity-50"
          >
            <RestartAltIcon fontSize="small" />
            <span>Alles terugzetten</span>
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || loading || !dirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green hover:bg-brand-hover text-white font-bold text-sm rounded-xl shadow transition-all disabled:opacity-50"
          >
            <SaveIcon fontSize="small" />
            <span>{saving ? 'Opslaan...' : dirty ? 'Wijzigingen opslaan' : 'Opgeslagen'}</span>
          </button>
        </div>
      </div>

      {/* Scope switcher */}
      <div className="flex flex-wrap items-center gap-2">
        {SCOPES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => switchScope(s.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              scope === s.id
                ? 'bg-brand-dark text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-brand-mint'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 -mt-3">{currentScope.description}</p>

      {msg && (
        <div
          className={`p-3 rounded-xl text-sm font-semibold ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {loading || !data ? (
        <div className="py-12 text-center text-gray-400">Inhoud laden...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sections list */}
          <nav className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1 lg:sticky lg:top-24">
            {sections.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  section === key ? 'bg-brand-green text-white' : 'text-gray-700 hover:bg-brand-mint'
                }`}
              >
                {SECTION_LABELS[key] || humanize(key)}
              </button>
            ))}
          </nav>

          {/* Section fields */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
            {section && data[section] !== undefined && (
              <>
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-100">
                  <h4 className="text-lg font-bold text-brand-heading">
                    {SECTION_LABELS[section] || humanize(section)}
                  </h4>
                  {defaults && section in defaults && (
                    <button
                      type="button"
                      onClick={resetSection}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600"
                    >
                      <RestartAltIcon fontSize="inherit" />
                      <span>Sectie terugzetten</span>
                    </button>
                  )}
                </div>
                {scope !== 'global' && (
                  <p className="text-[11px] text-gray-400">
                    Tip: gebruik geen accolades {'{ }'} in teksten; deze zijn gereserveerd voor het vertaalsysteem.
                  </p>
                )}
                {isPlainObject(data[section]) ? (
                  <ObjectFields
                    value={data[section]}
                    template={defaults?.[section]}
                    onChange={updateSection}
                  />
                ) : (
                  <FieldRow
                    name={section}
                    value={data[section]}
                    template={defaults?.[section]}
                    onChange={updateSection}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-hover text-white font-extrabold text-sm rounded-2xl shadow-lg disabled:opacity-50"
          >
            <SaveIcon fontSize="small" />
            <span>{saving ? 'Opslaan...' : 'Wijzigingen opslaan'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
