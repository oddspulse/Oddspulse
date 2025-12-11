'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Operator } from '@/lib/types';

export default function AdminPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Operator>>({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    const response = await fetch('/api/operators');
    const data = await response.json();
    setOperators(data);
  };

  const handleEdit = (operator: Operator) => {
    setEditingId(operator.id);
    setFormData(operator);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      brandLogoUrl: 'https://via.placeholder.com/150x60?text=NewOperator',
      regionTags: [],
      productTags: [],
      bonusHeadline: '',
      detailedOffer: '',
      affiliateUrl: '',
      notes: '',
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await fetch('/api/operators', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else if (editingId) {
        await fetch(`/api/operators/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setEditingId(null);
      setIsCreating(false);
      setFormData({});
      fetchOperators();
    } catch (error) {
      console.error('Error saving operator:', error);
      alert('Failed to save operator');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this operator?')) return;

    try {
      await fetch(`/api/operators/${id}`, {
        method: 'DELETE',
      });
      fetchOperators();
    } catch (error) {
      console.error('Error deleting operator:', error);
      alert('Failed to delete operator');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
  };

  const updateFormField = (field: keyof Operator, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateTags = (field: 'regionTags' | 'productTags', value: string) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    updateFormField(field, tags);
  };

  return (
    <div className="min-h-screen bg-gradient-casino">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-casinoBlack/95 backdrop-blur-sm border-b-2 border-casinoGold/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">⚙️</span>
                <h1 className="text-3xl font-heading font-bold text-casinoGold">Admin Panel</h1>
              </div>
              <p className="text-textSecondary mt-2">Manage operators and offers</p>
            </div>
            <Link
              href="/"
              className="bg-gradient-casino-reverse border-2 border-casinoGreen/40 text-casinoGreen px-6 py-3 rounded-lg font-heading font-semibold hover:bg-casinoGreen hover:text-white hover:shadow-glow-green transition-all duration-300 uppercase tracking-wide text-sm"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={handleCreate}
            className="bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm"
          >
            + Add New Operator
          </button>
        </div>

        {/* Edit/Create Form */}
        {(editingId || isCreating) && (
          <div className="bg-gradient-casino-reverse shadow-card-dark rounded-xl p-6 mb-8 border-2 border-casinoGold/30">
            <h2 className="text-2xl font-heading font-bold mb-6 text-casinoGold flex items-center gap-2">
              <span>{isCreating ? '✨' : '✏️'}</span>
              {isCreating ? 'Create New Operator' : 'Edit Operator'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  ID (unique, lowercase, no spaces)
                </label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => updateFormField('id', e.target.value)}
                  disabled={!isCreating}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-casinoGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormField('name', e.target.value)}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={formData.brandLogoUrl || ''}
                  onChange={(e) => updateFormField('brandLogoUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Affiliate URL
                </label>
                <input
                  type="text"
                  value={formData.affiliateUrl || ''}
                  onChange={(e) => updateFormField('affiliateUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Region Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.regionTags?.join(', ') || ''}
                  onChange={(e) => updateTags('regionTags', e.target.value)}
                  placeholder="US, Canada, UK"
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoBlue/30 rounded-lg text-textPrimary placeholder-textSecondary focus:ring-2 focus:ring-casinoBlue outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Product Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.productTags?.join(', ') || ''}
                  onChange={(e) => updateTags('productTags', e.target.value)}
                  placeholder="Sports, Casino"
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGreen/30 rounded-lg text-textPrimary placeholder-textSecondary focus:ring-2 focus:ring-casinoGreen outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Bonus Headline
                </label>
                <input
                  type="text"
                  value={formData.bonusHeadline || ''}
                  onChange={(e) => updateFormField('bonusHeadline', e.target.value)}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Detailed Offer
                </label>
                <textarea
                  value={formData.detailedOffer || ''}
                  onChange={(e) => updateFormField('detailedOffer', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  RTP Info (optional)
                </label>
                <input
                  type="text"
                  value={formData.rtpInfo || ''}
                  onChange={(e) => updateFormField('rtpInfo', e.target.value)}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGreen/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGreen outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textSecondary mb-2 uppercase tracking-wide">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  className="w-full px-4 py-3 bg-casinoBlack border-2 border-casinoGold/30 rounded-lg text-textPrimary focus:ring-2 focus:ring-casinoGold outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-gradient-green hover:shadow-glow-green text-white font-heading font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide text-sm"
              >
                💾 Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-casinoBlack3 border-2 border-textSecondary/30 text-textSecondary font-heading font-bold py-3 px-8 rounded-lg hover:bg-textSecondary/10 transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Operators Table */}
        <div className="bg-gradient-casino-reverse shadow-card-dark rounded-xl overflow-hidden border border-casinoGold/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-casinoGold/10">
              <thead className="bg-casinoBlack">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-heading font-bold text-casinoGold uppercase tracking-wider">
                    Operator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-heading font-bold text-casinoGold uppercase tracking-wider">
                    Regions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-heading font-bold text-casinoGold uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-heading font-bold text-casinoGold uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-heading font-bold text-casinoGold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-casinoGold/5">
                {operators.map((operator, index) => (
                  <tr
                    key={operator.id}
                    className={`${
                      index % 2 === 0 ? 'bg-casinoBlack2/50' : 'bg-casinoBlack/30'
                    } hover:bg-casinoGold/5 transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-textPrimary">{operator.name}</div>
                      <div className="text-sm text-textSecondary">{operator.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {operator.regionTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-casinoBlue/20 text-casinoBlue border border-casinoBlue/30 text-xs rounded uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {operator.productTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-casinoGreen/20 text-casinoGreen border border-casinoGreen/30 text-xs rounded uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-textPrimary max-w-xs truncate">
                        {operator.bonusHeadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(operator)}
                        className="text-casinoBlue hover:text-blue-300 font-semibold mr-4 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(operator.id)}
                        className="text-casinoRed hover:text-red-400 font-semibold transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
