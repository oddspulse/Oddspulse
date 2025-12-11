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
        // Create new operator
        await fetch('/api/operators', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else if (editingId) {
        // Update existing operator
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-blue-100 mt-2">Manage operators and offers</p>
            </div>
            <Link
              href="/"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
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
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            + Add New Operator
          </button>
        </div>

        {/* Edit/Create Form */}
        {(editingId || isCreating) && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {isCreating ? 'Create New Operator' : 'Edit Operator'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID (unique, lowercase, no spaces)
                </label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => updateFormField('id', e.target.value)}
                  disabled={!isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={formData.brandLogoUrl || ''}
                  onChange={(e) => updateFormField('brandLogoUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliate URL
                </label>
                <input
                  type="text"
                  value={formData.affiliateUrl || ''}
                  onChange={(e) => updateFormField('affiliateUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.regionTags?.join(', ') || ''}
                  onChange={(e) => updateTags('regionTags', e.target.value)}
                  placeholder="US, Canada, UK"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.productTags?.join(', ') || ''}
                  onChange={(e) => updateTags('productTags', e.target.value)}
                  placeholder="Sports, Casino"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus Headline
                </label>
                <input
                  type="text"
                  value={formData.bonusHeadline || ''}
                  onChange={(e) => updateFormField('bonusHeadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Offer
                </label>
                <textarea
                  value={formData.detailedOffer || ''}
                  onChange={(e) => updateFormField('detailedOffer', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RTP Info (optional)
                </label>
                <input
                  type="text"
                  value={formData.rtpInfo || ''}
                  onChange={(e) => updateFormField('rtpInfo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => updateFormField('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Operators Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operators.map((operator) => (
                <tr key={operator.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{operator.name}</div>
                    <div className="text-sm text-gray-500">{operator.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {operator.regionTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
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
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {operator.bonusHeadline}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(operator)}
                      className="text-blue-600 hover:text-blue-900 font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(operator.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
