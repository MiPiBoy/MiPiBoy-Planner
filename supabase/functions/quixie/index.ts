import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: { message: "Method not allowed." } }, 405);
  }

  const apiKey = Deno.env.get("AVALAI_API_KEY");
  if (!apiKey) {
    return jsonResponse({
      error: {
        message: "کلید AvalAI در تنظیمات Supabase ثبت نشده است. در Edge Functions → Secrets مقدار AVALAI_API_KEY را اضافه کنید.",
      },
    }, 503);
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: { message: "درخواست Quixie نامعتبر است." } }, 400);
    }

    const upstream = await fetch("https://api.avalai.ir/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-3.1-flash-lite-preview",
        messages,
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
                date: { type: "string", description: "تاریخ هدف YYYY-MM-DD شمسی" },
                requiredValue: { type: "number", description: "مبلغ هدف به تومان" },
              },
              required: ["name"],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    const responseText = await upstream.text();
    return new Response(responseText, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return jsonResponse({
      error: { message: error instanceof Error ? error.message : "خطای ناشناخته در Quixie." },
    }, 500);
  }
});
