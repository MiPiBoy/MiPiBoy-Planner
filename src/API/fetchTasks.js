import { supabase } from '../utils/supabase';

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('Tasks')
    .select('*')

  if (error) {
    console.error("خطا در دریافت تسک‌ها:", error.message);
    return [];
  }

  return data;
};