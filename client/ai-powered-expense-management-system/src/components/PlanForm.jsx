import React, { useState } from 'react';
import { motion, transform } from 'framer-motion';
import { Cross, X } from 'lucide-react';

function PlanForm({ initialValues, onSubmit, onCancel, mode = "create" }) {
  const [form, setForm] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [friendName, setFriendName] = useState('');

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.membersCount || Number(form.membersCount) < 2) errors.membersCount = "At least 2 members required";
    if (form.friendsList.length !== Number(form.membersCount) - 1)
      errors.friendsList = `Add exactly ${form.membersCount ? Number(form.membersCount) - 1 : 0} friends`;
    if (new Set(form.friendsList.map(f => f.toLowerCase())).size !== form.friendsList.length) errors.friendsList = "Friend names must be unique";
    return errors;
  };

  const handleAddFriend = () => {
    const name = friendName.trim();
    if (
      name &&
      !form.friendsList.map(f => f.toLowerCase()).includes(name.toLowerCase()) &&
      form.friendsList.length < Number(form.membersCount)
    ) {
      setForm((prev) => ({
        ...prev,
        friendsList: [...prev.friendsList, name]
      }));
      setFriendName('');
      setFormErrors((prev) => ({ ...prev, friendsList: undefined }));
    } else if (!name) {
      setFormErrors((prev) => ({ ...prev, friendsList: "Friend name cannot be empty" }));
    } else if (form.friendsList.map(f => f.toLowerCase()).includes(name.toLowerCase())) {
      setFormErrors((prev) => ({ ...prev, friendsList: "Friend names must be unique" }));
    }
  };

  const handleFriendInputChange = (e) => {
    setFriendName(e.target.value);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "membersCount") {
      setForm((prev) => ({ ...prev, friendsList: [] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSubmit(form);
    setFormErrors({});
  };

  return (
    <div className='min-h-screen bg-black relative'>
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className='min-w-96 md:min-w-md m-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg'>
        <div className='flex justify-end'><X onClick={onCancel} className='cursor-pointer' /></div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of members
            </label>
            <input
              type="number"
              name="membersCount"
              value={form.membersCount}
              onChange={handleChange}
              min="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {formErrors.membersCount && <p className="text-red-500 text-xs mt-1">{formErrors.membersCount}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Friends name one by one
            </label>
            <input
              type="text"
              value={friendName}
              onChange={handleFriendInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={form.friendsList.length >= Number(form.membersCount )- 1}
            />
            <button
              type='button'
              className='m-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer disabled:opacity-50'
              onClick={handleAddFriend}
              disabled={
                !friendName.trim() ||
                form.friendsList.length >= Number(form.membersCount)-1
              }
            >
              Add
            </button>
            {formErrors.friendsList && <p className="text-red-500 text-xs mt-1">{formErrors.friendsList}</p>}
            {form.friendsList.length > 0 && (
              <ul className="mt-2 list-disc text-gray-800">
                {form.friendsList.map((friend, index) => (
                  <li key={index}>{friend}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              {mode === "edit" ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default PlanForm;