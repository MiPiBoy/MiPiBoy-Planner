import { useState, useRef, useCallback } from "react";
import { supabase } from "../../utils/supabase";
import quixieIcon from "../../assets/quixieIcon.svg";
import "../../Style/Liquid-glass.css";
import moment from "moment-jalaali";
import { useTaskContext } from '../../Components/TaskContext';


const AVALAI_API_KEY = process.env.REACT_APP_AVALAI_API_KEY;
const AVALAI_URL = "https://api.avalai.ir/v1/chat/completions";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const Quixie = ({ style, userId, onBoxAdded }) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const { setCountdown, setSuccess, setError, setStatus } = useTaskContext();

    const isRequesting = useRef(false);
    const lastRequestTime = useRef(0);

    // ───── پرامپت سیستم برای Quixie ─────
    const SYSTEM_PROMPT = `تو "Quixie"، "کوئیکسی" هستی، دستیار هوشمند فارسی‌زبان اپلیکیشن مدیریت مالی.
وظیفه تو: تحلیل جملات فارسی کاربر و استخراج اطلاعات برای ساخت "باکس پس‌انداز".

══════════════════════
اطلاعات زمانی
══════════════════════
- امروز: today
- سال جاری: year
- ماه جاری: month
- ماه‌های 1 تا 6 (فروردین تا شهریور): هر کدام 31 روز
- ماه‌های 7 تا 11 (مهر تا بهمن): هر کدام 30 روز  
- ماه 12 (اسفند): همیشه 29 روز (سال کبیسه را در نظر نگیر)

══════════════════════
قوانین استخراج تاریخ (date)
══════════════════════
- فرمت خروجی تاریخ باید یکی از این سه حالت باشد: "YYYY-MM-DD", "MM-DD" (اگر سال، سال جاری بود), یا "DD" (اگر سال و ماه، جاری بودند).
- اگر تاریخ مشخص نیست یا اعلام نشده، مقدار را "" (رشته خالی) قرار بده.
--- قواعد تبدیل عبارات زمانی:
- "فردا": تاریخ امروز + 1 روز
- "پس‌فردا": تاریخ امروز + 2 روز
- "آخر هفته": نزدیک‌ترین جمعه پیش رو.
- "X روز دیگه": تاریخ امروز + X روز
- "X هفته دیگه": تاریخ امروز + (X * 7) روز
- "X ماه دیگه": به عدد ماه جاری X واحد اضافه کن. روز را ثابت نگه دار مگر اینکه ماه مقصد آن روز را نداشته باشد (در این صورت آخرین روز ماه مقصد را انتخاب کن).
- "آخر سال" یا "پایان سال": همیشه "12-29".
- "آخر ماه" یا "پایان ماه": با توجه به تقویم ساده‌شده بالا، آخرین روز ماه جاری را محاسبه کن.
- "عید نوروز": همیشه "01-01" سال بعد.
- فصل‌ها:
  - "بهار" یا "تا بهار": "01-01"
  - "تابستان" یا "تا تابستان": "04-01"
  - "پاییز" یا "تا پاییز": "07-01"
  - "زمستان" یا "تا زمستان": "10-01"
  ( اگر فصل ذکر شده در سال جاری گذشته است، فصل سال بعد را در نظر بگیر. )
- انتهای فصل‌ها:
  - "آخر بهار" یا "پایان بهار": "03-31"
  - "آخر تابستان" یا "پایان تابستان": "06-31"
  - "آخر پاییز" یا "پایان پاییز": "09-30"
  - "آخر زمستان" یا "پایان زمستان": "12-29"
- نام ماه‌ها به عدد:
  - فروردین: 01, اردیبهشت: 02, خرداد: 03
  - تیر: 04, مرداد: 05, شهریور: 06
  - مهر: 07, آبان: 08, آذر: 09
  - دی: 10, بهمن: 11, اسفند: 12
  - مثال: "دهم خرداد" می‌شود "03-10".

══════════════════════
قوانین استخراج مبلغ (requiredValue)
══════════════════════
- خروجی باید فقط عدد صحیح (integer) و غیرمنفی (شامل صفر) باشد. بدون هیچ‌گونه جداکننده (کاما، نقطه).
- اگر مبلغی مشخص نشده، مقدار را 0 قرار بده.
- اگر مبلغ به صورت بازه‌ای بود (مثلا "بین ۵ تا ۶ میلیون")، عدد بزرگتر را در نظر بگیر.
- واحدهای پولی:
  - "میلیون": × 1,000,000 ("یک و نیم میلیون" = 1500000)
  - "میلیارد": × 1,000,000,000 ("دو و نیم میلیارد" = 2500000000)
  - "هزار تومان" یا "هزار تومن": × 1,000 ("پانصد هزار تومن" = 500000)
- "تومان" و "تومن" یکسان هستند و در محاسبه نهایی تأثیری ندارند.
- اعداد فارسی (۱۲۳) و انگلیسی (123) هر دو معتبر هستند.

══════════════════════
قوانین نام‌گذاری (name)
══════════════════════
- نام باکس باید کوتاه و واضح باشد (حداکثر 4 کلمه).
- نام را از هدف اصلی جمله کاربر استخراج کن. (مثال: "میخوام برای ماشین پول جمع کنم" -> "ماشین").
- اگر هدف مشخصی در جمله وجود ندارد، از نام پیش‌فرض "پس‌انداز" استفاده کن.
- نام هرگز نمی‌تواند خالی باشد.

══════════════════════
قوانین توضیحات (description)
══════════════════════
- توضیحات، یک جمله کوتاه فارسی درباره جزئیات هدف پس‌انداز است (حداکثر 100 کاراکتر).
- فقط در صورتی که جزئیات بیشتری در جمله کاربر وجود دارد که در نام جا نشده، این فیلد را پر کن. یا توسط کاربر مشخص شده باشد
- در غیر این صورت، آن را "" (رشته خالی) باقی بگذار.

══════════════════════
محدودیت‌های خروجی
══════════════════════
- خروجی تو باید فقط و فقط یک آبجکت JSON خالص باشد.
- مطلقا هیچ متن اضافه، توضیح، markdown یا بک‌تیک در خروجی قرار نده.
- اگر جمله کاربر هیچ ربطی به پس‌انداز، خرید یا هدف مالی ندارد، این JSON پیش‌فرض را برگردان:
  {"name":"پس‌انداز","description":"","date":"","requiredValue":0}

══════════════════════
مثال‌های ورودی/خروجی
(در تمام مثال‌های زیر، فرض کن تاریخ امروز 1404/11/25 است.)
══════════════════════
ورودی: "باکس ماشین ۵۰ میلیون تا آخر سال"
خروجی: {"name":"ماشین","description":"","date":"12-29","requiredValue":50000000}

ورودی: "میخوام برای سفر ترکیه ۲۰ میلیون تا تابستون جمع کنم"
خروجی: {"name":"سفر ترکیه","description":"","date":"1405-04-01","requiredValue":20000000}

ورودی: "لپتاپ ۱۵ میلیون سه ماه دیگه"
خروجی: {"name":"لپتاپ","description":"","date":"1405-02-25","requiredValue":15000000}

ورودی: "میخوام ۵۰۰ هزار تومن پس‌انداز کنم"
خروجی: {"name":"پس‌انداز","description":"","date":"","requiredValue":500000}

ورودی: "عروسی دو و نیم میلیارد آخر بهار"
خروجی: {"name":"عروسی","description":"","date":"1405-03-31","requiredValue":2500000000}

ورودی: "آیفون ۱۶ پرو مکس"
خروجی: {"name":"آیفون ۱۶ پرو مکس","description":"","date":"","requiredValue":0}

ورودی: "هدیه تولد مامان هفته دیگه ۲ میلیون"
خروجی: {"name":"هدیه تولد مامان","description":"","date":"1404-12-02","requiredValue":2000000}

ورودی: "شهریه دانشگاه تا بیستم شهریور حدود ۳ میلیون"
خروجی: {"name":"شهریه دانشگاه","description":"","date":"1405-06-20","requiredValue":3000000}

ورودی: "میخوام برای خرید گوشی سامسونگ S25 Ultra پول جمع کنم"
خروجی: {"name":"گوشی سامسونگ","description":"خرید مدل S25 Ultra","date":"","requiredValue":0}

ورودی: "یه پس انداز برای خرید خونه بین ۴ تا ۵ میلیارد"
خروجی: {"name":"خرید خونه","description":"","date":"","requiredValue":5000000000}

ورودی: "سلام چطوری؟"
خروجی: {"name":"پس‌انداز","description":"","date":"","requiredValue":0}

ورودی: "تا آخر هفته باید ۵۰۰ هزار تومن برای قسط جور کنم"
خروجی: {"name":"قسط","description":"","date":"11-29","requiredValue":500000}

ورودی: "برای فردا یه تومن میخوام بذارم کنار"
خروجی: {"name":"پس‌انداز","description":"","date":"11-26","requiredValue":1000}

ورودی: "باید تا آخر ماه بدهیمو بدم. یک و نیم میلیون."
خروجی: {"name":"بدهی","description":"","date":"11-30","requiredValue":1500000}

ورودی: "پس انداز سفر عید نوروز ۱۰ میلیون"
خروجی: {"name":"سفر عید نوروز","description":"","date":"1405-01-01","requiredValue":10000000}

ورودی: "خرید PS5 تا ۲۰ دی ماه به مبلغ ۲۵ میلیون تومان"
خروجی: {"name":"خرید PS5","description":"","date":"1405-10-20","requiredValue":25000000}

`;


    // توی SYSTEM_PROMPT جایگزین کن:
    const today = moment().format("jYYYY/jMM/jDD");
    const currentMonth = moment().jMonth() + 1; // 1-12
    const currentYear = moment().jYear();

    const DYNAMIC_PROMPT = SYSTEM_PROMPT
        .replace("today", today)
        .replace("year", currentYear)
        .replace("month", currentMonth);

    // ───── شمارش معکوس ─────
    const startCountdown = useCallback(async (seconds) => {
        for (let s = seconds; s > 0; s--) {
            setCountdown(s);
            await wait(1000);
        }
        setCountdown(0);
    }, []);

    // ───── ارسال با retry ─────
    const callAvalAI = async (messages) => {

        const MAX_RETRIES = 3;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            setStatus(`📡 ارسال درخواست... (تلاش ${attempt}/${MAX_RETRIES})`);

            const res = await fetch(AVALAI_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AVALAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model:
"gemini-3.1-flash-lite-preview",
                    messages: messages,
                    temperature: 0.2,
                    max_tokens: 500,
                    response_format: {
                        type: "json_schema",
                        json_schema: {
                            name: "saving_box",
                            strict: true,
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string", description: "نام باکس پس‌انداز" },
                                    description: { type: "string", description: "توضیحات باکس" },
                                    date: {
                                        type: "string",
                                        description: "تاریخ هدف YYYY-MM-DD شمسی",
                                    },
                                    requiredValue: {
                                        type: "number",
                                        description: "مبلغ هدف به تومان",
                                    },
                                },
                                required: ["name"],
                                additionalProperties: false,
                            },
                        },
                    },
                }),
            });

            if (res.ok) {
                setStatus("✅ پاسخ دریافت شد!");
                // ✅ اینجا JSON رو میخونیم و برمیگردونیم
                const data = await res.json();
                return data;
            }

            if (res.status === 429) {
                const waitSec = attempt * 15;
                setStatus(`⏳ محدودیت نرخ. ${waitSec} ثانیه صبر...`);
                await startCountdown(waitSec);
                setStatus("");
                continue;
            }

            // ❌ خطاهای دیگه
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error?.message || `خطا: ${res.status}`);
        }

        throw new Error("بعد از ۳ تلاش جواب نگرفتیم. کمی صبر کنید.");
    };

    // ───── تابع اصلی ─────
    const handleSubmit = async () => {
        if (!prompt.trim() || isRequesting.current || disabled) return;

        const now = Date.now();
        if (now - lastRequestTime.current < 3000) {
            setError("⏳ بین هر درخواست ۳ ثانیه صبر کنید.");
            return;
        }

        isRequesting.current = true;
        lastRequestTime.current = Date.now();
        setLoading(true);
        setError("");
        setSuccess("");
        setStatus("🧠 در حال پردازش...");

        try {
            const messages = [
                {
                    role: "system",
                    content: DYNAMIC_PROMPT,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ];

            // ✅ حالا data مستقیم برمیگرده (نه Response)
            const data = await callAvalAI(messages);

            // ───── استخراج JSON ─────
            let text = data.choices?.[0]?.message?.content;
            if (!text) throw new Error("پاسخ خالی دریافت شد");

            let boxData;
            try {
                boxData = JSON.parse(text);
            } catch {
                // اگه JSON خالص نبود، با regex استخراج کن
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch)
                    throw new Error("فرمت پاسخ نامعتبر. دوباره تلاش کنید.");
                boxData = JSON.parse(jsonMatch[0]);
            }

            // اعتبارسنجی
            if (!boxData.name) {
                throw new Error("نام باکس تشخیص داده نشد.");
            }
            if (typeof boxData.requiredValue !== 'number') {
                throw new Error("مبلغ هدف تشخیص داده نشد.");
            }
            // if (typeof boxData.date !== 'string') {
            //     throw new Error("تاریخ هدف تشخیص داده نشد.");
            // }

            // ───── ذخیره در Supabase ─────
            setStatus("💾 ذخیره در دیتابیس...");
            const { error: dbErr } = await supabase.from("BuckBoxs").insert({
                name: boxData.name,
                description: boxData.description || "",
                date: boxData.date,
                requiredValue: Number(boxData.requiredValue),
                user_id: userId,
            });

            if (dbErr) throw new Error(dbErr.message);

            setSuccess(
                `✅ باکس "${boxData.name}" — ${Number(
                    boxData.requiredValue
                ).toLocaleString()} تومان — تا ${boxData.date} ساخته شد!`
            );
            setPrompt("");
            setStatus("");
            if (onBoxAdded) onBoxAdded();

            setDisabled(true);
            setTimeout(() => setDisabled(false), 3000);
        } catch (err) {
            setError(err.message);
            setStatus("");
        } finally {
            setLoading(false);
            isRequesting.current = false;
        }
    };

    // ───── UI ─────

    return (
        <div className="quixie notEffect" style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                <defs><filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.015" numOctaves="2" seed="92" result="noise" />
                    <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                    <feDisplacementMap in="SourceGraphic" in2="blurred" scale="200" xChannelSelector="R" yChannelSelector="G" />
                </filter></defs></svg>
            <div className="input-wrapper">
                <img className="icon" src={quixieIcon}></img>
                <input type="text" name="text" className="input" placeholder="بسپارش به Quixie." disabled={loading} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} value={prompt} />
                <button className="Subscribe-btn" onClick={handleSubmit} disabled={loading || !prompt.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 38 15" className="arrow"><path d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" d="m7.187 13.528l-.034.056a.2.2 0 0 1-.306 0l-.034-.056l-.069-.175l.256.101l.255-.1zM6.813 2.472a.2.2 0 0 1 .374 0L8.219 5.09a3 3 0 0 0 1.69 1.69l2.444.963l.101.256l-.1.255l-2.445.964l-.143.06a3 3 0 0 0-1.547 1.63l-.964 2.444l-.255.101l-.256-.1l-.963-2.445a3 3 0 0 0-1.547-1.63l-.143-.06l-2.62-1.032a.2.2 0 0 1 0-.374l.175-.069l2.445-.963a3 3 0 0 0 1.63-1.547l.06-.143zm-.102 2.986A4 4 0 0 1 4.648 7.63l-.19.08l-.733.29l.733.289a4 4 0 0 1 2.253 2.253l.289.732l.29-.732a4 4 0 0 1 2.252-2.253L10.274 8l-.732-.29A4 4 0 0 1 7.37 5.649l-.08-.19L7 4.725zm5.817 2.355a.2.2 0 0 1 0 .374l-.175.068l.101-.255l-.1-.256zm-.165-4.947c.224.401.579.716 1.011.887l.39.154a.1.1 0 0 1 0 .186l-.087.034l-.303.12l-.188.086a2 2 0 0 0-.939 1.041l-.12.303l-.034.087l-.016.028a.1.1 0 0 1-.154 0l-.016-.028l-.035-.087l-.12-.303a2 2 0 0 0-.937-1.041l-.189-.086l-.39-.154a.1.1 0 0 1 0-.186l.086-.035l.304-.12c.432-.17.786-.485 1.01-.886L12 2.723zm-.456-.63a.1.1 0 0 1 .186 0l.154.39q.05.124.116.24L12 2.723l-.364.143l.031-.052l.086-.188zm.519 6.951a.08.08 0 0 1 .148 0a3.97 3.97 0 0 0 2.239 2.239a.08.08 0 0 1 0 .148l-.07.03a3.97 3.97 0 0 0-2.169 2.209l-.012.022a.08.08 0 0 1-.123 0l-.013-.023a3.97 3.97 0 0 0-2.049-2.158l-.19-.08a.08.08 0 0 1 0-.148a3.97 3.97 0 0 0 2.239-2.239m.074 1.784q-.245.285-.53.529q.285.245.53.528q.245-.284.528-.528a5 5 0 0 1-.528-.53" /></svg>
                </button>
            </div>
        </div>
    )
};

export default Quixie;