import React from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle } from 'lucide-react';

function ModalThirdSlide({
  paidBy,
  availableMembers,
  onPaidByChange,
  onBack,
  onSubmit,
  errors
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Paid By Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Who Paid for This Expense?
          </div>
        </label>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {availableMembers.map(member => (
            <motion.label
              key={member}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                paidBy === member
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="paidBy"
                value={member}
                checked={paidBy === member}
                onChange={() => onPaidByChange(member)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paidBy === member ? 'border-primary' : 'border-border'
              }`}>
                {paidBy === member && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </div>
              <span className="flex-1 font-medium">{member}</span>
              {paidBy === member && (
                <CheckCircle className="w-5 h-5 text-primary text-blue-800" />
              )}
            </motion.label>
          ))}
        </div>
        {errors && errors.paidBy && (
          <p className="text-destructive text-xs mt-1 text-red-500">{errors.paidBy}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="flex-1 p-3 border-2 border-border text-foreground rounded-lg hover:bg-secondary transition-colors font-medium"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          onClick={onSubmit}
          className="flex-1 p-3 bg-blue-800 text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-lg shadow-primary/25"
        >
          Add Expense
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ModalThirdSlide;