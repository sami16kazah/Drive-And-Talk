'use client';

import React, { useState } from 'react';
import EnrollmentModal from './EnrollmentModal';

interface EnrollmentModalButtonProps {
  courseId?: string;
  courseTitle?: string;
  className?: string;
  buttonText?: string;
}

export const EnrollmentModalButton: React.FC<EnrollmentModalButtonProps> = ({
  courseId,
  courseTitle,
  className,
  buttonText = 'Inschrijven',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ||
          'px-4 py-2 bg-brand-green hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow transition-all'
        }
      >
        {buttonText}
      </button>

      <EnrollmentModal
        isOpen={open}
        onClose={() => setOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
      />
    </>
  );
};

export default EnrollmentModalButton;
