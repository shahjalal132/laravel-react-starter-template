import React from 'react';

export default function DashboardCard({ title, value, icon, trend, trendValue, subtext, className = '' }) {
    return (
        <div className={`overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg ${className}`}>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {title}
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {value}
                        </h3>
                    </div>
                    {icon && (
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600 dark:text-indigo-400">
                            {icon}
                        </div>
                    )}
                </div>
                {(trend || subtext) && (
                    <div className="mt-4 flex items-center">
                        {trend && (
                            <span className={`flex items-center text-sm font-medium ${
                                trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                                {trend === 'up' ? (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                )}
                                {trendValue}
                            </span>
                        )}
                        {subtext && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-500">
                                {subtext}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
