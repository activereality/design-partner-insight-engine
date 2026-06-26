---
name: signalforge-ai-extraction
description: Guidance for future SignalForge AI extraction and provider abstraction work.
---

# SignalForge AI Extraction

## When To Use

Use this skill when future work touches AI providers, mock extraction, insight schemas, prompt contracts, evidence mapping, or recommendation generation.

## Provider Abstraction

Design around a provider interface so the app can use a mock provider first, OpenAI later, and Anthropic or Gemini in the future. Keep provider-specific request/response code behind adapters.

Keep provider keys server-side only. Do not expose raw provider responses or provider-specific internal errors to the frontend.

## Mock Provider First

Start with deterministic synthetic outputs so demos, tests, and UI work do not require network access, API keys, or paid services.

## Schema And Versioning

Extraction output should have an explicit schema version. Model personas, user jobs, pain points, workarounds, urgency signals, buying triggers, feature hypotheses, risks, open questions, pilot success criteria, recommended experiments, and build now / learn more / ignore recommendations.

## Validation

Validate provider output before saving or displaying it. Treat malformed, missing, or unsupported schema versions as recoverable errors with clear messages.

Prefer explicit schemas, enums, and bounded text fields over loose `any` output handling.

## Evidence-First Outputs

Insights and recommendations must reference the source notes or evidence snippets they came from. Do not create ungrounded recommendations, fabricated quotes, or claims that are not supported by the input.

## Safety Boundaries

Use synthetic/demo data only. Do not send private Gitwit, Mechro, customer, interview, recruiter, secret, or API key material to any provider.

Avoid logging raw note contents, prompts, API keys, or full AI responses unless the data is clearly synthetic and the log is intentionally scoped for local debugging.
