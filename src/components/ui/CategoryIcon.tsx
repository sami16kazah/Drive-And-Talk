import React from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkIcon from '@mui/icons-material/Work';
import CalculateIcon from '@mui/icons-material/Calculate';
import ComputerIcon from '@mui/icons-material/Computer';
import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const ICONS: Record<string, React.ElementType> = {
  translate: TranslateIcon,
  car: DirectionsCarIcon,
  language: LanguageIcon,
  science: ScienceIcon,
  school: SchoolIcon,
  book: MenuBookIcon,
  work: WorkIcon,
  calculate: CalculateIcon,
  computer: ComputerIcon,
  brush: BrushIcon,
  music: MusicNoteIcon,
  sports: SportsSoccerIcon,
};

/** Tailwind classes per color name (kept literal so Tailwind picks them up). */
export const CATEGORY_COLORS: Record<string, { card: string; icon: string }> = {
  emerald: { card: 'bg-emerald-50 border-emerald-100', icon: 'text-brand-green' },
  blue: { card: 'bg-blue-50 border-blue-100', icon: 'text-blue-600' },
  purple: { card: 'bg-purple-50 border-purple-100', icon: 'text-purple-600' },
  amber: { card: 'bg-amber-50 border-amber-100', icon: 'text-amber-600' },
  rose: { card: 'bg-rose-50 border-rose-100', icon: 'text-rose-600' },
  sky: { card: 'bg-sky-50 border-sky-100', icon: 'text-sky-600' },
  gray: { card: 'bg-gray-50 border-gray-200', icon: 'text-gray-600' },
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] || SchoolIcon;
  return <Icon className={className} />;
}

export default CategoryIcon;
