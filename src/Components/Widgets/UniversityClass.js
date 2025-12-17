import "../../Style/Task.css"
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase'
import { useTaskContext } from '../../Components/TaskContext';
import { useSettingContext } from '../SettingContext.js';
import jalaali from 'jalaali-js';

const UniversityClass = () => {
    const { triggerReload, reloadFlag2 } = useTaskContext();
    const [classes, setClasses] = useState([]);
    const [classTimes, setClassTimes] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 6 ? 0 : new Date().getDay() + 1); // Convert JS day to Persian week (0-6)
    const [combinedData, setCombinedData] = useState([]);
    const [completedStatus, setCompletedStatus] = useState({}); // { "code|weekStartDate": {status: 3} }
    const { mobileOptimizedMode } = useSettingContext();

    // حالت‌های لودینگ و خطا
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingTimes, setLoadingTimes] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [errorClasses, setErrorClasses] = useState(null);
    const [errorTimes, setErrorTimes] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);

    // روزهای هفته فارسی
    const persianWeekDays = [
        { id: 0, name: 'SAT' },
        { id: 1, name: 'SUN' },
        { id: 2, name: 'MON' },
        { id: 3, name: 'TUE' },
        { id: 4, name: 'WED' },
        { id: 5, name: 'THU' }
    ];

    // تابع برای تبدیل ساعت به فرمت قابل مرتب‌سازی
    const timeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // تابع برای محاسبه تاریخ شمسی روز انتخابی در هفته
    const getSelectedDayJalaliDate = () => {
        const today = new Date();
        const todayJsWeekday = today.getDay();
        const todayPersianWeekday = todayJsWeekday === 6 ? 0 : todayJsWeekday + 1;

        let diff = selectedDay - todayPersianWeekday;

        if (diff < 0) {
            diff += 7;
        }

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        const { jy, jm, jd } = jalaali.toJalaali(targetDate);
        return `${jy}-${jm.toString().padStart(2, '0')}-${jd.toString().padStart(2, '0')}`;
    };

    // تابع برای محاسبه تاریخ شمسی برای هر روز هفته
    const getJalaliDateForDay = (dayId) => {
        const today = new Date();
        const todayJsWeekday = today.getDay();
        const todayPersianWeekday = todayJsWeekday === 6 ? 0 : todayJsWeekday + 1;

        let diff = dayId - todayPersianWeekday;

        if (diff < 0) {
            diff += 7;
        }

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        const { jy, jm, jd } = jalaali.toJalaali(targetDate);
        return `${jd}/${jm}`;
    };

    // تابع برای محاسبه تاریخ شنبه هفته شمسی برای یک تاریخ شمسی
    const getSaturdayOfJalaliWeek = (jalaliDate) => {
        const [year, month, day] = jalaliDate.split('-').map(Number);
        const gregorianDate = jalaali.toGregorian(year, month, day);
        const date = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);

        // روز هفته میلادی
        const jsWeekday = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        // تبدیل به روز هفته شمسی: 0=شنبه, 1=یکشنبه, ..., 6=جمعه
        const persianWeekday = (jsWeekday + 1) % 7;

        // اختلاف روز تا شنبه
        const diffToSaturday = -persianWeekday;

        // محاسبه تاریخ شنبه
        const saturdayDate = new Date(date);
        saturdayDate.setDate(date.getDate() + diffToSaturday);

        const saturdayJalali = jalaali.toJalaali(saturdayDate);
        return `${saturdayJalali.jy}-${saturdayJalali.jm.toString().padStart(2, '0')}-${saturdayJalali.jd.toString().padStart(2, '0')}`;
    };

    // بارگذاری کلاس‌ها
    useEffect(() => {
        const loadClasses = async () => {
            setLoadingClasses(true);
            setErrorClasses(null);

            try {
                const { data, error } = await supabase
                    .from('UniversityClass')
                    .select('*')
                    .order('lesson');

                if (error) {
                    throw new Error(error.message);
                }

                setClasses(data || []);
            } catch (error) {
                console.error('خطا در دریافت کلاس‌ها:', error);
                setErrorClasses('خطا در بارگذاری کلاس‌ها.');
            } finally {
                setLoadingClasses(false);
            }
        };

        loadClasses();
    }, [reloadFlag2]);

    // بارگذاری زمان‌بندی کلاس‌ها
    useEffect(() => {
        const loadClassTimes = async () => {
            setLoadingTimes(true);
            setErrorTimes(null);

            try {
                const { data, error } = await supabase
                    .from('UniversityClassTimes')
                    .select('*')
                    .order('dayOfWeek')
                    .order('startTime');

                if (error) {
                    throw new Error(error.message);
                }

                setClassTimes(data || []);
            } catch (error) {
                console.error('خطا در دریافت زمان‌بندی کلاس‌ها:', error);
                setErrorTimes('خطا در بارگذاری زمان‌بندی کلاس‌ها.');
            } finally {
                setLoadingTimes(false);
            }
        };

        loadClassTimes();
    }, [reloadFlag2]);

    // ترکیب داده‌های کلاس‌ها و زمان‌بندی‌ها
    useEffect(() => {
        if (classes.length === 0 || classTimes.length === 0) {
            setCombinedData([]);
            return;
        }

        try {
            const combined = [];

            classTimes.forEach(time => {
                const classInfo = classes.find(c => c.code === time.code);
                if (classInfo) {
                    combined.push({
                        ...classInfo,
                        dayOfWeek: time.dayOfWeek,
                        startTime: time.startTime,
                        endTime: time.endTime,
                        timeId: time.id,
                        rightClass: time.rightClass || false,
                        mainClass: time.mainClass || false
                    });
                }
            });

            // مرتب‌سازی ابتدایی بر اساس روز هفته و ساعت شروع
            combined.sort((a, b) => {
                if (a.dayOfWeek !== b.dayOfWeek) {
                    return a.dayOfWeek - b.dayOfWeek;
                }
                return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
            });

            setCombinedData(combined);
        } catch (error) {
            console.error('خطا در ترکیب داده‌ها:', error);
        }
    }, [classes, classTimes]);

    // بارگذاری وضعیت تیک خوردن‌ها از UniversityClassStatus
    useEffect(() => {
        const loadCompletionStatus = async () => {
            if (!selectedDay && selectedDay !== 0) return;

            setLoadingStatus(true);
            setErrorStatus(null);

            try {
                // تاریخ روز انتخابی
                const selectedDate = getSelectedDayJalaliDate();
                // تاریخ شنبه هفته
                const weekStartDate = getSaturdayOfJalaliWeek(selectedDate);

                // دریافت وضعیت‌های هفته جاری
                const { data, error } = await supabase
                    .from('UniversityClassStatus')
                    .select('code, date, status')
                    .eq('date', weekStartDate);

                if (error) {
                    throw new Error(error.message);
                }

                const statusMap = {};
                (data || []).forEach(item => {
                    statusMap[`${item.code}|${item.date}`] = item;
                });

                setCompletedStatus(statusMap);
            } catch (error) {
                console.error('خطا در دریافت وضعیت کلاس‌ها:', error);
                setErrorStatus('خطا در دریافت وضعیت کلاس‌ها');
            } finally {
                setLoadingStatus(false);
            }
        };

        loadCompletionStatus();
    }, [selectedDay, reloadFlag2]);

    // بررسی وضعیت تیک خوردن کلاس
    const isClassCompleted = (classCode) => {
        const selectedDate = getSelectedDayJalaliDate();
        const weekStartDate = getSaturdayOfJalaliWeek(selectedDate);
        const key = `${classCode}|${weekStartDate}`;
        return completedStatus[key]?.status === 3;
    };

    // فیلتر کردن و مرتب‌سازی کلاس‌های روز انتخاب شده
    const getClassesForSelectedDay = useCallback(() => {
        const filtered = combinedData.filter(item => item.dayOfWeek === selectedDay);
        
        // مرتب‌سازی با اولویت‌های مشخص شده
        return filtered.sort((a, b) => {
            // اولویت ۱: وضعیت تیک خوردن (status === 3)
            const aCompleted = isClassCompleted(a.code);
            const bCompleted = isClassCompleted(b.code);
            
            if (!aCompleted && bCompleted) return -1;
            if (aCompleted && !bCompleted) return 1;
            
            // اولویت ۲: rightClass = true
            if (a.rightClass && !b.rightClass) return -1;
            if (!a.rightClass && b.rightClass) return 1;
            
            // اولویت ۳: ساعت شروع
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        });
    }, [combinedData, selectedDay]);

    // رویداد تغییر روز انتخابی
    const handleDayChange = (dayId) => {
        setSelectedDay(dayId);
    };

    // رویداد تیک زدن/برداشتن تیک
    const handleCompletionToggle = async (classCode, isChecked) => {
        try {
            const selectedDate = getSelectedDayJalaliDate();
            const weekStartDate = getSaturdayOfJalaliWeek(selectedDate);
            const key = `${classCode}|${weekStartDate}`;

            if (isChecked) {
                // درج وضعیت
                const { data, error } = await supabase
                    .from('UniversityClassStatus')
                    .insert([
                        {
                            code: classCode,
                            date: weekStartDate,
                            status: 3
                        }
                    ]);

                if (error) {
                    if (error.code !== '23505') { // 23505 = unique_violation در PostgreSQL
                        throw new Error(error.message);
                    }
                }

                setCompletedStatus(prev => ({
                    ...prev,
                    [key]: { code: classCode, date: weekStartDate, status: 3 }
                }));

            } else {
                // حذف وضعیت
                const { error } = await supabase
                    .from('UniversityClassStatus')
                    .delete()
                    .eq('code', classCode)
                    .eq('date', weekStartDate);

                if (error) {
                    throw new Error(error.message);
                }

                const newStatus = { ...completedStatus };
                delete newStatus[key];
                setCompletedStatus(newStatus);
            }

            triggerReload();
        } catch (error) {
            console.error('خطا در بروزرسانی وضعیت کلاس:', error);
            alert('خطا در بروزرسانی وضعیت کلاس. لطفاً دوباره تلاش کنید.');
        }
    };

    // تابع فرمت‌بندی ساعت برای نمایش
    const formatTime = (timeStr) => {
        if (!timeStr) return '--:--';
        return timeStr.substring(0, 5);
    };

    // اسکلتون لودر
    const SkeletonLoader = () => (
        <div className="checkList" style={{ mask: 'linear-gradient(black, #0000003d, transparent)' }}>
            <div style={{ height: '30px' }} />
            <div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'row', position: 'relative' }}>
                    <div style={{ flex: 1, display: 'flex', gap: '14px', flexDirection: 'column' }}>
                        <SkeletonTask />
                        <SkeletonTask />
                        <SkeletonTask />
                    </div>
                </div>
            </div>
        </div>
    );

    const SkeletonTask = () => (
        <div className="tasksList">
            <div className='showTask skeleton'>
                <div className="taskName skeleton">
                    <div className="skeleton-line short" />
                    <label className="material-checkbox skeleton">
                        <input type="checkbox" disabled />
                        <span className="checkmark skeleton"></span>
                    </label>
                </div>
                <div className="taskInfo skeleton" style={{ width: '100%', marginBottom: '12px' }}>
                    <p className="taskInfoTitle"><div className="skeleton-line" /></p>
                    <p className="taskInfoValue" style={{ width: 'calc(100% - 80px)' }}><div className="skeleton-line" /></p>
                </div>
                <div className="taskInfo skeleton" style={{ width: '100%' }}>
                    <p className="taskInfoTitle"><div className="skeleton-line" /></p>
                    <p className="taskInfoValue" style={{ width: 'calc(100% - 80px)' }}><div className="skeleton-line short" /></p>
                </div>
            </div>
        </div>
    );

    // نمایش لودینگ
    if (loadingClasses || loadingTimes) {
        return (
            <div style={{ display: 'contents' }}>
                <SkeletonLoader />
            </div>
        );
    }

    // نمایش خطا
    if (errorClasses || errorTimes || errorStatus) {
        return (
            <div style={{ display: 'contents' }}>
                <SkeletonLoader />
                <div className="error-container">
                    <div className="error-message">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="#ff6b6b" />
                        </svg>
                        {errorClasses || errorTimes || errorStatus || 'خطا در دریافت اطلاعات کلاس‌ها'}
                    </div>
                </div>
            </div>
        );
    }

    // دریافت کلاس‌های روز انتخابی
    const dayClasses = getClassesForSelectedDay();

    return (
        <div className="checkList">
            {/* دکمه‌های روزهای هفته */}
            <div style={{
                boxSizing: 'border-box',
                width: '100%',
                marginTop: '44px',
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                padding: '0 10px'
            }}>
                {persianWeekDays.map(day => {
                    const dateStr = getJalaliDateForDay(day.id);
                    return (
                        <button
                            key={day.id}
                            onClick={() => handleDayChange(day.id)}
                            style={{
                                boxSizing: 'border-box',
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                background: selectedDay === day.id ? 'var(--primary)' : 'var(--B1)',
                                color: selectedDay === day.id ? 'white' : 'var(--text)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                            }}
                        >
                            <span>{day.name}</span>
                            <span style={{ fontSize: '12px', opacity: 0.9 }}>{dateStr}</span>
                        </button>
                    );
                })}
            </div>

            {/* نمایش کلاس‌های روز انتخابی */}
            <div style={{ padding: '0 10px' }}>
                {dayClasses.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--text-secondary)',
                        fontSize: '16px'
                    }}>
                        کلاسی برای {persianWeekDays.find(d => d.id === selectedDay)?.name} برنامه‌ریزی نشده است.
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '14px', flexDirection: 'column' }}>
                        {dayClasses.map((classItem, index) => {
                            const completed = isClassCompleted(classItem.code);

                            return (
                                <div className="tasksList" key={`${classItem.code}_${classItem.timeId}_${index}`}>
                                    <div className='showTask'
                                        style={{
                                            border: classItem.rightClass ? "2px solid #00FF22" : "1px solid transparent",
                                            boxShadow: classItem.mainClass ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "none",
                                            background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99",
                                            opacity: completed ? 0.5 : 1,
                                            textDecoration: completed ? 'line-through' : 'none'
                                        }}>
                                        <div className="taskName">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <p className="taskInfoValue">{classItem.teacher || 'تعیین نشده'}</p>
                                                <p>{classItem.lesson}</p>
                                            </div>

                                            <label className="material-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={completed}
                                                    onChange={(e) => handleCompletionToggle(classItem.code, e.target.checked)}
                                                    disabled={loadingStatus}
                                                />
                                                <span className="checkmark"></span>
                                                {loadingStatus && <span className="checkbox-loader"></span>}
                                            </label>
                                        </div>

                                        <div className="taskInfo">
                                            <p className="taskInfoTitle">ساعت:</p>
                                            <p className="taskInfoValue">
                                                {formatTime(classItem.startTime)} تا {formatTime(classItem.endTime)}
                                            </p>
                                        </div>

                                        {classItem.description && (
                                            <div className="taskInfo">
                                                <p className="taskInfoTitle">توضیحات:</p>
                                                <p className="taskInfoValue">{classItem.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversityClass;