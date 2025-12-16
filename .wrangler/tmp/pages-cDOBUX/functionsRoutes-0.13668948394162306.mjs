import { onRequestOptions as __api_newsletter_subscribe_ts_onRequestOptions } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\newsletter\\subscribe.ts"
import { onRequestPost as __api_newsletter_subscribe_ts_onRequestPost } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\newsletter\\subscribe.ts"
import { onRequest as __api_generate_content_ts_onRequest } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\generate-content.ts"
import { onRequest as __api_generate_embeddings_ts_onRequest } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\generate-embeddings.ts"
import { onRequest as __api_generate_image_ts_onRequest } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\generate-image.ts"
import { onRequest as __api_semantic_search_ts_onRequest } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\semantic-search.ts"
import { onRequest as __api_text_to_speech_ts_onRequest } from "D:\\site-cifra\\A-Cifra-main\\functions\\api\\text-to-speech.ts"
import { onRequest as ___middleware_ts_onRequest } from "D:\\site-cifra\\A-Cifra-main\\functions\\_middleware.ts"

export const routes = [
    {
      routePath: "/api/newsletter/subscribe",
      mountPath: "/api/newsletter",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_newsletter_subscribe_ts_onRequestOptions],
    },
  {
      routePath: "/api/newsletter/subscribe",
      mountPath: "/api/newsletter",
      method: "POST",
      middlewares: [],
      modules: [__api_newsletter_subscribe_ts_onRequestPost],
    },
  {
      routePath: "/api/generate-content",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_generate_content_ts_onRequest],
    },
  {
      routePath: "/api/generate-embeddings",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_generate_embeddings_ts_onRequest],
    },
  {
      routePath: "/api/generate-image",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_generate_image_ts_onRequest],
    },
  {
      routePath: "/api/semantic-search",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_semantic_search_ts_onRequest],
    },
  {
      routePath: "/api/text-to-speech",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_text_to_speech_ts_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_ts_onRequest],
      modules: [],
    },
  ]