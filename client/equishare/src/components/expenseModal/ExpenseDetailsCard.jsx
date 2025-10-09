import React from 'react';
import { X, DollarSign, User, Users, Calendar, Notebook } from 'lucide-react';
import { motion } from 'framer-motion';

function ExpenseDetailsCard({ expense, onCancel }) {
    if (!expense) return null;

    return (

        <motion.div initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-md p-8 relative">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Notebook className="w-6 h-6 text-primary" />
                    Expense Details
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-700" />
                        <span className="font-semibold text-lg text-blue-900">₹{expense.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-green-700" />
                        <span>Paid by <span className="font-medium text-foreground">{expense.paidBy}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-700" />
                        <span>Participants: {expense.participants && expense.participants.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-700" />
                        <span>{expense.date ? new Date(expense.date).toLocaleString() : 'N/A'}</span>
                    </div>
                    <div>
                        <span className="font-medium">Description:</span>
                        <span className="ml-2">{expense.description}</span>
                    </div>
                    <div>
                        <span className="font-medium">Payment Mode:</span>
                        <span className="ml-2">{expense.paymentMode || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="font-medium">Share Type:</span>
                        <span className="ml-2">{expense.shareType || 'N/A'}</span>
                    </div>
                    {expense.individualShares && Object.keys(expense.individualShares).length > 0 && (
                        <div>
                            <span className="font-medium">Individual Shares:</span>
                            <ul className="ml-4 mt-1 list-disc text-sm">
                                {Object.entries(expense.individualShares).map(([member, share]) => (
                                    <li key={member}>
                                        {member}: ₹{share}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default ExpenseDetailsCard;