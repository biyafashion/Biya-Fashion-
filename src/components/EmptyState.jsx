import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'We could not find anything matching your request.',
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#F8F8F8] border border-[#E5E5E5] rounded-3xl max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#064C32] shadow-sm mb-4 border border-[#E5E5E5]">
        <Icon className="w-8 h-8 text-[#064C32]" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-[#666666] max-w-sm mb-6 leading-relaxed">{description}</p>

      {actionLabel && (actionTo || onAction) && (
        actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#064C32] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#033B27] active:scale-95 transition shadow-sm hover:shadow-md"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#064C32] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#033B27] active:scale-95 transition shadow-sm hover:shadow-md"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
