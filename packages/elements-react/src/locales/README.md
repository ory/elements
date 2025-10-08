# Translation System Documentation

This directory contains the internationalization (i18n) locale files and a translation management script that uses Ollama to automatically translate content.

## Overview

The translation system works by:
1. Using `en.json` as the source of truth for all translations
2. Automatically detecting differences between `en.json` and other language files
3. Using Ollama with multilingual models to translate missing or new content
4. Maintaining consistency across all language files

## Prerequisites

Before using the translation script, ensure you have:

1. **Ollama installed**: Download from [ollama.ai](https://ollama.ai)
2. **Language model pulled**: Run `ollama pull qwen3:32b`
   - This model provides excellent multilingual support
   - Alternative models: `qwen2.5:32b` or `llama3.1:70b`
3. **Ollama running**: Start the Ollama service with `ollama serve`

## Directory Structure

```
locales/
├── script/
│   └── translate.js      # Translation automation script
├── en.json               # Source language (English) - source of truth
├── es.json               # Spanish translations
├── fr.json               # French translations
├── de.json               # German translations
├── [lang].json           # Other language files
└── README.md             # This file
```

## Using the Translation Script

The script is located at `script/translate.js` and provides several modes of operation:

### View Usage Information

```bash
cd script
node translate.js
```

### Update Existing Translations

When you add new keys to `en.json` or modify existing values, you can update all language files:

```bash
# Update ALL existing language files with missing keys
node translate.js --update

# Update a specific language file only
node translate.js --update fr    # Updates French only
node translate.js --update es    # Updates Spanish only
```

The script will:
- Compare each language file with `en.json`
- Identify missing keys
- Translate only the missing keys
- Merge them with existing translations
- Preserve the key order from `en.json`

### Add a New Language

To add support for a new language:

```bash
# Create a new language file
node translate.js --new pt    # Creates Portuguese (pt.json)
node translate.js --new nl    # Creates Dutch (nl.json)
```

The script will:
- Translate the entire `en.json` file to the target language
- Create a new `[language_code].json` file
- Preserve all placeholders and HTML tags
- Maintain the same structure as `en.json`

### Update All and Add New Languages

For a comprehensive update:

```bash
node translate.js --all
```

This will:
1. Update all existing language files with any missing keys
2. Prompt you to add new languages (optional)

## Workflow Examples

### Example 1: Adding New Features

1. Add new keys to `en.json`:
```json
{
  "existing.key": "Existing text",
  "new.feature.title": "New Feature",
  "new.feature.description": "This is a new feature"
}
```

2. Update all translations:
```bash
cd script
node translate.js --update
```

### Example 2: Supporting a New Language

1. Check available language codes in the script (ISO 639-1 codes)
2. Create the new language file:
```bash
cd script
node translate.js --new it    # Italian
```

### Example 3: Fixing a Single Language

If one language file is out of sync:
```bash
cd script
node translate.js --update de    # Update German only
```

## Important Notes

### Translation Quality

- The script uses AI translation which provides good baseline translations
- For production applications, consider having native speakers review translations
- Complex technical terms or brand-specific language may need manual adjustment

### Placeholders and HTML

The script automatically preserves:
- Placeholders: `{provider}`, `{contactSupportEmail}`, `{clientName}`, etc.
- Date formats: `{used_at, date, long}`
- HTML tags: `<a>`, `</a>`, `<strong>`, etc.

### Key Management

- **Never modify keys** in individual language files - only in `en.json`
- The script maintains key order based on `en.json`
- Extra keys in language files are removed during updates
- Missing keys are filled with translations

### Performance

- Translation takes time (10-60 seconds per language depending on content size)
- The script includes retry logic for failed translations
- A 1-second delay between languages prevents rate limiting

## Troubleshooting

### "Model not found" Error
```bash
ollama pull qwen3:32b
```

### "Connection refused" Error
```bash
ollama serve    # Start Ollama service
```

### Empty or Invalid Translations
- Try running the command again (script has 3 retry attempts)
- Check if Ollama has enough memory allocated
- Consider using a larger model

### Partial Translations
The script will:
- Warn about missing keys
- Add English fallbacks for any missing translations
- Log which keys used fallbacks

## Language Codes

The script supports all ISO 639-1 language codes. Common examples:

- `en` - English (source)
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `nl` - Dutch
- `ru` - Russian
- `ja` - Japanese
- `zh` - Chinese
- `ko` - Korean
- `ar` - Arabic

See the full list in `script/translate.js` in the `LANGUAGE_NAMES` object.

## Best Practices

1. **Always test after translation** - Verify UI layout with longer translations
2. **Review critical content** - Legal, medical, or financial content needs human review
3. **Keep `en.json` organized** - Group related keys together
4. **Use descriptive keys** - Makes translations more accurate
5. **Document context** - Add comments in code where keys are used
6. **Version control** - Commit translation updates separately for easy rollback

## Manual Translation

If you prefer manual translation or need to fix specific translations:

1. Edit the target language file directly
2. Ensure all keys from `en.json` are present
3. Preserve all placeholders and HTML tags
4. Maintain valid JSON format

The update script will skip keys that are already translated.

## Using Claude Code for Translations

As an alternative to the Ollama script, you can use Claude Code directly for translations. This provides more control and allows for interactive refinement of translations.

### Prompt Examples

#### 1. Update Existing Language with Missing Keys

```
Compare locales/en.json with locales/fr.json and translate any missing keys from English to French. Add the missing translations to fr.json while preserving existing translations. Keep all placeholders like {provider} and HTML tags exactly as they are.
```

#### 2. Create a New Language Translation

```
Create a new Portuguese translation file at locales/pt.json by translating all keys from locales/en.json. Preserve all placeholders (e.g., {clientName}, {contactSupportEmail}) and HTML tags. Maintain the exact same JSON structure and key order as en.json.
```

#### 3. Update Multiple Languages

```
Check all existing language files in the locales directory against en.json. For each language file, identify missing keys and translate them from English to the target language. Update each file with the missing translations.
```

#### 4. Translate Specific Keys

```
I've added these new keys to en.json:
- "feature.upload.title": "Upload Files"
- "feature.upload.description": "Drag and drop files here or click to browse"
- "feature.upload.success": "Successfully uploaded {count} files"

Please add translations for these keys to all existing language files in the locales directory.
```

#### 5. Review and Improve Translations

```
Review the Spanish translations in locales/es.json and improve them for better native fluency while maintaining technical accuracy. Focus especially on UI action labels and error messages.
```

#### 6. Fix Placeholder Issues

```
Check locales/de.json for any broken or modified placeholders compared to en.json. Fix any placeholders that were accidentally translated or modified. Placeholders should remain exactly as: {provider}, {clientName}, {used_at, date, long}, etc.
```

#### 7. Batch Operations with Specific Languages

```
Update the following language files with any missing keys from en.json:
- French (fr.json)
- German (de.json)
- Spanish (es.json)
- Italian (it.json)

Only translate the missing keys, preserve existing translations.
```

#### 8. Context-Aware Translation

```
Translate en.json to Japanese (ja.json). This is for a B2B SaaS application dealing with identity and access management. Use formal/business Japanese (敬語) for all UI text. Maintain technical terms that are commonly used in katakana.
```

#### 9. Validate Translation Completeness

```
Check all language files in the locales directory and create a report showing:
1. Which languages are missing keys compared to en.json
2. Which languages have extra keys not in en.json
3. Total translation coverage percentage for each language
```

#### 10. Regional Variants

```
Create a British English variant (en-GB.json) from en.json, adjusting spellings (organize→organise, color→colour) and terminology (elevator→lift, trash→bin) as appropriate for UK users.
```

### Tips for Using Claude Code

1. **Be specific about preservation rules** - Always mention preserving placeholders and HTML tags
2. **Specify the target language clearly** - Use both language name and code (e.g., "French (fr)")
3. **Provide context when needed** - Mention if it's for a specific industry or user base
4. **Request validation** - Ask Claude to verify all keys are present after translation
5. **Iterative refinement** - You can ask Claude to adjust specific translations after initial generation

### Advantages of Using Claude Code

- **Interactive feedback** - Refine translations in real-time
- **Context awareness** - Provide specific context about your application
- **Selective updates** - Translate only specific keys or sections
- **Quality review** - Ask for native speaker-level refinements
- **Custom requirements** - Handle special cases like regional variants or industry terminology
- **Immediate availability** - No need to set up Ollama or download models

### Example Workflow with Claude Code

1. **Initial setup**: "Show me what language files exist in the locales directory"
2. **Analysis**: "Compare en.json with all other language files and show which ones need updates"
3. **Translation**: "Update fr.json and de.json with the missing keys you found"
4. **Validation**: "Verify that all language files now have the same keys as en.json"
5. **Refinement**: "The French translation for 'dashboard.analytics.retention' seems too literal, can you make it more natural?"

This approach gives you full control over the translation process while leveraging Claude's language capabilities.

## Using Claude.ai or ChatGPT for Translation Review

You can also use web-based AI assistants like Claude.ai or ChatGPT to translate or review your locale files by attaching the JSON files directly. This is useful for quality assurance and getting detailed translation reports.

### How to Use

1. **Attach the files**: Upload `en.json` and the target language file(s) to the chat
2. **Use one of the prompts below**: Copy and paste the appropriate prompt
3. **Review the output**: The AI will provide a structured report for evaluation

### Translation Quality Review Prompt

```
I've attached two JSON locale files: en.json (English source) and [language].json (target translation). Please analyze the translation quality and provide a detailed report with the following structure:

## Translation Quality Report

### 1. Completeness Check
- Total keys in source (en.json): [number]
- Total keys in translation: [number]
- Missing keys: [list any missing keys]
- Extra keys: [list any extra keys not in source]
- Coverage percentage: [X%]

### 2. Technical Accuracy
Check and report on:
- Placeholder preservation: Are all {placeholders} kept exactly as in the source?
  - ✅ Correctly preserved: [count]
  - ❌ Modified/translated: [list specific keys where placeholders were changed]
- HTML tag preservation: Are all <tags> kept exactly as in the source?
  - ✅ Correctly preserved: [count]
  - ❌ Modified/broken: [list specific keys where HTML was changed]
- Date format preservation: Are formats like {date, date, long} preserved?
  - ✅ Correctly preserved: [count]
  - ❌ Issues found: [list specific problems]

### 3. Translation Quality Issues
Identify and categorize issues:

**Critical Issues** (must fix):
- Untranslated content (still in English): [list keys]
- Completely wrong translations: [list keys with explanation]
- Missing critical context: [list keys]

**Major Issues** (should fix):
- Awkward/unnatural phrasing: [list keys with suggested improvements]
- Inconsistent terminology: [list examples]
- Cultural inappropriateness: [list keys with explanation]

**Minor Issues** (nice to fix):
- Style inconsistencies: [list examples]
- Overly literal translations: [list keys with suggestions]
- Length issues (much longer/shorter than source): [list keys]

### 4. Consistency Analysis
- Are similar terms translated consistently? [Yes/No with examples]
- Are UI action words (buttons, links) consistently styled? [Yes/No with examples]
- Is the formality level consistent throughout? [Yes/No with examples]

### 5. Top 10 Improvements Needed
List the 10 most important changes in order of priority:
1. [key]: Current: "[current text]" → Suggested: "[improved text]" (Reason: [explanation])
2. ...

### 6. Overall Assessment
- Translation completeness: [X/10]
- Technical accuracy: [X/10]
- Language quality: [X/10]
- Cultural appropriateness: [X/10]
- **Overall score: [X/10]**
- **Production ready?: [Yes/No/Needs review]**

Please be specific with key names and provide examples for all issues found.
```

### Create New Translation Prompt

```
I've attached en.json which contains English UI text for a web application. Please create a complete translation to [TARGET LANGUAGE] with the following requirements:

1. **Output Format**: Provide the complete JSON file that I can save directly as [language-code].json

2. **Translation Rules**:
   - Translate ONLY the values (text after the colon), NEVER the keys
   - Preserve ALL placeholders exactly: {provider}, {clientName}, {count}, etc.
   - Preserve ALL HTML tags exactly: <a>, </a>, <strong>, etc.
   - Preserve ALL date formats exactly: {date, date, long}, {time, time, short}, etc.
   - Maintain the exact same structure and key order as the source

3. **Quality Requirements**:
   - Use native, natural phrasing (not literal translation)
   - Maintain consistent terminology throughout
   - Use appropriate formality level for a professional application
   - Consider UI space constraints (don't make translations significantly longer)

4. **After Translation Checklist**:
Please confirm:
- [ ] All [X] keys from en.json are present
- [ ] No keys were added or removed
- [ ] All placeholders remain unchanged
- [ ] All HTML tags remain unchanged
- [ ] Terminology is consistent
- [ ] Appropriate formality level is maintained

5. **Provide Summary**:
After the JSON output, provide:
- Any translation decisions that need review
- Terms that might need adjustment based on specific context
- Any keys where the translation might be too long for UI elements

Output the complete JSON file first, then the summary.
```

### Update Existing Translation Prompt

````
I've attached two files:
1. en.json - the current English source with all keys
2. [language].json - the existing [LANGUAGE] translation that needs updating

Please identify missing keys and provide translations for them:

## Analysis Required:

1. **Find Missing Keys**: Compare the files and list all keys present in en.json but missing from [language].json
2. **Provide Translations**: For each missing key, provide the translation in this format:
    
    ```json
    {
      "missing.key.1": "Translated text here",
      "missing.key.2": "Another translated text"
    }
    ```

3. **Integration Instructions**: Show exactly where each key should be placed to maintain the same order as en.json
4. **Quality Checks**:
- Ensure consistency with existing translation style
- Preserve all {placeholders} and <HTML tags>
- Match the formality level of existing translations

5. **Summary Report**:
- Number of missing keys found: [X]
- Any terminology inconsistencies noticed in existing translations
- Recommendations for improving overall translation consistency

Please provide the missing translations in a format I can easily copy and add to the existing file.
````

### Batch Language Review Prompt

```
I've attached en.json and multiple translation files ([language1].json, [language2].json, etc.). Please provide a comparative analysis:

## Multi-Language Translation Report

For each language file, provide:

### [Language Name] ([code].json)
- Coverage: [X%] ([X]/[total] keys translated)
- Missing keys: [count]
- Technical issues: [placeholders/HTML problems]
- Quality score: [X/10]
- Production ready: [Yes/No/Needs work]
- Most urgent fixes needed: [top 3]

### Comparative Analysis
- Most complete translation: [language]
- Highest quality translation: [language]
- Most consistent translations: [language]
- Languages needing immediate attention: [list]

### Common Issues Across Languages
- Keys frequently missing: [list]
- Common placeholder errors: [list]
- Consistency issues with terms: [list]

### Prioritized Action Plan
1. Critical fixes needed across all languages
2. Language-specific urgent updates
3. Quality improvements recommendations

Please focus on actionable insights that help prioritize translation updates.
```

### Tips for Best Results

1. **Attach files in order**: Always attach en.json first, then target language files
2. **Specify the language**: Always mention the full language name and code
3. **Be clear about the context**: Mention if it's for a specific type of application
4. **Request specific formats**: Ask for JSON output when you need ready-to-use translations
5. **Ask for examples**: Request specific examples of issues found

### Evaluating the AI's Response

A good translation review should:
- ✅ Identify all missing or extra keys
- ✅ Catch placeholder and HTML tag issues
- ✅ Point out unnatural or awkward translations
- ✅ Suggest specific improvements with examples
- ✅ Provide an overall quality assessment
- ✅ Give clear, actionable recommendations

### When to Use This Method

This approach is ideal for:
- **Quality assurance**: Before deploying new translations
- **Vendor validation**: Checking translations from external translators
- **Periodic reviews**: Regular quality checks of existing translations
- **Quick assessments**: Getting a fast overview of translation status
- **Comparative analysis**: Reviewing multiple languages at once
- **Documentation**: Creating translation quality reports for stakeholders