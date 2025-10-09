import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ModalFirstSlide from './expenseModal/ModalFirstSlide';
import ModalSecondSlide from './expenseModal/ModalSecondSlide';
import ModalThirdSlide from './expenseModal/ModalThirdSlide';

function AddExpenseModal({
  open,
  onClose,
  onSubmit,
  planMembers,
  newExpense,
  setNewExpense,
  handleParticipantToggle
}) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  const [paymentMode, setPaymentMode] = useState('group');
  const [shareType, setShareType] = useState('equal');
  const [individualShares, setIndividualShares] = useState({});


  useEffect(() => {
    if (shareType === 'different' || paymentMode === 'individual') {
      setNewExpense(prev => ({
        ...prev,
        individualShares: { ...individualShares }
      }));
    }
  }, [individualShares, shareType, paymentMode]);


  useEffect(() => {
    if (!open) {
      setCurrentSlide(1);
      setFormErrors({});
      setPaymentMode('group');
      setShareType('equal');
      setIndividualShares({});
    }
  }, [open]);

  if (!open) return null;

  const validateSlide1 = () => {
    const errors = {};
    if (!newExpense.description.trim()) errors.description = "Description is required";
    return errors;
  };

  const validateSlide2 = () => {
    const errors = {};
    if (paymentMode === 'group') {
      if (shareType === 'equal') {
        setShareType('equal'); // Ensure shareType is set
        if (!newExpense.amount || isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
          errors.amount = "Enter a valid amount";
        }
      } else {
        // Different shares validation
        setShareType('different'); // Ensure shareType is set
        const totalAmount = newExpense.participants.reduce((sum, member) => {
          const share = Number(individualShares[member]) || 0;
          return sum + share;
        }, 0);

        newExpense.participants.forEach(member => {
          const share = individualShares[member];
          if (!share || share.trim() === '') {
            errors[`share_${member}`] = "Enter share amount";
          } else if (isNaN(Number(share)) || Number(share) <= 0) {
            errors[`share_${member}`] = "Invalid amount";
          }
        });

        if (totalAmount > 0 && !errors.shares) {
          setNewExpense({ ...newExpense, amount: totalAmount.toString() });
        }
      }
    } else {
      // Individual payment validation
      newExpense.participants.forEach(member => {
        const share = individualShares[member];
        if (!share || share.trim() === '') {
          errors[`share_${member}`] = "Enter amount";
        } else if (isNaN(Number(share)) || Number(share) <= 0) {
          errors[`share_${member}`] = "Invalid amount";
        }
      });

      const totalAmount = newExpense.participants.reduce((sum, member) => {
        return sum + (Number(individualShares[member]) || 0);
      }, 0);

      if (totalAmount > 0) {
        setNewExpense({
          ...newExpense,
          amount: totalAmount.toString(),
          individualShares: { ...individualShares }
        });
      }
    }

    if (!newExpense.participants || newExpense.participants.length === 0) {
      errors.members = "Select at least one member";
    }

    return errors;
  };

  const validateSlide3 = () => {
    const errors = {};
    if (!newExpense.paidBy) errors.paidBy = "Select who paid";
    return errors;
  };

  const handleNextSlide = () => {
    let errors = {};
    if (currentSlide === 1) {
      errors = validateSlide1();
    } else if (currentSlide === 2) {
      errors = validateSlide2();
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleBackSlide = () => {
    setCurrentSlide(currentSlide - 1);
    setFormErrors({});
  };

  const handleFinalSubmit = () => {
    const errors = validateSlide3();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const expenseData = {
        ...newExpense,
        paymentMode,
        shareType,
        individualShares: paymentMode === 'individual' || shareType === 'different' ? individualShares : undefined
      };
      onSubmit({ preventDefault: () => { expenseData } });
      onClose();
      setFormErrors({});
      setIndividualShares({});
    }
  };

  const handleMemberToggle = (member) => {
    handleParticipantToggle(member);
    if (newExpense.participants.includes(member)) {
      const newShares = { ...individualShares };
      delete newShares[member];
      setIndividualShares(newShares);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-card p-8 rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with progress indicator */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-4">Add New Expense</h3>
            <div className="flex gap-2">
              {[1, 2, 3].map((slide) => (
                <div
                  key={slide}
                  className={`h-2 flex-1 rounded-full transition-colors ${slide <= currentSlide ? 'bg-primary' : 'bg-border'
                    }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {currentSlide === 1 && (
                <ModalFirstSlide
                  description={newExpense.description}
                  paymentMode={paymentMode}
                  onDescriptionChange={(value) => setNewExpense({ ...newExpense, description: value })}
                  onPaymentModeChange={(mode) => {
                    setPaymentMode(mode);
                    setNewExpense({
                      ...newExpense,
                      paymentMode: mode,
                      participants: [],
                      amount: '',
                      shareType: mode === 'group' ? shareType : '',
                      individualShares: {},
                    });
                    setIndividualShares({});
                  }}
                  onNext={handleNextSlide}
                  errors={formErrors}
                />
              )}

              {currentSlide === 2 && (
                <ModalSecondSlide
                  paymentMode={paymentMode}
                  shareType={shareType}
                  totalAmount={newExpense.amount}
                  selectedMembers={newExpense.participants}
                  individualShares={individualShares}
                  availableMembers={planMembers}
                  onShareTypeChange={(type) => {
                    setShareType(type);
                    setNewExpense({
                      ...newExpense,
                      shareType: type, // <-- update newExpense.shareType
                      individualShares: {}, // reset shares when share type changes
                    });
                    setIndividualShares({});
                  }}
                  onTotalAmountChange={(value) => setNewExpense({ ...newExpense, amount: value })}
                  onMemberToggle={handleMemberToggle}
                  onIndividualShareChange={(member, value) =>
                    setIndividualShares({ ...individualShares, [member]: value })
                  }
                  onBack={handleBackSlide}
                  onNext={handleNextSlide}
                  errors={formErrors}
                />
              )}

              {currentSlide === 3 && (
                <ModalThirdSlide
                  paidBy={newExpense.paidBy}
                  availableMembers={planMembers}
                  onPaidByChange={(member) => setNewExpense({ ...newExpense, paidBy: member })}
                  onBack={handleBackSlide}
                  onSubmit={handleFinalSubmit}
                  errors={formErrors}
                />
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddExpenseModal;