# پلنر MiPiBoy
## 📝 توضیحات پروژه
این پروژه یک اپلیکیشن چندمنظوره برای مدیریت و برنامه‌ریزی شخصی است. هدف آن ایجاد یک محیط یکپارچه برای کنترل کارهای روزانه، مدیریت مالی، یادداشت‌برداری و دسترسی سریع به سایت‌های پرکاربرد است.

### امکانات اصلی 
- برنامه‌ریزی روزانه: ثبت و مدیریت کارهای روزمره در قالب لیست‌های ساده و قابل پیگیری.
- باکس‌های پس‌انداز: بخش ویژه برای مدیریت اهداف مالی و پیگیری روند پس‌انداز.
- یادداشت‌ها: امکان نوشتن یادداشت‌های کوتاه یا بلند برای ثبت ایده‌ها و نکات مهم.
- میانبرها: دسترسی سریع به وب‌سایت‌های پر استفاده برای صرفه‌جویی در زمان.

### بخش رسیدگی به پروژه (در حال توسعه)
- تعریف فیچرها و تعیین ددلاین برای هر وظیفه.
- اختصاص هر تسک به فرد مناسب در تیم.
- مدیریت پیشرفت پروژه و هماهنگی بین اعضا.

### بخش دانشگاه (در حال توسعه)
- برنامه‌ریزی هفتگی کلاس‌های درسی.
- هماهنگ‌سازی کلاس‌ها با برنامه کاری روزانه.
- مدیریت تمرین‌ها و امتحان‌های هر هفته.
- ایجاد تعادل بین کارهای دانشگاهی و فعالیت‌های شخصی.

## 📷 اسکرین شات ها

### دسکتاپ Dark Violet
![دسکتاپ Dark Violet](src/assets/desktopDVM.png)

### دسکتاپ
![دسکتاپ](src/assets/desktop.png)
### تبلت Dark Violet
![تبلت Dark Violet](src/assets/tabletDVM.png)

### تبلت
![تبلت](src/assets/tablet.png)

### موبایل Dark Violet
![ موبایل Dark Violet](src/assets/mobileDVM.png)

### موبایل
![موبایل](src/assets/mobile.png)

## 👨🏻‍💻 توضیحات فنی

این پروژه به صورت کامل توسط من طراحی و پیاده‌سازی شده است. در طول توسعه، تلاش کردم همه‌ی بخش‌ها را با معماری ماژولار و قابل نگهداری بنویسم تا پروژه هم برای استفاده شخصی و هم برای نمایش در رزومه حرفه‌ای باشد.  

### معماری و مدیریت State
- استفاده از **React Context API** برای مدیریت وضعیت‌های سراسری (global state) مانند حالت‌های انیمیشن، تنظیمات کاربری و داده‌های ذخیره‌شده.  
- پیاده‌سازی الگوهای **persistent state** با کمک `localStorage` و `sessionStorage` تا داده‌ها حتی بعد از refresh مرورگر حفظ شوند.  
- جلوگیری از **duplicate renders** با طراحی دقیق و جداسازی concerns در کامپوننت‌ها.  

### طراحی رابط کاربری (UI/UX)
- **استفاده از CSS پیشرفته**: طراحی انیمیشن‌ها و transitionهای حرفه‌ای با `cubic-bezier` و `keyframes` برای ایجاد حرکت‌های طبیعی و روان.  
- **افکت‌های بصری خاص**: پیاده‌سازی `gradient borders` ، `clip-path` و `water-drop transitions` جهت خلق تجربه‌ی بصری متفاوت و متمایز.  
- **طراحی کاملاً ریسپانسیو**: پوشش کامل دسکتاپ، تبلت و موبایل با تست دقیق روی breakpoints مختلف برای تضمین سازگاری و کیفیت تجربه کاربری.  
- **تم اختصاصی**: ساخت **Dark Violet Theme** به‌عنوان یک حالت ظاهری خاص و حرفه‌ای برای نمایش مدرن‌تر رابط کاربری.  
- **سیستم استایل‌دهی ماژولار**: طراحی یک سیستم کلاس‌بندی مشابه Tailwind برای `input` ، `checkbox` و `button` ها. تنها با افزودن `className` های مشخص (مانند:  
  ```html
  <button className="Gray Medium Pill ButtonMipiboy AddTaskSubmit">
  ```  
  می‌توان به سرعت به استایل‌های از پیش تعریف‌شده دسترسی داشت و توسعه را ساده و مقیاس‌پذیر کرد.  
- **ناوبر حرفه‌ای موبایل**: طراحی Navigation Bar با افکت **Liquid Glass** مشابه آیفون، برای ایجاد جلوه‌ای شفاف، مدرن و لوکس در نسخه موبایل.  

### اعتبارسنجی و فرم‌ها
- استفاده از **Yup** برای اعتبارسنجی فرم‌ها با پیام‌های خطای کاربرپسند.  
- مدیریت robust error handling برای جلوگیری از runtime errors و نمایش بازخورد واضح به کاربر.  

### بخش‌های مختلف پروژه
- **برنامه‌ریزی روزانه:** طراحی لیست‌های ساده و قابل پیگیری برای مدیریت کارهای روزمره.  
- **باکس‌های پس‌انداز:** پیاده‌سازی بخش مالی برای ثبت اهداف و پیگیری روند پس‌انداز.  
- **یادداشت‌ها:** امکان نوشتن یادداشت‌های چندخطی با ذخیره‌سازی پایدار.  
- **میانبرها:** ساخت بخش میانبر برای دسترسی سریع به سایت‌های پرکاربرد.  
- **بخش پروژه‌ها (در حال توسعه):** طراحی اولیه برای مدیریت فیچرها، ددلاین‌ها و تخصیص تسک‌ها به اعضای تیم.  
- **بخش دانشگاه (در حال توسعه):** برنامه‌ریزی کلاس‌های هفتگی، هماهنگی با کارهای روزمره و مدیریت تمرین‌ها و امتحان‌ها.  

### نقش من در پروژه
- **طراحی و توسعه کامل از صفر:** تمامی بخش‌های پروژه، از ایده‌پردازی تا پیاده‌سازی نهایی، به‌طور کامل توسط من انجام شده است.
- **طراحی تجربه کاربری و رابط کاربری:** طراحی اولیه در Figma، پیاده‌سازی رابط کاربری واکنش‌گرا برای تمامی دستگاه‌ها، و ایجاد ساختار تک‌صفحه‌ای (SPA) بدون نیاز به رفرش.
- **بهینه‌سازی عملکرد برای طیف وسیع دستگاه‌ها:** افزودن بخش تنظیمات جهت غیرفعال‌سازی افکت‌های سنگین در دستگاه‌های قدیمی‌تر، با هدف حفظ کارایی و تجربه روان کاربر.
- **معماری و مدیریت State:** طراحی معماری Context و مدیریت پیشرفته state برای ایجاد ساختار پایدار، مقیاس‌پذیر و قابل نگهداری.
- **انیمیشن‌ها و جلوه‌های بصری:** طراحی و پیاده‌سازی انیمیشن‌های حرفه‌ای و تعاملی با استفاده از CSS و JavaScript برای ایجاد تجربه کاربری جذاب و مدرن.
- **اعتبارسنجی و امنیت فرم‌ها:** توسعه سیستم اعتبارسنجی دقیق و کاربرپسند برای جلوگیری از خطاهای ورودی و افزایش کیفیت تعاملات کاربر. 

---

این پروژه ترکیبی از **منطق دقیق، طراحی حرفه‌ای و خلاقیت بصری** است و نشان‌دهنده‌ی توانایی من در ساخت اپلیکیشن‌های مقیاس‌پذیر و کاربرپسند می‌باشد.

---

## 🚀 دموی زنده

برای مشاهده نسخه‌ی آنلاین پروژه می‌توانید از لینک زیر استفاده کنید:

[🌐 مشاهده دمو](https://mipiboy.ir)

> ⚠️ **نکته مهم:**  
> در حال حاضر نسخه‌ی کامل پروژه فقط روی مرورگر **Google Chrome** به‌طور کامل پشتیبانی می‌شود.  
> سایر مرورگرها (Firefox, Safari, Edge) در حال توسعه و عیب‌یابی هستند و ممکن است برخی قابلیت‌ها به‌درستی نمایش داده نشوند.  
> بنابراین برای بهترین تجربه، لطفاً دموی زنده را با **Chrome** باز کنید.  

---

## ⚙️ نحوه نصب و راهاندازی

### 1. کلون کردن پروژه
```bash
git clone https://github.com/MiPiBoy/MiPiBoy-Planner.git
cd mipiboy-planner
```


### 2. نصب وابستگی‌ها

```bash
npm install
```

### 3. تنظیم متغیرهای محیطی
قبل از اجرای پروژه، یک فایل .env در ریشه پروژه ایجاد کنید و مقادیر زیر را وارد نمایید:
```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

این مقادیر را می‌توانید از داشبورد Supabase دریافت کنید. بدون تنظیم این متغیرها، پروژه قادر به اتصال به دیتابیس نخواهد بود.

### 4. اجرای پروژه در حالت توسعه
```bash
npm start
```
بعد از اجرا، پروژه روی آدرس زیر در مرورگر در دسترس خواهد بود:

http://localhost:3000

### 5. ساخت نسخه نهایی
```bash
npm run build
```
این دستور پوشه‌ی build را ایجاد می‌کند که شامل نسخه‌ی بهینه‌شده‌ی پروژه برای انتشار است.

### نکته !
- مطمئن شوید که Node.js و npm روی سیستم نصب باشند.
- برای امنیت بیشتر، کلیدهای Supabase را در محیط‌های عملیاتی (Production) به‌صورت امن مدیریت کنید و هرگز آن‌ها را در مخزن عمومی قرار ندهید.
- اگر از yarn استفاده می‌کنید، می‌توانید به جای npm install بنویسید:
```bash
yarn install
yarn start
```
---

# MiPiBoy Planner
## 📝 Project Description
This project is a multi-purpose application for personal management and planning. Its goal is to create an integrated environment for controlling daily tasks, financial management, note-taking, and quick access to frequently used websites.

### Main Features
- **Daily Planning**: Register and manage daily tasks in simple, trackable lists.
- **Savings Boxes**: Special section for managing financial goals and tracking savings progress.
- **Notes**: Ability to write short or long notes to record ideas and important points.
- **Shortcuts**: Quick access to frequently used websites to save time.

### Project Management Section (Under Development)
- Define features and set deadlines for each task.
- Assign each task to the appropriate team member.
- Manage project progress and coordinate between team members.

### University Section (Under Development)
- Weekly scheduling of classes.
- Synchronization of classes with daily work schedules.
- Management of weekly exercises and exams.
- Creating balance between academic and personal activities.

## 📷 Screenshots

### Desktop Dark Violet
![Desktop Dark Violet](src/assets/desktopDVM.png)

### Desktop
![Desktop](src/assets/desktop.png)

### Tablet Dark Violet
![Tablet Dark Violet](src/assets/tabletDVM.png)

### Tablet
![Tablet](src/assets/tablet.png)

### Mobile Dark Violet
![Mobile Dark Violet](src/assets/mobileDVM.png)

### Mobile
![Mobile](src/assets/mobile.png)

## 👨🏻‍💻 Technical Explanation

This project was completely designed and implemented by me. During development, I made efforts to write all sections with modular and maintainable architecture to make the project both suitable for personal use and professional for showcasing in my portfolio.

### Architecture and State Management
- Use of **React Context API** for managing global states such as animation modes, user settings, and stored data.
- Implementation of **persistent state** patterns using `localStorage` and `sessionStorage` to preserve data even after browser refresh.
- Prevention of **duplicate renders** through precise design and separation of concerns in components.

### User Interface Design (UI/UX)
- **Advanced CSS Usage**: Professional animations and transitions using `cubic-bezier` and `keyframes` to create natural and smooth movements.
- **Special Visual Effects**: Implementation of `gradient borders`, `clip-path`, and `water-drop transitions` to create a distinctive and unique visual experience.
- **Fully Responsive Design**: Complete coverage of desktop, tablet, and mobile with thorough testing on different breakpoints to ensure compatibility and quality user experience.
- **Custom Theme**: Creation of **Dark Violet Theme** as a special and professional appearance mode for a more modern UI presentation.
- **Modular Styling System**: Design of a class system similar to Tailwind for `input`, `checkbox`, and `button` elements. By simply adding specific `className` (such as:
  ```html
  <button className="Gray Medium Pill ButtonMipiboy AddTaskSubmit">
  ```
  you can quickly access predefined styles and make development simple and scalable.
- **Professional Mobile Navigation**: Design of Navigation Bar with **Liquid Glass** effect similar to iPhone, creating a transparent, modern, and luxurious appearance in the mobile version.

### Validation and Forms
- Use of **Yup** for form validation with user-friendly error messages.
- Robust error handling management to prevent runtime errors and display clear feedback to users.

### Different Project Sections
- **Daily Planning**: Design of simple and trackable lists for managing daily tasks.
- **Savings Boxes**: Implementation of financial section for registering goals and tracking savings progress.
- **Notes**: Ability to write multi-line notes with persistent storage.
- **Shortcuts**: Creation of shortcut section for quick access to frequently used websites.
- **Projects Section (Under Development)**: Initial design for managing features, deadlines, and task assignment to team members.
- **University Section (Under Development)**: Weekly class scheduling, coordination with daily tasks, and management of exercises and exams.

### My Role in the Project
- **Complete Design and Development from Scratch**: All project sections, from ideation to final implementation, were completely done by me.
- **User Experience and Interface Design**: Initial design in Figma, implementation of responsive user interface for all devices, and creation of single-page application (SPA) structure without need for refresh.
- **Performance Optimization for Wide Range of Devices**: Addition of settings section to disable heavy effects on older devices, aiming to maintain performance and smooth user experience.
- **Architecture and State Management**: Design of Context architecture and advanced state management to create stable, scalable, and maintainable structure.
- **Animations and Visual Effects**: Design and implementation of professional and interactive animations using CSS and JavaScript to create engaging and modern user experience.
- **Form Validation and Security**: Development of precise and user-friendly validation system to prevent input errors and enhance interaction quality.

---

This project combines **precise logic, professional design, and visual creativity** and demonstrates my ability to build scalable and user-friendly applications.

---

## 🚀 Live Demo

To view the online version of the project, you can use the following link:

[🌐 View Demo](https://mipiboy.ir)

> ⚠️ **Important Note:**  
> Currently, the full version of the project is only fully supported on **Google Chrome**.  
> Other browsers (Firefox, Safari, Edge) are under development and debugging, and some features may not display correctly.  
> Therefore, for the best experience, please open the live demo with **Chrome**.  

---
## ⚙️ Installation and Setup

### 1. Clone the Project
```bash
git clone https://github.com/MiPiBoy/MiPiBoy-Planner.git
cd mipiboy-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Before running the project, create a .env file in the project root and enter the following values:
```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can get these values from your Supabase dashboard. Without setting these variables, the project won't be able to connect to the database.

### 4. Run the Project in Development Mode
```bash
npm start
```
After execution, the project will be accessible in your browser at:

http://localhost:3000

### 5. Build Production Version
```bash
npm run build
```
This command creates a build folder containing the optimized version of the project for deployment.

### Important Notes!
- Make sure Node.js and npm are installed on your system.
- For better security, manage Supabase keys securely in production environments and never expose them in public repositories.
- If you use yarn, you can use instead of npm:
```bash
yarn install
yarn start
```
