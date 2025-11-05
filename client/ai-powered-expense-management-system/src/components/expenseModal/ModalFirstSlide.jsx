import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Users, User } from 'lucide-react';

function ModalFirstSlide({
  description,
  paymentMode,
  onDescriptionChange,
  onPaymentModeChange,
  onNext,
  errors
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Expense Description
          </div>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground"
          placeholder="Enter expense description (e.g., Dinner at restaurant)"
        />
        {errors?.description && (
          <p className="text-destructive text-xs mt-1 text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Payment Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Payment Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPaymentModeChange('group')}
            className={`p-4 rounded-lg border-2 transition-all ${
              paymentMode === 'group'
                ? 'border-primary bg-primary/10 text-primary font-semibold text-blue-800'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span>Group Payment</span>
            </div>
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPaymentModeChange('individual')}
            className={`p-4 rounded-lg border-2 transition-all ${
              paymentMode === 'individual'
                ? 'border-primary bg-primary/10 text-primary font-semibold text-blue-800'
                : 'border-border bg-background text-muted-foreground hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <User className="w-6 h-6" />
              <span>Individual Payment</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-6">
        <motion.button
          type="button"
          disabled
          className="flex-1 p-3 border-2 border-border text-muted-foreground rounded-lg opacity-50 cursor-not-allowed font-medium"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onNext}
          className="flex-1 p-3 bg-blue-800 text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-lg shadow-primary/25"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ModalFirstSlide;