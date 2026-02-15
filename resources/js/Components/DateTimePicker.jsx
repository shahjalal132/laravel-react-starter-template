import React, { useState, useRef, useEffect } from 'react';

const DateTimePicker = ({ label = 'Select Date and Time', value, onChange }) => {
    // Initialize state from props or default
    const getInitialDate = () => {
        if (value) return new Date(value);
        return new Date();
    };

    const [selectedDate, setSelectedDate] = useState(getInitialDate());
    const [currentMonth, setCurrentMonth] = useState(new Date(getInitialDate().getFullYear(), getInitialDate().getMonth(), 1));
    const [isAM, setIsAM] = useState(getInitialDate().getHours() < 12);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [tempMonth, setTempMonth] = useState(getInitialDate().getMonth());
    const [tempYear, setTempYear] = useState(getInitialDate().getFullYear());

    // Update state when value prop changes
    useEffect(() => {
        if (value) {
            const newDate = new Date(value);
            setSelectedDate(newDate);
            setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            setIsAM(newDate.getHours() < 12);
            setTempMonth(newDate.getMonth());
            setTempYear(newDate.getFullYear());
        }
    }, [value]);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const formatDateTime = () => {
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const year = selectedDate.getFullYear();
        const hours = String(selectedDate.getHours() % 12 || 12).padStart(2, '0');
        const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
        const period = selectedDate.getHours() >= 12 ? 'pm' : 'am';
        return `${month}/${day}/${year} ${hours}:${minutes} ${period}`;
    };

    const togglePicker = () => {
        setIsExpanded(!isExpanded);
        setShowMonthYearPicker(false);
    };

    const toggleMonthYearPicker = () => {
        if (!showMonthYearPicker) {
            setTempMonth(currentMonth.getMonth());
            setTempYear(currentMonth.getFullYear());
        }
        setShowMonthYearPicker(!showMonthYearPicker);
    };

    const applyMonthYear = () => {
        setCurrentMonth(new Date(tempYear, tempMonth, 1));
        setShowMonthYearPicker(false);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(currentMonth.getFullYear());
        newDate.setMonth(currentMonth.getMonth());
        newDate.setDate(day);
        setSelectedDate(newDate);
    };

    const handleHourChange = (hour) => {
        const newDate = new Date(selectedDate);
        let actualHour = parseInt(hour);
        if (!isAM && actualHour !== 12) actualHour += 12;
        if (isAM && actualHour === 12) actualHour = 0;
        newDate.setHours(actualHour);
        setSelectedDate(newDate);
    };

    const handleMinuteChange = (minute) => {
        const newDate = new Date(selectedDate);
        newDate.setMinutes(parseInt(minute));
        setSelectedDate(newDate);
    };

    const handlePeriodChange = (period) => {
        const newDate = new Date(selectedDate);
        const currentHour = newDate.getHours();
        if (period === 'AM' && currentHour >= 12) {
            newDate.setHours(currentHour - 12);
        } else if (period === 'PM' && currentHour < 12) {
            newDate.setHours(currentHour + 12);
        }

        setIsAM(period === 'AM');
        setSelectedDate(newDate);
    };

    const handleOk = () => {
        if (onChange) {
            onChange(selectedDate);
        }
        setIsExpanded(false);
    };

    const renderCalendar = () => {
        const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
        const days = [];
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        // Week day headers
        const headers = weekDays.map((day, i) => (
            <div key={`header-${i}`} className="text-center text-gray-500 text-sm font-medium py-2">
                {day}
            </div>
        ));

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected =
                day === selectedDate.getDate() &&
                currentMonth.getMonth() === selectedDate.getMonth() &&
                currentMonth.getFullYear() === selectedDate.getFullYear();

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${isSelected
                        ? 'bg-teal-600 text-white ring-2 ring-teal-400'
                        : 'text-white hover:bg-gray-700'
                        }`}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1 place-items-center">
                {headers}
                {days}
            </div>
        );
    };

    const ScrollSelector = ({ value, onChange, options, label }) => (
        <div className="flex flex-col">
            <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <style jsx>{`
          div::-webkit-scrollbar {
            width: 4px;
          }
          div::-webkit-scrollbar-track {
            background: #1F2937;
          }
          div::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 2px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
        `}</style>
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`w-full py-2 text-center text-sm transition-colors ${option === value
                            ? 'text-white font-medium'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );

    const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

    const currentHour = selectedDate.getHours();
    const displayHour = String(currentHour % 12 || 12).padStart(2, '0');
    const displayMinute = String(selectedDate.getMinutes()).padStart(2, '0');
    const displayPeriod = currentHour >= 12 ? 'PM' : 'AM';

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full">
                {/* Input field */}
                <div className="mb-4">
                    <div className="relative border-2 border-teal-400 rounded-lg">
                        <label className="absolute -top-2.5 left-3 bg-gray-900 px-1 text-teal-400 text-xs">
                            {label}
                        </label>
                        <input
                            type="text"
                            value={formatDateTime()}
                            readOnly
                            className="w-full bg-transparent px-4 py-2 text-white focus:outline-none cursor-pointer"
                            onClick={togglePicker}
                        />
                        <button
                            onClick={togglePicker}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-teal-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Picker with collapse/expand animation */}
                <div
                    className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                        maxHeight: isExpanded ? '600px' : '0',
                        opacity: isExpanded ? 1 : 0,
                    }}
                >
                    <div className="p-[2px] rounded-lg bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500">
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="flex border-b border-gray-700">
                                {/* Calendar section */}
                                <div className="flex-1 p-4">
                                    {/* Month/Year selector */}
                                    {!showMonthYearPicker ? (
                                        <>
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={handlePrevMonth}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={toggleMonthYearPicker}
                                                    className="text-white font-medium hover:bg-gray-700 px-3 py-1 rounded transition-colors flex items-center gap-1"
                                                >
                                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={handleNextMonth}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Calendar grid */}
                                            {renderCalendar()}
                                        </>
                                    ) : (
                                        <div className="py-2">
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={toggleMonthYearPicker}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <div className="flex-1"></div>
                                                <button
                                                    onClick={applyMonthYear}
                                                    className="text-teal-400 text-sm hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                                                >
                                                    Done
                                                </button>
                                            </div>

                                            <div className="flex gap-4">
                                                {/* Month Selector */}
                                                <div className="flex-1">
                                                    <div className="text-gray-400 text-xs mb-2 text-center">Month</div>
                                                    <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                                        {monthNames.map((month, index) => (
                                                            <button
                                                                key={month}
                                                                onClick={() => setTempMonth(index)}
                                                                className={`w-full py-2 text-center text-sm transition-colors ${index === tempMonth
                                                                    ? 'text-white bg-teal-600 font-medium'
                                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                                    }`}
                                                            >
                                                                {month}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Year Selector */}
                                                <div className="flex-1">
                                                    <div className="text-gray-400 text-xs mb-2 text-center">Year</div>
                                                    <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                                        {Array.from({ length: 100 }, (_, i) => 2000 + i).map((year) => (
                                                            <button
                                                                key={year}
                                                                onClick={() => setTempYear(year)}
                                                                className={`w-full py-2 text-center text-sm transition-colors ${year === tempYear
                                                                    ? 'text-white bg-teal-600 font-medium'
                                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                                    }`}
                                                            >
                                                                {year}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Time selectors */}
                                <div className="w-48 border-l border-gray-700 flex">
                                    {/* Hours */}
                                    <div className="flex-1 border-r border-gray-700">
                                        <ScrollSelector
                                            value={displayHour}
                                            onChange={handleHourChange}
                                            options={hours}
                                            label="Hour"
                                        />
                                    </div>

                                    {/* Minutes */}
                                    <div className="flex-1 border-r border-gray-700">
                                        <ScrollSelector
                                            value={displayMinute}
                                            onChange={handleMinuteChange}
                                            options={minutes}
                                            label="Minute"
                                        />
                                    </div>

                                    {/* AM/PM */}
                                    <div className="w-16">
                                        <div className="h-64 flex flex-col justify-center">
                                            <button
                                                onClick={() => handlePeriodChange('AM')}
                                                className={`py-2 text-center text-sm transition-colors ${displayPeriod === 'AM'
                                                    ? 'text-white font-medium'
                                                    : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                AM
                                            </button>
                                            <button
                                                onClick={() => handlePeriodChange('PM')}
                                                className={`py-2 text-center text-sm transition-colors ${displayPeriod === 'PM'
                                                    ? 'text-white font-medium'
                                                    : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                            >
                                                PM
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-4 p-4 bg-gray-850">
                                <button
                                    onClick={togglePicker}
                                    className="px-6 py-2 text-teal-400 hover:bg-gray-700 rounded transition-colors"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleOk}
                                    className="px-6 py-2 text-teal-400 hover:bg-gray-700 rounded transition-colors"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateTimePicker;