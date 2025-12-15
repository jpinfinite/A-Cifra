---
description: Workflow to create high-potential content for Google Discover with strict validation.
---
# Google Discover Article Creation Pipeline

This workflow defines the process for creating articles optimized for Google Discover, focusing on immediate interest, editorial authority, and retention.

## 1. Content Generation Strategy

**Goal**: Create an article that triggers curiosity, maintains retention, and fits passive monetization.

-   **Target File**: `src/content/articles/{slug}.json`
-   **Word Count**: 800 - 1,200 words (Strict minimum: 800).
-   **Structure**:
    -   **Title**: Strong, journalistic, sparks curiosity w/out clickbait. (e.g., "Why [topic] is back in the spotlight").
    -   **Introduction**: 2 short paragraphs. Contextualize immediately. Explain importance NOW. No fluff.
    -   **Body**: Clear explanatory blocks, concrete examples, brief historical context, practical impact. No excessive jargon.
    -   **Conclusion**: Reflective.
    -   **FAQ**: 3-5 real questions written in natural language.
-   **Monetization**:
    -   Structure text to allow ad insertion (Intro, Middle, End) effectively.
    -   Max 1 contextual affiliate link (neutral tone).

## 2. Image Generation Strategy

-   **Path**: `/images/articles/{slug}.webp`
-   **Specs**: 16:9 aspect ratio, >1200px width.
-   **Style**: Editorial/Journalistic. Natural look. Single visual focus. Clean/blurred background. usage of neutral colors.
-   **Restrictions**: NO text overlay, NO numbers, NO "ad-like" appearance.
-   **Alt Text**: "Imagem ilustrativa sobre [tema central]".

## 3. Validation: Discover Score

After generating content and image, you MUST evaluate it using this scorecard:

1.  **Title (0–20)**: Does it spark real curiosity?
2.  **Introduction (0–15)**: Does it hook the reader immediately?
3.  **Broad Interest (0–15)**: Is the topic widely appealing?
4.  **Editorial Quality (0–15)**: Does it feel like journalism, not sales?
5.  **Featured Image (0–15)**: Is it high-quality and mobile-friendly?
6.  **Potential Retention (0–10)**: Will people stay to read?
7.  **Invisible Monetization (0–10)**: Are ads/links natural?

**Total Score**: 0-100

### Decision Logic:
-   **< 80**: **FAIL**. Identify specific weaknesses, REWRITE those sections, and RE-EVALUATE.
-   **>= 80**: **PASS**. Proceed to save/publish.

## 4. Execution Steps

1.  **Draft Article**: Write the JSON content based on the inputs.
2.  **Create Image**: Generate the WebP image.
3.  **Self-Correction**: Apply the Discover Score. If score < 80, iterate immediately.
4.  **Finalize**: Save the validated file to `src/content/articles/`.
