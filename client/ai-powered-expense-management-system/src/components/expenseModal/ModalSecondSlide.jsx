import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users } from 'lucide-react';

function ModalSecondSlide({
  paymentMode,
  shareType,
  totalAmount,
  selectedMembers,
  individualShares,
  availableMembers,
  onShareTypeChange,
  onTotalAmountChange,
  onMemberToggle,
  onIndividualShareChange,
  onBack,
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
      {/* Group Payment */}
      {paymentMode === 'group' && (
        <>
          {/* Share Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Share Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onShareTypeChange('equal')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  shareType === 'equal'
                    ? 'border-accent bg-accent/10 text-accent font-medium text-blue-800'
                    : 'border-border bg-background text-muted-foreground hover:border-accent/50'
                }`}
              >
                Equal Share
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onShareTypeChange('different')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  shareType === 'different'
                    ? 'border-accent bg-accent/10 text-accent font-medium text-blue-800'
                    : 'border-border bg-background text-muted-foreground hover:border-accent/50'
                }`}
              >
                Different Share
              </motion.button>
            </div>
          </div>

          {/* Equal Share - Total Amount */}
          {shareType === 'equal' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Amount (₹)
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(e) => onTotalAmountChange(e.target.value)}
                className="w-full p-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground"
                placeholder="0.00"
              />
              {errors?.amount && (
                <p className="text-destructive text-xs mt-1 text-red-500">{errors.amount}</p>
              )}
            </motion.div>
          )}

          {/* Member Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Members ({selectedMembers.length} selected)
              </div>
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableMembers.map(member => (
                <motion.div
                  key={member}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member)}
                      onChange={() => onMemberToggle(member)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="flex-1 text-sm text-foreground">{member}</span>
                  </label>

                  {/* Different Share Input */}
                  <AnimatePresence>
                    {shareType === 'different' && selectedMembers.includes(member) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="ml-9"
                      >
                        <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
                          <span className="text-sm text-muted-foreground">Share:</span>
                          <span className="text-sm text-muted-foreground">₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={individualShares[member] || ''}
                            onChange={(e) => onIndividualShareChange(member, e.target.value)}
                            placeholder="0.00"
                            className="flex-1 p-2 text-sm bg-background border border-input rounded focus:ring-2 focus:ring-ring text-foreground"
                          />
                        </div>
                        {errors?.[`share_${member}`] && (
                          <p className="text-destructive text-xs mt-1 ml-3 text-red-500">
                            {errors[`share_${member}`]}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            {errors?.members && (
              <p className="text-destructive text-xs mt-1 text-red-500">{errors.members}</p>
            )}
            {errors?.shares && (
              <p className="text-destructive text-xs mt-2 font-medium text-red-500">{errors.shares}</p>
            )}
          </div>
        </>
      )}

      {/* Individual Payment */}
      {paymentMode === 'individual' && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Members & Enter Their Amount ({selectedMembers.length} selected)
            </div>
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableMembers.map(member => (
              <motion.div
                key={member}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member)}
                    onChange={() => onMemberToggle(member)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="flex-1 text-sm text-foreground">{member}</span>
                </label>

                {/* Dynamic Amount Input */}
                <AnimatePresence>
                  {selectedMembers.includes(member) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="ml-9"
                    >
                      <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-sm text-muted-foreground">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          value={individualShares[member] || ''}
                          onChange={(e) => onIndividualShareChange(member, e.target.value)}
                          placeholder="0.00"
                          className="flex-1 p-2 text-sm bg-background border border-input rounded focus:ring-2 focus:ring-ring text-foreground"
                        />
                      </div>
                      {errors?.[`share_${member}`] && (
                        <p className="text-destructive text-xs mt-1 ml-3 text-500">
                          {errors[`share_${member}`]}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          {errors?.members && (
            <p className="text-destructive text-xs mt-1 text-red-500">{errors.members}</p>
          )}
        </div>
      )}

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

export default ModalSecondSlide;