import "../Style/Input.css"
import { useState } from "react";

const AddTaskForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    repeatDays: [],
  });

  const weekDays = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (day) => {
    setFormData((prev) => {
      const isSelected = prev.repeatDays.includes(day);
      const updatedDays = isSelected
        ? prev.repeatDays.filter((d) => d !== day)
        : [...prev.repeatDays, day];
      return { ...prev, repeatDays: updatedDays };
    });
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch("https://your-api-endpoint.com/add", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });
  //     const result = await response.json();
  //     console.log("ارسال موفق:", result);
  //   } catch (error) {
  //     console.error("خطا در ارسال:", error);
  //   }
  // };
  const handleSubmit = () => {
    console.log ({formData})
  };

  return (
    <div className="form-container" style={{display:"flex", flexDirection:"column"}}>
      <input
        className="formInput"
        type="text"
        name="name"
        placeholder="نام"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        className="formInput"
        type="text"
        name="description"
        placeholder="توضیحات"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        className="formInput"
        type="text"
        name="date"
        placeholder="تاریخ"
        value={formData.date}
        onChange={handleChange}
      />
      <input
        className="formInput"
        type="text"
        name="time"
        placeholder="زمان"
        value={formData.time}
        onChange={handleChange}
      />

      <div className="weekdays">
        <label>تکرار در هفته:</label>
        {weekDays.map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              checked={formData.repeatDays.includes(day)}
              onChange={() => handleCheckboxChange(day)}
            />
            {day}
          </label>
        ))}
      </div>

      <button className="Gray Medium Pill ButtonMipiboy" onClick={handleSubmit}>افزودن</button>
    </div>
  );
};

export default AddTaskForm;