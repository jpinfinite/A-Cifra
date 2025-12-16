var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/newsletter/subscribe.ts
async function onRequestPost(context) {
  const { request, env } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Content-Type": "application/json"
  };
  try {
    let body;
    let email;
    try {
      const rawBody = await request.text();
      console.log("\u{1F4E5} Cloudflare Function - Raw body:", rawBody.substring(0, 100));
      if (!rawBody) {
        throw new Error("Body vazio");
      }
      body = JSON.parse(rawBody);
      email = body?.email;
    } catch (parseError) {
      console.error("\u274C Erro ao fazer parse do JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Dados inv\xE1lidos enviados" }),
        { status: 400, headers }
      );
    }
    console.log("\u{1F50D} Cloudflare Newsletter API:", {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      hasEmail: !!email,
      emailLength: email?.length || 0,
      hasBrevoKey: !!env.BREVO_API_KEY,
      brevoKeyPrefix: env.BREVO_API_KEY?.substring(0, 10) || "none",
      brevoListId: env.BREVO_LIST_ID
    });
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Email \xE9 obrigat\xF3rio" }),
        { status: 400, headers }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: "Formato de email inv\xE1lido" }),
        { status: 400, headers }
      );
    }
    const BREVO_API_KEY = env.BREVO_API_KEY;
    const BREVO_LIST_ID = env.BREVO_LIST_ID;
    let brevoSuccess = false;
    if (BREVO_API_KEY && BREVO_API_KEY.startsWith("xkeysib-")) {
      try {
        const contactData = {
          email: cleanEmail,
          updateEnabled: true,
          attributes: {
            ORIGEM: "A Cifra Newsletter",
            DATA_INSCRICAO: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            SITE: "a-cifra.com.br"
          }
        };
        if (BREVO_LIST_ID && !isNaN(parseInt(BREVO_LIST_ID))) {
          contactData.listIds = [parseInt(BREVO_LIST_ID)];
        }
        console.log("\u{1F680} Enviando para Brevo via Cloudflare:", { email: cleanEmail });
        const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
          },
          body: JSON.stringify(contactData)
        });
        const brevoData = await brevoResponse.json();
        if (brevoResponse.ok) {
          console.log("\u2705 Sucesso no Brevo via Cloudflare:", cleanEmail);
          brevoSuccess = true;
        } else if (brevoData.code === "duplicate_parameter") {
          console.log("\u{1F4E7} Email j\xE1 existe no Brevo:", cleanEmail);
          brevoSuccess = true;
        } else {
          console.error("\u274C Erro Brevo:", brevoResponse.status, brevoData);
        }
      } catch (brevoException) {
        console.error("\u274C Exce\xE7\xE3o Brevo:", brevoException);
      }
    } else {
      console.log("\u26A0\uFE0F Brevo n\xE3o configurado no Cloudflare");
    }
    console.log("\u2705 Cloudflare Function - Inscri\xE7\xE3o processada:", {
      email: cleanEmail,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      brevoSuccess
    });
    const successMessage = brevoSuccess ? "Inscri\xE7\xE3o realizada com sucesso! Bem-vindo \xE0 comunidade A Cifra." : "Inscri\xE7\xE3o registrada com sucesso! Voc\xEA receber\xE1 nossas atualiza\xE7\xF5es em breve.";
    return new Response(
      JSON.stringify({
        success: true,
        message: successMessage
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error("\u274C Erro cr\xEDtico na Cloudflare Function:", error);
    return new Response(
      JSON.stringify({
        error: "Erro tempor\xE1rio. Sua inscri\xE7\xE3o foi registrada e ser\xE1 processada em breve."
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequestPost, "onRequestPost");
async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");

// api/generate-content.ts
async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const {
      topic,
      keywords = [],
      type = "article",
      length = "medium"
    } = await request.json();
    if (!topic || topic.trim().length === 0) {
      return Response.json(
        { error: "Topic is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    const prompt = buildPrompt(topic, keywords, type, length);
    console.log("Generating content with Llama 3.3 70B...");
    const response = await env.AI.run(
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      {
        messages: [
          {
            role: "system",
            content: getSystemPrompt(type)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: getMaxTokens(length),
        temperature: 0.7
      }
    );
    return Response.json(
      {
        topic,
        type,
        content: response.response,
        tokens: response.tokens_used || 0
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Generate content error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
__name(onRequest, "onRequest");
function getSystemPrompt(type) {
  const prompts = {
    article: `Voc\xEA \xE9 um especialista em criptomoedas que escreve artigos educativos em portugu\xEAs brasileiro para o site A Cifra.

Seu estilo:
- Educacional mas acess\xEDvel
- T\xE9cnico quando necess\xE1rio, mas sempre explicando termos
- Baseado em dados e fatos
- Otimista sobre o futuro das criptos
- Transparente sobre riscos
- Usa exemplos pr\xE1ticos em R$ (Brasil)

Sempre inclua:
- Introdu\xE7\xE3o contextualizada
- Se\xE7\xF5es bem estruturadas (H2, H3)
- Exemplos pr\xE1ticos
- Disclaimer de investimento
- Conclus\xE3o com resumo`,
    faq: `Voc\xEA \xE9 um especialista em criptomoedas que cria FAQs educativas em portugu\xEAs brasileiro.

Formato:
- Perguntas diretas e objetivas
- Respostas completas mas concisas (2-3 par\xE1grafos)
- Linguagem acess\xEDvel
- Exemplos quando relevante
- Otimizado para featured snippets do Google`,
    summary: `Voc\xEA \xE9 um especialista que cria resumos concisos de conte\xFAdo sobre criptomoedas em portugu\xEAs brasileiro.

Formato:
- Resumo objetivo em 2-3 par\xE1grafos
- Destaque dos pontos principais
- Linguagem clara e direta`,
    meta: `Voc\xEA \xE9 um especialista em SEO que cria meta descriptions otimizadas em portugu\xEAs brasileiro.

Formato:
- 150-160 caracteres
- Inclui keyword principal
- Call-to-action
- Atrativo para cliques`
  };
  return prompts[type] || prompts.article;
}
__name(getSystemPrompt, "getSystemPrompt");
function buildPrompt(topic, keywords, type, length) {
  const wordCounts = {
    short: "500-800",
    medium: "1500-2000",
    long: "3000-5000"
  };
  const prompts = {
    article: `Escreva um artigo completo sobre: ${topic}

${keywords.length > 0 ? `Keywords para incluir: ${keywords.join(", ")}` : ""}

Requisitos:
- ${wordCounts[length]} palavras
- Tom educacional e acess\xEDvel
- Estrutura clara com H2 e H3
- Exemplos pr\xE1ticos em R$ (Brasil)
- Inclua disclaimer de investimento no final
- Otimizado para SEO

Formato Markdown com:
## Se\xE7\xF5es principais (H2)
### Subse\xE7\xF5es (H3)
- Listas quando apropriado
- **Negrito** para termos importantes
- Exemplos pr\xE1ticos`,
    faq: `Crie 10 perguntas e respostas (FAQ) sobre: ${topic}

Formato:
**Pergunta 1:** [pergunta direta]
**Resposta:** [resposta completa em 2-3 par\xE1grafos]

Otimize para featured snippets do Google.`,
    summary: `Crie um resumo executivo sobre: ${topic}

Formato:
- 2-3 par\xE1grafos
- Destaque os pontos principais
- Linguagem clara e objetiva`,
    meta: `Crie uma meta description otimizada para: ${topic}

Requisitos:
- 150-160 caracteres
- Inclua keyword principal
- Call-to-action
- Atrativo para cliques`
  };
  return prompts[type] || prompts.article;
}
__name(buildPrompt, "buildPrompt");
function getMaxTokens(length) {
  const tokens = {
    short: 1500,
    medium: 3e3,
    long: 6e3
  };
  return tokens[length] || 3e3;
}
__name(getMaxTokens, "getMaxTokens");

// api/generate-embeddings.ts
async function onRequest2(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { articles } = await request.json();
    if (!articles || !Array.isArray(articles)) {
      return Response.json(
        { error: "Articles array is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    console.log(`Generating embeddings for ${articles.length} articles...`);
    const embeddings = [];
    let processed = 0;
    for (const article of articles) {
      try {
        const text = `${article.title}. ${article.excerpt}. ${article.content.substring(0, 1e3)}`;
        const embedding = await env.AI.run("@cf/google/embeddinggemma-300m", {
          text
        });
        embeddings.push({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          embedding: embedding.data[0]
        });
        processed++;
        console.log(`Processed ${processed}/${articles.length}: ${article.title}`);
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
      }
    }
    await env.EMBEDDINGS.put("all-embeddings", JSON.stringify(embeddings));
    console.log(`\u2705 Saved ${embeddings.length} embeddings to KV`);
    return Response.json(
      {
        success: true,
        processed: embeddings.length,
        total: articles.length,
        message: "Embeddings generated and saved successfully"
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Generate embeddings error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
__name(onRequest2, "onRequest");

// api/generate-image.ts
async function onRequest3(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const {
      prompt,
      articleSlug,
      style = "professional"
    } = await request.json();
    if (!prompt || prompt.trim().length === 0) {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    const optimizedPrompt = buildImagePrompt(prompt, style);
    console.log("Generating image with FLUX 2 Dev...");
    console.log("Prompt:", optimizedPrompt);
    const response = await env.AI.run("@cf/black-forest-labs/flux-2-dev", {
      prompt: optimizedPrompt,
      num_steps: 20,
      guidance: 7.5
    });
    let imageUrl = null;
    if (articleSlug && env.R2_BUCKET) {
      const filename = `articles/${articleSlug}-${Date.now()}.png`;
      await env.R2_BUCKET.put(filename, response);
      imageUrl = `https://media.a-cifra.com.br/${filename}`;
      console.log("Image saved to R2:", imageUrl);
    }
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    return Response.json(
      {
        success: true,
        prompt: optimizedPrompt,
        image: `data:image/png;base64,${base64}`,
        imageUrl
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Generate image error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
__name(onRequest3, "onRequest");
function buildImagePrompt(userPrompt, style) {
  const stylePresets = {
    professional: "professional, clean, corporate, high quality, detailed",
    modern: "modern, sleek, contemporary, minimalist, elegant",
    minimalist: "minimalist, simple, clean lines, uncluttered, refined",
    vibrant: "vibrant, colorful, dynamic, energetic, bold"
  };
  const baseStyle = stylePresets[style] || stylePresets.professional;
  return `${userPrompt}, ${baseStyle}, cryptocurrency theme, blue and gold color scheme, 1200x630 pixels, high resolution, professional photography, studio lighting, sharp focus, no text, no watermark`;
}
__name(buildImagePrompt, "buildImagePrompt");

// api/semantic-search.ts
async function onRequest4(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { query, limit = 10 } = await request.json();
    if (!query || query.trim().length === 0) {
      return Response.json(
        { error: "Query is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    console.log("Generating query embedding...");
    const queryEmbedding = await env.AI.run("@cf/google/embeddinggemma-300m", {
      text: query
    });
    console.log("Fetching article embeddings...");
    const embeddingsData = await env.EMBEDDINGS.get("all-embeddings", "json");
    if (!embeddingsData) {
      return Response.json(
        { error: "No embeddings found. Run generate-embeddings first." },
        { status: 404, headers: corsHeaders }
      );
    }
    const results = calculateSimilarity(
      queryEmbedding.data[0],
      embeddingsData,
      limit
    );
    return Response.json(
      {
        query,
        results,
        count: results.length
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Semantic search error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
__name(onRequest4, "onRequest");
function calculateSimilarity(queryEmbedding, articlesData, limit) {
  const similarities = articlesData.map((article) => {
    const similarity = cosineSimilarity(queryEmbedding, article.embedding);
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      similarity
    };
  });
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, limit);
}
__name(calculateSimilarity, "calculateSimilarity");
function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dotProduct / (normA * normB);
}
__name(cosineSimilarity, "cosineSimilarity");

// api/text-to-speech.ts
async function onRequest5(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const {
      text,
      articleSlug,
      voice = "professional",
      language = "en"
    } = await request.json();
    if (!text || text.trim().length === 0) {
      return Response.json(
        { error: "Text is required" },
        { status: 400, headers: corsHeaders }
      );
    }
    const maxChars = 5e3;
    const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + "..." : text;
    console.log("Generating audio with Aura 2...");
    console.log("Text length:", truncatedText.length);
    const model = language === "es" ? "@cf/deepgram/aura-2-es" : "@cf/deepgram/aura-2-en";
    const response = await env.AI.run(model, {
      text: truncatedText,
      voice
    });
    let audioUrl = null;
    if (articleSlug && env.R2_BUCKET) {
      const filename = `podcasts/${articleSlug}-${Date.now()}.mp3`;
      await env.R2_BUCKET.put(filename, response, {
        httpMetadata: {
          contentType: "audio/mpeg"
        }
      });
      audioUrl = `https://media.a-cifra.com.br/${filename}`;
      console.log("Audio saved to R2:", audioUrl);
    }
    return new Response(response, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": articleSlug ? `attachment; filename="${articleSlug}.mp3"` : 'attachment; filename="audio.mp3"',
        "X-Audio-URL": audioUrl || ""
      }
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
__name(onRequest5, "onRequest");

// _middleware.ts
async function onRequest6(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  if (!url.pathname.endsWith("/") && !url.pathname.includes(".")) {
    url.pathname += "/";
    return Response.redirect(url.toString(), 301);
  }
  const response = await next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}
__name(onRequest6, "onRequest");

// ../.wrangler/tmp/pages-tJCvR5/functionsRoutes-0.39040493842995816.mjs
var routes = [
  {
    routePath: "/api/newsletter/subscribe",
    mountPath: "/api/newsletter",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/newsletter/subscribe",
    mountPath: "/api/newsletter",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/generate-content",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/generate-embeddings",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/generate-image",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/semantic-search",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/text-to-speech",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest6],
    modules: []
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
