# Portfolio assistant service

This Cloudflare Worker answers questions using the public portfolio information. GitHub Pages serves the website separately. No API key belongs in the website source.

## Cloudflare dashboard setup

1. Create a Worker named `wong-xiao-han-assistant`.
2. Replace its code with `worker.js` and deploy.
3. Add a **Workers AI** binding with the variable name **AI**.
4. Add a **Rate limiter** binding named **CHAT_RATE_LIMITER**, namespace identifier **2601102**, limit **8**, period **60 seconds**, then deploy the binding changes.
5. Check `/health` on the Worker URL. A configured service returns `{"ok":true}`.
6. Point the website's chat endpoint at the Worker's `/chat` URL.

The model is `@cf/meta/llama-3.1-8b-instruct-fp8`. Only browser requests from `https://xhmallo.github.io` are allowed by CORS. CORS is a browser control, not authentication; a non-browser caller can imitate that origin.

## Request limits

`POST /chat` accepts JSON with a `messages` array. Send at most 12 alternating user/assistant messages, ending with a user message. User messages may contain at most 1,200 characters; assistant messages at most 3,000. Combined conversation text is limited to 7,200 characters and the request body to 24,000 bytes. Responses use `{"reply":"..."}`; errors use `{"error":"..."}`.

The required `CHAT_RATE_LIMITER` binding in `wrangler.jsonc` permits approximately eight requests per minute per IP at each Cloudflare location. Choose a unique namespace identifier for the account if that identifier is already used. The service refuses model calls if either binding is missing or the rate limiter is unavailable.

The rate limit is approximate and is not a strict worldwide quota or spending cap. Review account usage before enabling a paid plan. No durable database or stored conversation history is used, and the Worker does not log conversation text.

## Maintenance

Keep `SYSTEM_PROMPT` in sync when the public portfolio changes. Do not add private contact information, private files, or unsupported achievements. The assistant's knowledge is the public portfolio, not visitor-provided claims.

Official references: [Workers AI bindings](https://developers.cloudflare.com/workers-ai/configuration/bindings/), [model](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/), [rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
