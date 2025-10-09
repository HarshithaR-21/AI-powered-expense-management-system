import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    DollarSign,
    Users,
    Calendar,
    Trash2,
    Calculator,
    User,
    Receipt,
    TrendingUp,
    Notebook
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AddExpenseModal from '../components/AddExpenseModal';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import ExpenseDetailsCard from '../components/expenseModal/ExpenseDetailsCard';

function OpenPlan() {
    const navigate = useNavigate();
    const { planId } = useParams();

    const [expenditures, setExpenditures] = useState([]);
    const [plan, setPlan] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [fetchedExpense, setFetchedExpense] = useState({});
    const [expenseDetailsCard, setExpenseDetailsCard] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        paidBy: '',
        participants: [],
        paymentMode: 'group',
        shareType: 'equal',
        individualShares: {},
    });

    const [user, setuser] = useState("");
    const userRef = useRef(false);
    useEffect(() => {
        if (userRef.current) return;
        userRef.current = true;
        async function getUser() {
            let response = await axios.get('http://localhost:8080/user/getUser', { withCredentials: true });
            setuser(response.data.userDetails);
            console.log(response.data.userDetails);
        }
        getUser();
    }, []);

    useEffect(() => {
        const getPlanDetails = async () => {
            try {
                let response = await axios.get(`http://localhost:8080/plan/get-plan-details/${planId}`, { withCredentials: true });
                //console.log("plan Details:\n", response.data.planDetails)
                setPlan(response.data.planDetails);
            }
            catch (error) {
                console.error("Error fetching plan details:", error);
                toast.error("Failed to fetch plan details");
            }
        }
        getPlanDetails();
    }, [planId]);

    const getExpenseRef = useRef();
    useEffect(() => {
        if (getExpenseRef.current) return;
        getExpenseRef.current = true;
        const fetchExpenses = async () => {
            try {
                let response = await axios.get(`http://localhost:8080/expense/get-expenses/${planId}`, { withCredentials: true });
                if (response) {
                    //console.log("Expenses:\n", response.data.planDetails);
                    setExpenditures((prev) => [...prev, ...response.data.expenses]);
                }
            }
            catch (error) {
                console.error("Error fetching expenses:", error);
                toast.error(error.response.data.message);
            }
        }
        fetchExpenses();
    }, [])

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            //console.log(newExpense);
            let response = await axios.post(`http://localhost:8080/expense/add-expense/${planId}`, newExpense, { withCredentials: true });
            if (response) {
                toast.success(response.data.message || "Expense added successfully");
            }
        }
        catch (error) {
            console.error("Error adding expense:", error);
            toast.error(error?.response?.data?.message || "Failed to add expense");
        }
        setShowAddForm(false);
    };

    const handleDeleteExpense = async (id) => {
        try {
            //console.log(id);
            const alertResponse = window.confirm("Do you want to delete expense");
            if (alertResponse) {
                let response = await axios.delete(`http://localhost:8080/expense/delete-expense/${id}`, { withCredentials: true });
                if (response) {
                    toast.success(response.data.message || "Expense deleted successfully");
                    setExpenditures(expenditures.filter(exp => exp.id !== id));
                }
            }

        }
        catch (error) {
            console.error("Error deleting expense:", error);
            toast.error(error?.response?.data?.message || "Failed to delete expense");
        }
    };

    const handleParticipantToggle = (member) => {
        const isSelected = newExpense.participants.includes(member);
        if (isSelected) {
            setNewExpense({
                ...newExpense,
                participants: newExpense.participants.filter(p => p !== member)
            });
        } else {
            setNewExpense({
                ...newExpense,
                participants: [...newExpense.participants, member]
            });
        }
    };

    const handlePaymentModeChange = (mode) => {
        setNewExpense({
            ...newExpense,
            paymentMode: mode,
            shareType: mode === 'group' ? 'equal' : 'different', // reset shareType for individual
            individualShares: {}, // reset shares
            participants: [] // reset participants
        });
    };

    const handleShareTypeChange = (type) => {
        setNewExpense({
            ...newExpense,
            shareType: type,
            individualShares: {}, // reset shares
        });
    };

    const handleViewDetails = async (expenseId) => {
        setExpenseDetailsCard(true);
        try {
            let response = await axios.get(`http://localhost:8080/expense/get-expense/${expenseId}`, { withCredentials: true });
            if (response) {
                setFetchedExpense(response.data.fetchedExpense);
                toast.success(response.data.message || "Expense details fetched successfully");
                console.log("Fetched Expense Details:\n", response.data.fetchedExpense);
            }
        }
        catch (error) {
            console.error("Error fetching expense details:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch expense details");
        }
    }


    function calculateSettlements() {
        // Build net balances for each member
        const netBalance = {};
        if (!plan.friendsList) return [];
        plan.friendsList.forEach(member => {
            netBalance[member] = 0;
        });
        // let userName = user.firstName + ' ' + user.lastName;

        // netBalance[userName] = 0;

        expenditures.forEach(exp => {
            if (exp.paymentMode === 'group') {
                if (exp.shareType === 'equal') {
                    const share = exp.amount / exp.participants.length;
                    netBalance[exp.paidBy] += exp.amount;
                    exp.participants.forEach(participant => {
                        netBalance[participant] -= share;
                    });
                } else if (exp.shareType === 'different' && exp.individualShares) {
                    netBalance[exp.paidBy] += exp.amount;
                    exp.participants.forEach(participant => {
                        netBalance[participant] -= Number(exp.individualShares[participant] || 0);
                    });
                }
            } else if (exp.paymentMode === 'individual' && exp.individualShares) {
                exp.participants.forEach(participant => {
                    if (participant !== exp.paidBy) {
                        const share = Number(exp.individualShares[participant] || 0);
                        netBalance[exp.paidBy] += share;
                        netBalance[participant] -= share;
                    }
                });
            }
        });

        // Prepare creditors and debtors
        let creditors = [];
        let debtors = [];
        console.log(netBalance);
        Object.entries(netBalance).forEach(([name, balance]) => {
            if (balance > 0) creditors.push({ name, balance });
            else if (balance < 0) debtors.push({ name, balance });
        });

        // Sort creditors (descending) and debtors (ascending)
        creditors.sort((a, b) => b.balance - a.balance);
        debtors.sort((a, b) => a.balance - b.balance);

        const settlements = [];
        let i = 0, j = 0;
        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];
            const amount = Math.min(creditor.balance, -debtor.balance);

            if (amount > 0) {
                settlements.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: amount
                });
                creditor.balance -= amount;
                debtor.balance += amount;
            }

            if (creditor.balance === 0) i++;
            if (debtor.balance === 0) j++;
        }

        return settlements;
    }
    const totalExpenses = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    const settlements = calculateSettlements();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
            <Toaster />
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-muted-foreground cursor-pointer" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{plan.name}</h1>
                                <p className="text-muted-foreground text-sm">{plan.description}</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-800 text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add Expense
                        </motion.button>
                    </div>

                    {/* Plan Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-100 shadow-lg p-6 rounded-xl border border-blue-200/60">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-blue-300">
                                    <DollarSign className="w-6 h-6 text-blue-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-700/80">Total Expenses</p>
                                    <p className="text-xl font-bold text-blue-900">₹{totalExpenses.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-100 shadow-lg p-6 rounded-xl border border-green-200/60">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-green-200">
                                    <Users className="w-6 h-6 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-green-700/80">Members</p>
                                    <p className="text-xl font-bold text-green-900">{plan.membersCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-100 shadow-lg p-6 rounded-xl border border-purple-200/60">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-purple-200">
                                    <Receipt className="w-6 h-6 text-purple-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-purple-700/80">Transactions</p>
                                    <p className="text-xl font-bold text-purple-900">{expenditures.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Expenditures List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-foreground">Expenditures</h2>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowResults(!showResults)}
                                className={`bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2 ${expenditures.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={expenditures.length === 0}
                            >
                                <Calculator className="w-4 h-4" />
                                {showResults ? 'Hide Results' : 'Generate Results'}
                            </motion.button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {expenditures.map((expense) => (
                                    <motion.div
                                        key={expense._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-card/50 p-6 rounded-lg border border-border/50 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Receipt className="w-5 h-5 text-primary" />
                                                    <h3 className="font-semibold text-foreground">{expense.description}</h3>
                                                </div>
                                                <div className="space-y-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span className="font-medium text-foreground">₹{expense.amount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span>Paid by <span className="font-medium text-foreground">{expense.paidBy}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <span>Split among: {expense.participants.join(', ')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{expense.date}</span>
                                                    </div>
                                                    <div className='flex justify-end'>
                                                        <button className='flex px-4 py-2 bg-blue-800 text-white cursor-pointer rounded-md font-medium' onClick={() => handleViewDetails(expense._id)}>View Details<Notebook className='ml-2 ' /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteExpense(expense._id)}
                                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Settlement Results */}
                    <div className="lg:col-span-1">
                        <AnimatePresence>
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-card/50 p-6 rounded-lg border border-border/50 sticky top-32"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold text-foreground">Settlement Results</h3>
                                    </div>

                                    {settlements.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">All expenses are settled!</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {settlements.map((settlement, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-primary/5 p-4 rounded-lg border border-primary/20"
                                                >
                                                    <div className="text-sm">
                                                        <span className="font-medium text-foreground">{settlement.from}</span>
                                                        <span className="text-muted-foreground"> has to pay </span>
                                                        <span className="font-medium text-foreground">{settlement.to}</span>
                                                    </div>
                                                    <div className="text-lg font-semibold text-primary mt-1">
                                                        ₹{settlement.amount.toFixed(2)}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AddExpenseModal
                open={showAddForm}
                onClose={() => setShowAddForm(false)}
                onSubmit={handleAddExpense}
                planMembers={plan.friendsList || []}
                newExpense={newExpense}
                setNewExpense={setNewExpense}
                handleParticipantToggle={handleParticipantToggle}
                onPaymentModeChange={handlePaymentModeChange}
                onShareTypeChange={handleShareTypeChange}
            />
            {expenseDetailsCard && <ExpenseDetailsCard expense={fetchedExpense} onCancel={() => setExpenseDetailsCard(false)} />}
        </div>
    );
}

export default OpenPlan;