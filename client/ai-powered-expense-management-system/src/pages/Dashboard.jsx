import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit3,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  User,
  LogOut,
  Settings,
  Search,
} from 'lucide-react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import PlanForm from '../components/PlanForm'
import toast, { Toaster } from 'react-hot-toast'
import ProfileDropDown from '../components/ProfileDropdown'

function Dashboard() {

  const [showAddPlan, setShowAddPlan] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [plans, setPlans] = useState([]);

  const [showEditPlan, setShowEditPlan] = useState(false);
  const navigate = useNavigate();
  const [allPlans, setAllPlans] = useState([]);
  const [editPlanData, setEditPlanData] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const userRef = useRef();
  useEffect(() => {
    if (userRef.current) return;
    userRef.current = true;
    async function getUser() {
      let response = await axios.get('http://localhost:8080/user/getUser', { withCredentials: true });
      setUserInfo(response.data.userDetails);
      //console.log(response.data.userDetails);
    }
    getUser();
  }, []);

  const planRef = useRef();
  useEffect(() => {
    if (planRef.current) return;
    planRef.current = true;
    async function getPlans() {
      try {
        let response = await axios.get('http://localhost:8080/plan/get-plans', { withCredentials: true });
        setAllPlans(response.data.plans);
        //console.log(response.data.plans);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching plans, Try again later");
      }
    }
    getPlans();
  }, []);

  const filteredPlans = allPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlan = async (form) => {
    try {
      let response = await axios.post("http://localhost:8080/plan/add-plan", form, { withCredentials: true });
      if (response) {
        toast.success(response.data.message);
        setPlans(prev => [...prev, { ...form, id: response.data.planDetails._id }]);
      }

    } catch (error) {
      console.error(error);
      toast.error("Error adding plan, Try again later");
    }
  }

  const handleDeletePlan = async (id) => {
    try {
      let alertResponse = window.confirm("Are you sure you want to delete this plan?");
      if (!alertResponse) return;
      let response = await axios.delete(`http://localhost:8080/plan/delete-plan/${id}`, { withCredentials: true });
      if (response) {
        toast.success(response.data.message);
        setPlans(prev => prev.filter(plan => plan.id !== id));
      }
    }
    catch (error) {
      console.log(error);
      toast.error("Error deleting plan, Try again later");
    }
  }

  const handleEditButton = (plan) => {
    setEditPlanData(plan); // Store the whole plan object
    setShowEditPlan(true);
  }

  const handleEditPlan = async (form) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/plan/edit-plan/${editPlanData._id}`,
        form,
        { withCredentials: true }
      );
      toast.success(response.data.message);

      setAllPlans(prev =>
        prev.map(p => (p._id === editPlanData._id ? { ...p, ...form } : p))
      );
    } catch (error) {
      toast.error("Error updating plan, Try again later");
    }
  }

  const handleLogout = async () => {
    try {
      let alertResponse = window.confirm("Are you sure you want to logout?");
      if (!alertResponse) return;
      let response = await axios.get("http://localhost:8080/user/logout", { withCredentials: true });
      toast.success(response.data.message);
      setUserInfo({});
      setTimeout(() => { navigate('/') }, 1500);
    }
    catch (error) {
      console.error(error);
      toast.error("Error logging out");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold text-gray-900">EquiShare</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/*profile dropdown*/}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                <User />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">{userInfo.firstName + " " + userInfo.lastName}</span>
            </button>
            {showProfileDropdown && (
              <ProfileDropDown userInfo={userInfo} onLogout={handleLogout} />
            )}
          </div>
        </div>
      </header>
      {/* Add Plan Modal */}
      {showAddPlan && (
        <PlanForm
          initialValues={{
            title: '', description: '', membersCount: '', friendsList: []
          }}
          onSubmit={(form) => {
            handleAddPlan(form);
            setShowAddPlan(false);
          }}
          onCancel={() => setShowAddPlan(false)}
          mode="create"
        />
      )}
      {/* Edit Plan Modal */}
      {showEditPlan && editPlanData && (
        <PlanForm
          initialValues={{
            title: editPlanData.title,
            description: editPlanData.description,
            membersCount: editPlanData.membersCount,
            friendsList: editPlanData.friendsList,
            // Add other fields as needed
          }}
          onSubmit={async (form) => {
            handleEditPlan(form);
            setShowEditPlan(false);
            setEditPlanData(null);
          }}
          onCancel={() => {
            setShowEditPlan(false);
            setEditPlanData(null);
          }}
          mode="edit"
        />
      )}
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Plans</h1>
            <p className="text-gray-600">Manage your group expense plans</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddPlan(true)}
            className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Plan
          </motion.button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id || plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1"><Link to={`/open-plan/${plan._id}`}>{plan.title}</Link></h3>
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {plan.membersCount} membersCount
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-gray-500">Created: {new Date(plan.createdDate).toLocaleDateString()}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditButton(plan)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first plan to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddPlan(true)}
                className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Add New Plan
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard;