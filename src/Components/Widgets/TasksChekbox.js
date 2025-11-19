import "../../Style/Task.css"
import jalaali from 'jalaali-js';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchTasks } from '../../API/fetchTasks';
import { supabase } from '../../utils/supabase'


const TasksChekbox = () => {

  const [tasks, setTasks] = useState([]);
  const [daysOffset, setDaysOffset] = useState(0);
  const [displayDays, setDisplayDays] = useState([]);
  const observerRef = useRef(null);
  const [completedSet, setCompletedSet] = useState(new Set()); // مجموعه تسک‌های تکمیل‌شده برای تاریخ‌های قابل نمایش

  // تابع برای تبدیل تاریخ شمسی به فرمت قابل مقایسه
  const parsePersianDate = (dateString) => {
    if (!dateString || dateString.trim() === '') return null;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    return { year, month, day, original: dateString };
  };

  // تابع برای مقایسه تاریخ‌های شمسی
  // برمی‌گرداند: منفی اگر date1 < date2، صفر اگر مساوی، مثبت اگر date1 > date2
  const comparePersianDates = (date1, date2) => {
    if (!date1 || !date2) return null;
    
    const parsed1 = parsePersianDate(date1);
    const parsed2 = parsePersianDate(date2);
    
    if (!parsed1 || !parsed2) return null;
    
    // مقایسه سال
    if (parsed1.year !== parsed2.year) {
      return parsed1.year - parsed2.year;
    }
    
    // مقایسه ماه
    if (parsed1.month !== parsed2.month) {
      return parsed1.month - parsed2.month;
    }
    
    // مقایسه روز
    return parsed1.day - parsed2.day;
  };

  // تابع برای تولید روزهای شمسی
  const generateJalaliDays = (startOffset = 0, count = 10) => {
    const days = [];
    const today = new Date();

    for (let i = startOffset; i < startOffset + count; i++) {
      const future = new Date(today);
      future.setDate(today.getDate() + i);

      const { jy, jm, jd } = jalaali.toJalaali(future);
      // فرمت دقیقا مثل دیتابیس: d/m/y (مثلاً: 30/2/1405)
      const formatted = `${jd}/${jm}/${jy}`;
      const jsWeekday = future.getDay(); // JavaScript: 0 = یکشنبه, 1 = دوشنبه, ..., 6 = شنبه
      // تبدیل به فرمت فارسی: 0 = شنبه, 1 = یکشنبه, 2 = دوشنبه, ..., 6 = جمعه
      const persianWeekday = jsWeekday === 6 ? 0 : jsWeekday + 1;
      
      days.push({
        date: formatted,
        day: jd,
        month: jm,
        year: jy,
        weekday: persianWeekday, // 0 = شنبه, 1 = یکشنبه, 2 = دوشنبه, 3 = سه‌شنبه, 4 = چهارشنبه, 5 = پنج‌شنبه, 6 = جمعه
        index: i
      });
    }

    return days;
  };

  // تابع برای پارس کردن repeatDays (که به صورت JSON string است)
  const parseRepeatDays = (repeatDaysString) => {
    if (!repeatDaysString) return [];
    try {
      const parsed = JSON.parse(repeatDaysString);
      return Array.isArray(parsed) ? parsed.map(d => String(d)) : [];
    } catch {
      return [];
    }
  };

  // تابع برای بررسی اینکه آیا تسک باید نمایش داده شود
  const shouldShowTaskForDate = (task, dayDate, dayWeekday) => {
    const taskData = task.data?.trim() || '';
    const taskTaData = task.taData?.trim() || '';

    // بررسی repeatDays
    // repeatDays: 0 = شنبه, 1 = یکشنبه, 2 = دوشنبه, 3 = سه‌شنبه, 4 = چهارشنبه, 5 = پنج‌شنبه, 6 = جمعه
    // اگر repeatDays وجود داشته باشد، باید فقط در روزهای مشخص شده نمایش داده شود
    let repeatDays = [];
    if (task.repeatDays) {
      if (typeof task.repeatDays === 'string' && task.repeatDays.trim() !== '') {
        repeatDays = parseRepeatDays(task.repeatDays);
      } else if (Array.isArray(task.repeatDays)) {
        repeatDays = task.repeatDays.map(d => String(d));
      }
    }
    
    // اگر repeatDays مقدار دارد (خالی نباشد)، باید بررسی کنیم
    if (task.repeatDays !== null && task.repeatDays !== undefined) {
      // اگر خالی باشد ([])، تسک را نمایش نده
      if (repeatDays.length === 0) {
        return false;
      }
      
      // اگر پر باشد، بررسی کن که آیا روز فعلی در آن هست یا نه
      // اگر روز فعلی در repeatDays نباشد، تسک را نمایش نده
      const dayWeekdayStr = String(dayWeekday);
      if (!repeatDays.includes(dayWeekdayStr)) {
        return false;
      }
    }

    // اگر هر دو خالی باشند → نمایش بده (تسک همیشگی)
    if (!taskData && !taskTaData) {
      return true;
    }

    // اگر data برابر با روز باشد → نمایش بده (تسک یکباره)
    if (taskData && taskData === dayDate) {
      return true;
    }

    // اگر taData بزرگ‌تر یا مساوی با روز باشد → نمایش بده (تسک مداوم)
    // یعنی امروز باید <= taData باشد
    if (taskTaData) {
      const comparison = comparePersianDates(taskTaData, dayDate);
      if (comparison !== null && comparison >= 0) {
        return true;
      }
    }

    return false;
  };

  // بارگذاری تسک‌ها
  useEffect(() => {
    const loadTasks = async () => {
      const result = await fetchTasks();
      setTasks(result);
    };

    loadTasks();
  }, []);

  // تولید روزهای اولیه و اضافه کردن روزهای جدید هنگام اسکرول
  useEffect(() => {
    const totalDays = 10 + (daysOffset * 10);
    const days = generateJalaliDays(0, totalDays);
    setDisplayDays(days);
  }, [daysOffset]);

  // واکشی وضعیت تکمیل‌شدن‌ها از CompletionStatus برای تاریخ‌های قابل نمایش
  useEffect(() => {
    const fetchCompletionStatuses = async () => {
      try {
        if (displayDays.length === 0) return;
        const dates = Array.from(new Set(displayDays.map(d => d.date)));
        const { data, error } = await supabase
          .from('CompletionStatus')
          .select('code, date')
          .in('date', dates);
        if (error) {
          console.error('خطا در دریافت وضعیت انجام تسک‌ها:', error.message);
          return;
        }
        const next = new Set();
        (data || []).forEach(row => {
          next.add(`${row.code}|${row.date}`);
        });
        setCompletedSet(next);
      } catch (e) {
        console.error('اشکال در واکشی CompletionStatus:', e);
      }
    };
    fetchCompletionStatuses();
  }, [displayDays]);

  // Observer برای اسکرول (Intersection Observer)
  const lastDayElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // وقتی به آخرین روز رسیدیم، 10 روز دیگر اضافه کن
        setDaysOffset(prev => prev + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, []);

  // فیلتر کردن تسک‌ها برای هر روز
  const getTasksForDay = (dayDate, dayWeekday) => {
    return tasks.filter(task => shouldShowTaskForDate(task, dayDate, dayWeekday));
  };

  // رویداد تیک زدن/برداشتن تیک هر تسک
  // اگر تیک زده شود: رکوردی با { code, date } در CompletionStatus ثبت می‌شود
  // اگر تیک برداشته شود: همان رکورد با همان code و date حذف می‌شود
  const handleCompletionToggle = async (taskCode, dayDate, isChecked) => {
    try {
      if (isChecked) {
        const { error } = await supabase
          .from('CompletionStatus')
          .insert([{ code: taskCode, date: dayDate }]);
        if (error) {
          console.error('خطا در ثبت وضعیت انجام تسک:', error.message);
        }
        // به‌روزرسانی فوری UI
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
          console.error('خطا در حذف وضعیت انجام تسک:', error.message);
        }
        // به‌روزرسانی فوری UI
        setCompletedSet(prev => {
          const copy = new Set(prev);
          copy.delete(`${taskCode}|${dayDate}`);
          return copy;
        });
      }
    } catch (e) {
      console.error('اشکال در بروزرسانی CompletionStatus:', e);
    }
  };

  return (
    <div className="checkList">
      <div>
        <div style={{height: '30px'}}></div>
      </div>
      {displayDays.map((dayObj, dayIndex) => {
        const dayTasks = getTasksForDay(dayObj.date, dayObj.weekday);
        const isNotLastDay = dayIndex < displayDays.length - 1;

        // اگر برای این روز هیچ تسکی وجود ندارد، اصلا چیزی رندر نکن
        if (dayTasks.length === 0) return null;

        // بررسی اینکه آیا روز بعدی تسک داره یا نه (برای نمایش خط عمودی)
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
                {/* خط عمودی - فقط وقتی که روز بعدی هم تسک داره */}
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
                    <div className='showTask'>
                      <div className="taskName">
                        <p>{task.name}</p>
                        {/* با تغییر وضعیت چک‌باکس، در جدول CompletionStatus درج/حذف می‌کنیم */}
                        <input
                          value={task.code}
                          type="checkbox"
                          id={task.code}
                          checked={completedSet.has(`${task.code}|${dayObj.date}`)}
                          onChange={(e) => handleCompletionToggle(task.code, dayObj.date, e.target.checked)}
                        />
                      </div>
                      <div className="taskInfo">
                        <p className="taskInfoTitle">ساعت:</p>
                        <p className="taskInfoValue">{task.time || 'ندارد'}</p>
                      </div>
                      <div className="taskInfo">
                        <p className="taskInfoTitle">یاداشت:</p>
                        <p className="taskInfoValue">{task.description || 'ندارد'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* المان نگهبان برای افزودن روزهای بیشتر هنگام اسکرول */}
      <div ref={lastDayElementRef} />
    </div>
  );
};

export default TasksChekbox;