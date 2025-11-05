import React from 'react'
import { motion } from 'framer-motion'
import { User, LogOut, Settings } from 'lucide-react'
function ProfileDropDown({ userInfo, onLogout }) {

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2"
        >
            <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">{userInfo.firstName + " " + userInfo.lastName}</p>
                <p className="text-sm text-gray-500">{userInfo.email}</p>
            </div>
            {/* <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="mr-3 h-4 w-4" />
                Profile Settings
            </button>
            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="mr-3 h-4 w-4" />
                Account Settings
            </button> */}
            <hr className="my-1" />
            <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={onLogout}>
                <LogOut className="mr-3 h-4 w-4" />
                Logout
            </button>
        </motion.div>


    )
}

export default ProfileDropDown;