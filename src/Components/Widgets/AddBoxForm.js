import "../../Style/SwitchButton.css"
import "../../Style/CheckButton.css"
import "../../Style/Input.css"
import "../../Style/Button.css"
import "../../Style/AddTaskForm.css"
import jalaali from 'jalaali-js';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { supabase } from '../../utils/supabase'

const AddBoxForm = () => {

const dateRegex = new RegExp(
    `^(` +
        `|` +
        `([1-9]|[12][0-9]|3[01])` + // فقط روز
        `|([1-9]|[12][0-9]|3[01])/([1-9]|1[0-2])` + // روز/ماه
        `|([1-9]|[12][0-9]|3[01])/([1-9]|1[0-2])/([1-9][0-9]{3})` + // روز/ماه/سال
    `)$`
);

const schema = yup.object().shape({
    name : yup.string().required("فیلد نام اجباری است"),
    description : yup.string(),
    date : yup.string().matches(dateRegex, "تاریخ معتبر نیست"),
    requiredValue: yup.number().nullable().transform((value, originalValue) => originalValue === '' ? 0 : value).typeError("مقدار عددی وارد کنید")
})

const { register, handleSubmit, reset, formState:{errors} } = useForm({
resolver: yupResolver(schema),
});
       
const [dateInfo, setDateInfo] = useState({});

useEffect(() => {
const now = new Date();

const { jy, jm, jd } = jalaali.toJalaali(now);
const persianNow = `${jy}/${jm}/${jd}`;
const persianDay = `${jy}/${jm}/${jd}`;
const persianMonth = `/${jm}/${jy}`;
const persianYear = `/${jy}`;

setDateInfo({
    persianNow,
    persianDay,
    persianMonth,
    persianYear,
});
}, []);


const onFormSubmit = async (formData) => {

    let finalDate = formData.date;

    if (formData.date !== '') {
    const parts = formData.date.split('/');

    if (parts.length === 1) {
        finalDate = `${formData.date}${dateInfo.persianMonth}`;
    } else if (parts.length === 2) {
        finalDate = `${formData.date}${dateInfo.persianYear}`;
    }
    }

const payload = {
    ...formData,
    date: finalDate,
};

const { data: insertedData, error } = await supabase
    .from('BuckBoxs')
    .insert([payload]);
if (error) {
    console.error("خطا در ثبت باکس:", error.message);
} else {
    console.log(`باکس ${formData.name} ثبت شد:`, insertedData);
    alert(`باکس ${formData.name} افزوده شد`)
    reset({
    name: "",
    description: "",
    date: "",
    requiredValue: "",
    })
}
};

return (
    <div className="addTaskForm">
    <div style={{display:'none'}} className='titleDiv'>
        <p className='title'>افزودن باکس</p>
    </div>
    <div>
      <div style={{height: '20px'}}></div>
    </div>
  <form className="forms" onSubmit={handleSubmit(onFormSubmit)}>

    <input className="formInput" type="text" placeholder="نام" {...register("name")} />
    {errors.name && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.name.message}</p>)}

    <input className="formInput" type="text" placeholder="توضیحات" {...register("description")} />
    {errors.description && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 8}}>{errors.description.message}</p>)}

    <input className="formInput" type="text" placeholder="مقدار هدف" {...register("requiredValue")} />
    {errors.requiredValue && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.requiredValue.message}</p>)}

    <input className="formInput" type="text" placeholder="تاریخ" {...register("date")} />
    {errors.date && (<style>{`.formInput[type="text"] {border-bottom: solid 2px #rrrrrr;}`}</style>,<p style={{fontSize: 10, padding: "8px"}}>{errors.date.message}</p>)}

    <button className="Gray Medium Pill ButtonMipiboy AddTaskSubmit" type="submit">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
      <span>افزودن</span>
    </button>
  </form>
  </div>
)};

export default AddBoxForm;