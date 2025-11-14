import './LifeViewerWidget.css';
import jalaali from 'jalaali-js';
import { useEffect, useState } from 'react';
import { useTaskContext } from '../../Components/TaskContext';
import { fetchTasks } from '../../API/fetchTasks';
import { supabase } from '../../utils/supabase';

const LifeViewerWidget = () => {
const { setChartCompletedTasks, setChartTotalTasks } = useTaskContext();
const totalTasks = setChartTotalTasks;
const completedTasks = setChartCompletedTasks;


  // State برای نگهداری تسک‌ها و وضعیت انجام آن‌ها
  const [tasks, setTasks] = useState([]);
  const [completedSet, setCompletedSet] = useState(new Set()); // Set از `${code}|${date}` - دقیقاً مثل TasksChekbox
  const [daysData, setDaysData] = useState([]); // آرایه روزها با درصد انجام

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

  // تابع برای تولید روزهای شمسی گذشته (از امروز به عقب)
  // تعداد روزها: 210 روز (7 ردیف × 30 ستون)
  // ترتیب: امروز در اول (برای نمایش در راست پایین)، قدیمی‌ترین در آخر
  const generatePastJalaliDays = (count = 210) => {
    const days = [];
    const today = new Date();

    // از امروز (i=0) به عقب می‌رویم (i منفی) تا 209 روز قبل
    for (let i = 0; i >= -(count - 1); i--) {
      const past = new Date(today);
      past.setDate(today.getDate() + i);

      const { jy, jm, jd } = jalaali.toJalaali(past);
      // فرمت دقیقا مثل دیتابیس: d/m/y (مثلاً: 30/2/1405)
      const formatted = `${jd}/${jm}/${jy}`;
      const jsWeekday = past.getDay(); // JavaScript: 0 = یکشنبه, 1 = دوشنبه, ..., 6 = شنبه
      // تبدیل به فرمت فارسی: 0 = شنبه, 1 = یکشنبه, 2 = دوشنبه, ..., 6 = جمعه
      const persianWeekday = jsWeekday === 6 ? 0 : jsWeekday + 1;
      
      days.push({
        date: formatted,
        day: jd,
        month: jm,
        year: jy,
        weekday: persianWeekday, // 0 = شنبه, 1 = یکشنبه, 2 = دوشنبه, 3 = سه‌شنبه, 4 = چهارشنبه, 5 = پنج‌شنبه, 6 = جمعه
        index: i // منفی برای روزهای گذشته
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
  // این تابع از منطق TasksChekbox استفاده می‌کند
  const shouldShowTaskForDate = (task, dayDate, dayWeekday) => {
    const taskData = task.data?.trim() || '';
    const taskTaData = task.taData?.trim() || '';

    // بررسی repeatDays
    // repeatDays: 0 = شنبه, 1 = یکشنبه, 2 = دوشنبه, 3 = سه‌شنبه, 4 = چهارشنبه, 5 = پنج‌شنبه, 6 = جمعه
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
    if (taskTaData) {
      const comparison = comparePersianDates(taskTaData, dayDate);
      if (comparison !== null && comparison >= 0) {
        return true;
      }
    }

    return false;
  };

  // بارگذاری تسک‌ها از دیتابیس
  useEffect(() => {
    const loadTasks = async () => {
      const result = await fetchTasks();
      setTasks(result);
    };

    loadTasks();
  }, []);

  // واکشی وضعیت تکمیل‌شدن‌ها از CompletionStatus
  // این داده‌ها برای محاسبه درصد انجام تسک‌ها در هر روز استفاده می‌شوند
  // دقیقاً مثل TasksChekbox.js: استفاده از Set با فرمت `${code}|${date}`
  useEffect(() => {
    const fetchCompletionStatuses = async () => {
      try {
        // تولید لیست تاریخ‌های 210 روز گذشته
        const pastDays = generatePastJalaliDays(210);
        const dates = Array.from(new Set(pastDays.map(d => d.date)));
        
        // دریافت CompletionStatus برای تاریخ‌های قابل نمایش
        const { data, error } = await supabase
          .from('CompletionStatus')
          .select('code, date')
          .in('date', dates);
        
        if (error) {
          console.error('خطا در دریافت وضعیت انجام تسک‌ها:', error.message);
          return;
        }

        // تبدیل به Set با فرمت `${code}|${date}` - دقیقاً مثل TasksChekbox.js
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
  }, []);

  // محاسبه درصد انجام تسک‌ها برای هر روز
  // این useEffect هر بار که tasks یا completedSet تغییر کند، اجرا می‌شود
  // منطق دقیقاً مثل TasksChekbox.js: استفاده از getTasksForDay و completedSet
  useEffect(() => {
    if (tasks.length === 0) return;

    // تابع برای فیلتر کردن تسک‌ها برای هر روز - دقیقاً مثل TasksChekbox.js
    const getTasksForDay = (dayDate, dayWeekday) => {
      return tasks.filter(task => shouldShowTaskForDate(task, dayDate, dayWeekday));
    };

    // تولید 210 روز گذشته (از امروز به عقب)
    // 7 ردیف × 30 ستون = 210 روز
    const pastDays = generatePastJalaliDays(315);
    
    // معکوس کردن آرایه تا امروز در راست پایین باشد
    // با grid و direction: rtl، ترتیب پر شدن از راست بالا شروع می‌شود
    // پس باید قدیمی‌ترین روز در اول آرایه باشد تا در راست بالا قرار گیرد
    // و امروز در آخر آرایه باشد تا در راست پایین قرار گیرد
    const reversedDays = [...pastDays].reverse();
    
    // برای هر روز، محاسبه درصد انجام تسک‌ها
    // ترتیب آرایه: قدیمی‌ترین در اول (راست بالا)، امروز در آخر (راست پایین)
    const daysWithPercentage = reversedDays.map(dayObj => {
      // پیدا کردن تسک‌هایی که باید برای این روز نمایش داده شوند - دقیقاً مثل TasksChekbox.js
      const dayTasks = getTasksForDay(dayObj.date, dayObj.weekday);

      // اگر هیچ تسکی برای این روز وجود ندارد، درصد 0 است
      if (dayTasks.length === 0) {
        return {
          ...dayObj,
          percentage: 0,
          totalTasks: 0,
          completedTasks: 0
        };
      }

      // شمارش تسک‌های انجام شده برای این روز
      // استفاده از completedSet با فرمت `${code}|${date}` - دقیقاً مثل TasksChekbox.js
      const completedCount = dayTasks.filter(task => 
        completedSet.has(`${task.code}|${dayObj.date}`)
      ).length;

      // محاسبه درصد (به صورت عدد صحیح)
      const percentage = Math.round((completedCount / dayTasks.length) * 100);

      return {
        ...dayObj,
        percentage,
        totalTasks: dayTasks.length,
        completedTasks: completedCount
      };
    });

    setDaysData(daysWithPercentage);
  }, [tasks, completedSet]);

  // تابع برای تبدیل درصد به کلاس CSS
  // درصدها به 11 سطح تقسیم می‌شوند: 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0
  const getPercentageClass = (percentage) => {
    // گرد کردن به نزدیک‌ترین سطح 10
    const rounded = Math.round(percentage / 10) * 10;
    // محدود کردن به بازه 0-100
    const clamped = Math.max(0, Math.min(100, rounded));
    return `dayView${clamped}`;
  };

useEffect(() => {
  const today = daysData[daysData.length - 1];
  if (today) {
    completedTasks(today.completedTasks);
    totalTasks(today.totalTasks);
  }
}, [daysData]);

  return (
    <div>
      <div style={{height: 'calc(100% - 27px)', zIndex: '1'}}>    
        <div className='titleDiv'>
          <p className='title'>نمای کل</p>
          <div className="editButton" title='فیلتر'>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.94954 1.9248H17.0495C18.0579 1.9248 18.8829 2.7498 18.8829 3.75814V5.77481C18.8829 6.50814 18.4245 7.42481 17.9662 7.88314L14.0245 11.3665C13.4745 11.8248 13.1079 12.7415 13.1079 13.4748V17.4165C13.1079 17.9665 12.7412 18.6998 12.2829 18.9748L10.9995 19.7998C9.80788 20.5331 8.15788 19.7081 8.15788 18.2415V13.3831C8.15788 12.7415 7.79121 11.9165 7.42454 11.4581L3.94121 7.79147C3.48288 7.33314 3.11621 6.50814 3.11621 5.95814V3.8498C3.11621 2.7498 3.94121 1.9248 4.94954 1.9248Z" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.0192 1.9248L5.5 9.16647" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div>
        <div style={{height: '40px'}}></div>
      </div>
      {/* بخش نمایش مربع‌های contributions */}
      {/* ساختار: 7 ردیف، از راست به چپ و از پایین به بالا */}
      {/* روز فعلی در راست پایین است و با اسکرول به عقب می‌رویم */}
      <div className='dayViewSection'>
        {daysData.map((dayObj) => (
          <div
            key={dayObj.index}
            className={`dayView ${getPercentageClass(dayObj.percentage)}`}
            title={`${dayObj.date} - ${dayObj.completedTasks}/${dayObj.totalTasks} تسک انجام شده (${dayObj.percentage}%)`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LifeViewerWidget;
