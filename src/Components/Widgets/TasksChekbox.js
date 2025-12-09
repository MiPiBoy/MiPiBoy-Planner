import "../../Style/Task.css"
import jalaali from 'jalaali-js';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchTasks } from '../../API/fetchTasks';
import { supabase } from '../../utils/supabase'
import { useTaskContext } from '../../Components/TaskContext';
import { useSettingContext } from '../SettingContext.js';
import { error } from "three";

const TasksChekbox = () => {
  const { triggerReload, reloadFlag2 } = useTaskContext();
  const [tasks, setTasks] = useState([]);
  const [daysOffset, setDaysOffset] = useState(0);
  const [displayDays, setDisplayDays] = useState([]);
  const observerRef = useRef(null);
  const [completedSet, setCompletedSet] = useState(new Set());
  const { mobileOptimizedMode } = useSettingContext();

  // حالت‌های لودینگ و خطا
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingCompletion, setLoadingCompletion] = useState(false);
  const [errorTasks, setErrorTasks] = useState(null);
  const [errorCompletion, setErrorCompletion] = useState(null);

  // تابع برای تبدیل تاریخ شمسی به فرمت قابل مقایسه
  const parsePersianDate = (dateString) => {
    if (!dateString || dateString.trim() === '') return null;

    try {
      const parts = dateString.split('/');
      if (parts.length !== 3) return null;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

      return { year, month, day, original: dateString };
    } catch (error) {
      console.error('خطا در پارس کردن تاریخ:', error);
      return null;
    }
  };

  // تابع برای مقایسه تاریخ‌های شمسی
  const comparePersianDates = (date1, date2) => {
    if (!date1 || !date2) return null;

    const parsed1 = parsePersianDate(date1);
    const parsed2 = parsePersianDate(date2);

    if (!parsed1 || !parsed2) return null;

    if (parsed1.year !== parsed2.year) {
      return parsed1.year - parsed2.year;
    }

    if (parsed1.month !== parsed2.month) {
      return parsed1.month - parsed2.month;
    }

    return parsed1.day - parsed2.day;
  };

  // تابع برای تولید روزهای شمسی
  const generateJalaliDays = (startOffset = 0, count = 10) => {
    try {
      const days = [];
      const today = new Date();

      for (let i = startOffset; i < startOffset + count; i++) {
        const future = new Date(today);
        future.setDate(today.getDate() + i);

        const { jy, jm, jd } = jalaali.toJalaali(future);
        const formatted = `${jd}/${jm}/${jy}`;
        const jsWeekday = future.getDay();
        const persianWeekday = jsWeekday === 6 ? 0 : jsWeekday + 1;

        days.push({
          date: formatted,
          day: jd,
          month: jm,
          year: jy,
          weekday: persianWeekday,
          index: i
        });
      }

      return days;
    } catch (error) {
      console.error('خطا در تولید روزهای شمسی:', error);
      return [];
    }
  };

  // تابع برای پارس کردن repeatDays
  const parseRepeatDays = (repeatDaysString) => {
    if (!repeatDaysString) return [];
    try {
      const parsed = JSON.parse(repeatDaysString);
      return Array.isArray(parsed) ? parsed.map(d => String(d)) : [];
    } catch (error) {
      console.error('خطا در پارس کردن repeatDays:', error);
      return [];
    }
  };

  // تابع برای بررسی اینکه آیا تسک باید نمایش داده شود
  const shouldShowTaskForDate = (task, dayDate, dayWeekday) => {
    try {
      const taskData = task.data?.trim() || '';
      const taskTaData = task.taData?.trim() || '';

      // بررسی repeatDays
      let repeatDays = [];
      if (task.repeatDays) {
        if (typeof task.repeatDays === 'string' && task.repeatDays.trim() !== '') {
          repeatDays = parseRepeatDays(task.repeatDays);
        } else if (Array.isArray(task.repeatDays)) {
          repeatDays = task.repeatDays.map(d => String(d));
        }
      }

      if (task.repeatDays !== null && task.repeatDays !== undefined) {
        if (repeatDays.length === 0) {
          return false;
        }

        const dayWeekdayStr = String(dayWeekday);
        if (!repeatDays.includes(dayWeekdayStr)) {
          return false;
        }
      }

      if (!taskData && !taskTaData) {
        return true;
      }

      if (taskData && taskData === dayDate) {
        return true;
      }

      if (taskTaData) {
        const comparison = comparePersianDates(taskTaData, dayDate);
        if (comparison !== null && comparison >= 0) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('خطا در بررسی نمایش تسک:', error);
      return false;
    }
  };

  // بارگذاری تسک‌ها
  useEffect(() => {
    const loadTasks = async () => {
      setLoadingTasks(true);
      setErrorTasks(null);

      try {
        const result = await fetchTasks();
        setTasks(result);
      } catch (error) {
        console.error('خطا در دریافت تسک‌ها:', error);
        setErrorTasks('خطا در بارگذاری تسک‌ها.');
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [reloadFlag2]);

  // تولید روزهای اولیه و اضافه کردن روزهای جدید هنگام اسکرول
  useEffect(() => {
    const totalDays = 10 + (daysOffset * 10);
    const days = generateJalaliDays(0, totalDays);
    setDisplayDays(days);
  }, [daysOffset]);

  // واکشی وضعیت تکمیل‌شدن‌ها
  useEffect(() => {
    const fetchCompletionStatuses = async () => {
      if (displayDays.length === 0) return;

      setLoadingCompletion(true);
      setErrorCompletion(null);

      try {
        const dates = Array.from(new Set(displayDays.map(d => d.date)));
        const { data, error } = await supabase
          .from('CompletionStatus')
          .select('code, date')
          .in('date', dates);

        if (error) {
          throw new Error(error.message);
        }

        const next = new Set();
        (data || []).forEach(row => {
          next.add(`${row.code}|${row.date}`);
        });
        setCompletedSet(next);
      } catch (error) {
        console.error('خطا در دریافت وضعیت انجام تسک‌ها:', error);
        setErrorCompletion('خطا در دریافت اطلاعات تسک‌ها');
      } finally {
        setLoadingCompletion(false);
      }
    };

    fetchCompletionStatuses();
  }, [displayDays]);

  // Observer برای اسکرول
  const lastDayElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setDaysOffset(prev => prev + 0);
      }
    });

    if (node) observerRef.current.observe(node);
  }, []);

  // فیلتر کردن تسک‌ها برای هر روز
  const getTasksForDay = (dayDate, dayWeekday) => {
    try {
      return tasks.filter(task => shouldShowTaskForDate(task, dayDate, dayWeekday));
    } catch (error) {
      console.error('خطا در فیلتر کردن تسک‌ها:', error);
      return [];
    }
  };

  // رویداد تیک زدن/برداشتن تیک
  const handleCompletionToggle = async (taskCode, dayDate, isChecked) => {
    try {
      if (isChecked) {
        const { error } = await supabase
          .from('CompletionStatus')
          .insert([{ code: taskCode, date: dayDate }]);

        if (error) {
          throw new Error(error.message);
        }

        triggerReload();
        setCompletedSet(prev => {
          const copy = new Set(prev);
          copy.add(`${taskCode}|${dayDate}`);
          return copy;
        });
      } else {
        const { error } = await supabase
          .from('CompletionStatus')
          .delete()
          .eq('code', taskCode)
          .eq('date', dayDate);

        if (error) {
          throw new Error(error.message);
        }

        triggerReload();
        setCompletedSet(prev => {
          const copy = new Set(prev);
          copy.delete(`${taskCode}|${dayDate}`);
          return copy;
        });
      }
    } catch (error) {
      console.error('خطا در بروزرسانی وضعیت تسک:', error);
      alert('خطا در بروزرسانی وضعیت تسک. لطفاً دوباره تلاش کنید.');
    }
  };
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
  const SkeletonLoader = () => (
    <div className="checkList" style={{ mask: 'linear-gradient(black, #0000003d, transparent)' }}>
      <div style={{ height: '30px' }} />
      <div>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'row', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
            <span className="daynum skeleton"><p>&nbsp;</p></span>
            <div className="skeleton" style={{ width: '2px', flex: 1, minHeight: '20px', marginTop: '4px' }}></div>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '14px', flexDirection: 'column' }}>
            <SkeletonTask />
            <SkeletonTask />
            <SkeletonTask />
          </div>
        </div>
      </div>
    </div>
  );

  // نمایش لودینگ
  if (loadingTasks) {
    return (
      <div style={{ display: 'contents' }}>
        <SkeletonLoader />
      </div>
    )
  }

  // نمایش خطا
  if (errorCompletion) {
    return (
      <div style={{ display: 'contents' }}>
        <SkeletonLoader />
        <div className="error-container">
          <div className="error-message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="#ff6b6b" />
            </svg>
            خطا در دریافت اطلاعات تسک‌ها
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkList">
      <div>
        <div style={{ height: '30px' }} />
      </div>

      {displayDays.map((dayObj, dayIndex) => {
        const dayTasks = getTasksForDay(dayObj.date, dayObj.weekday);
        const isNotLastDay = dayIndex < displayDays.length - 1;

        if (dayTasks.length === 0) return null;

        let nextDayHasTasks = false;
        if (isNotLastDay) {
          const nextDayObj = displayDays[dayIndex + 1];
          const nextDayTasks = getTasksForDay(nextDayObj.date, nextDayObj.weekday);
          nextDayHasTasks = nextDayTasks.length > 0;
        }

        return (
          <div key={dayObj.index}>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexDirection: 'row',
              position: 'relative'
            }}>
              {/* شماره روز و خط عمودی */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0'
              }}>
                <span className="daynum"><p>{dayObj.day}</p></span>
                {isNotLastDay && nextDayHasTasks && (
                  <div style={{
                    width: '2px',
                    flex: 1,
                    minHeight: '20px',
                    backgroundColor: '#ffffff33',
                    marginTop: '4px'
                  }}></div>
                )}
              </div>

              {/* لیست تسک‌های روز */}
              <div style={{
                flex: 1,
                display: 'flex',
                gap: '14px',
                flexDirection: 'column'
              }}>
                {dayTasks.map((task) => (
                  <div className="tasksList" key={`${dayObj.index}-${task.code}`}>
                    <div className='showTask'
                      style={{
                        background: !mobileOptimizedMode ? "var(--B1)" : "#1e1e1e99",
                        opacity: completedSet.has(`${task.code}|${dayObj.date}`) ? 0.5 : 1,
                        textDecoration: completedSet.has(`${task.code}|${dayObj.date}`) ? 'line-through' : 'none'
                      }}>
                      <div className="taskName" style={task.description === '' && task.time === '' ? { paddingBottom: '0px', marginBottom: '0px', borderBottom: '0px' } : {}}>
                        <p>{task.name}</p>
                        <label className="material-checkbox">
                          <input
                            value={task.code}
                            type="checkbox"
                            id={task.code}
                            checked={completedSet.has(`${task.code}|${dayObj.date}`)}
                            onChange={(e) => handleCompletionToggle(task.code, dayObj.date, e.target.checked)}
                            disabled={loadingCompletion}
                          />
                          <span className="checkmark"></span>
                          {loadingCompletion && <span className="checkbox-loader"></span>}
                        </label>
                      </div>
                      {task.time !== '' && (
                        <div className="taskInfo">
                          <p className="taskInfoTitle">ساعت:</p>
                          <p className="taskInfoValue">{task.time || 'ندارد'}</p>
                        </div>)}
                      {task.description !== '' && (
                        <div className="taskInfo">
                          <p className="taskInfoTitle">یاداشت:</p>
                          <p className="taskInfoValue">{task.description || 'ندارد'}</p>
                        </div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* المان نگهبان برای افزودن روزهای بیشتر */}
      <div ref={lastDayElementRef} />
    </div>
  );
};

export default TasksChekbox;