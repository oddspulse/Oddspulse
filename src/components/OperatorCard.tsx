'use client';

import { Operator } from '@/lib/types';

interface OperatorCardProps {
  operator: Operator;
}

export default function OperatorCard({ operator }: OperatorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Logo Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center justify-center h-24">
        <img
          src={operator.brandLogoUrl}
          alt={`${operator.name} logo`}
          className="max-h-16 max-w-full object-contain"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Brand Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {operator.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {operator.regionTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded"
            >
              {tag}
            </span>
          ))}
          {operator.productTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bonus Headline */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-green-600 mb-2">
            {operator.bonusHeadline}
          </p>
          {operator.detailedOffer && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {operator.detailedOffer}
            </p>
          )}
        </div>

        {/* RTP Info (if casino) */}
        {operator.rtpInfo && (
          <div className="mb-3">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">RTP:</span> {operator.rtpInfo}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <a
          href={operator.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105"
        >
          Claim Offer →
        </a>
      </div>
    </div>
  );
}
