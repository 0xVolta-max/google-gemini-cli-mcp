```markdown
# 📚 API Dokumentation

## Überblick

Der Google Gemini CLI MCP Server stellt 3 Haupttools zur Verfügung, die kostenlosen Zugang zu Google AI Modellen über die Gemini CLI ermöglichen.

## Tools

### 1. consult-gemini-cli

**Beschreibung**: Konsultiert ein spezifisches Google AI Modell über die kostenlose Gemini CLI.

**Parameter**:

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|-----|--------------|--------------|
| `query` | string | ✅ | Die Anfrage für das Google AI Modell |
| `model` | enum | ✅ | Welches Google AI Modell verwendet werden soll |
| `context` | string | ❌ | Zusätzlicher Kontext |
| `temperature` | number | ❌ | Temperature-Wert (0.0-2.0, default: modell-spezifisch) |
| `task_type` | enum | ❌ | Art der Aufgabe zur Prompt-Optimierung |
| `system_instruction` | string | ❌ | Benutzerdefinierte System-Anweisung |

**Verfügbare Modelle** (`model`):
- `gemini-2.5-pro` - Fortgeschrittenes Reasoning
- `gemini-2.5-flash` - Optimale Performance
- `gemini-2.5-flash-lite` - Kosteneffizient
- `gemini-2.0-flash` - Next-Gen Features
- `gemini-1.5-pro` - Bewährte Stabilität
- `gemini-1.5-flash` - Vielseitige Performance
- `veo-2` - Videogenerierung (in Entwicklung)
- `imagen-4` - Bildgenerierung (in Entwicklung)

**Task Types** (`task_type`):
- `text` - Textgenerierung und -verarbeitung
- `coding` - Software-Entwicklung und Programmierung
- `creative` - Kreative Inhalte
- `video` - Videogenerierung
- `audio` - Audiogenerierung
- `reasoning` - Komplexe Analysen und Problemlösung
- `multimodal` - Multimodale Aufgaben

**Beispiel**:

```

```markdown
{
"tool": "consult-gemini-cli",
"parameters": {
"query": "Erkläre Machine Learning für Anfänger",
"model": "gemini-2.5-pro",
"task_type": "reasoning",
"temperature": 0.1
}
}
```

```markdown

**Response-Format**:

```

# 🆓 Google AI CLI Consultation (KOSTENLOS)

## 🤖 gemini-2.5-pro

[Modell-Antwort hier]

**📋 Modell-Details:**

- Gemini 2.5 Pro - Fortgeschrittenes Reasoning für komplexe Probleme
- 🎯 Stärke: reasoning
- 💚 Kosten: KOSTENLOS über CLI
- 📥 Input: text, images, video, audio, pdf
- 📤 Output: text
- 🌡️ Temperature: 0.1
- ⚡ Powered by Google Gemini CLI

📊 **Verbleibendes Kontingent:** 45/min, 856/Tag

```markdown

### 2. smart-cli-route

**Beschreibung**: Automatische Auswahl und Konsultation des optimalen Google AI Modells über die kostenlose CLI.

**Parameter**:

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|-----|--------------|--------------|
| `query` | string | ✅ | Die Anfrage zur Analyse und Weiterleitung |
| `context` | string | ❌ | Zusätzlicher Kontext |
| `force_model` | enum | ❌ | Erzwinge ein bestimmtes Modell |

**Routing-Logik**:

| Erkannte Keywords | Gewähltes Modell | Begründung |
|-------------------|------------------|------------|
| code, programming, debug | gemini-2.5-pro | Beste Coding-Performance |
| complex, analyze, strategy | gemini-2.5-pro | Fortgeschrittenes Reasoning |
| video, film, animation | veo-2 | Videogenerierung |
| image, photo, design | imagen-4 | Bildgenerierung |
| audio, speech, voice | gemini-tts | Audiogenerierung |
| text, write, explain | gemini-2.5-flash | Optimale Text-Performance |

**Beispiel**:

```

```markdown
{
"tool": "smart-cli-route",
"parameters": {
"query": "Entwickle eine React-Komponente für einen Datepicker",
"context": "TypeScript-Projekt mit Material-UI"
}
}
```

```markdown

**Response-Format**:

```

# 🎯 Smart CLI Routing (KOSTENLOS)

## 🤖 Routing-Analyse

- **Gewähltes Modell:** 🤖 gemini-2.5-pro
- **Begründung:** Coding-Aufgabe erkannt (3 Indikatoren) - Gemini Pro optimal
- **Task-Typ:** coding
- **Confidence:** ████████░░ 80%
- **💚 Kosten:** KOSTENLOS

## 🎭 AI Response

[Modell-Antwort hier]

**📊 CLI Status:**

- Gemini 2.5 Pro - Fortgeschrittenes Reasoning für komplexe Probleme
- Verbleibendes Kontingent: 44/min, 855/Tag
- ⚡ Powered by Google Gemini CLI

```markdown

### 3. cli-status

**Beschreibung**: Überprüft Gemini CLI Status und verbleibendes kostenloses Kontingent.

**Parameter**: Keine

**Response-Format**:

```

# 📊 Gemini CLI Status

## 🔧 Installation

✅ **Gemini CLI installiert**

## 🔐 Authentifizierung

✅ **Authentifiziert und bereit**

## 💚 Kostenloses Kontingent

- **Anfragen pro Minute:** 45/60
- **Anfragen pro Tag:** 855/1000
- **Kosten:** VÖLLIG KOSTENLOS 🎉

## 🤖 Verfügbare Modelle (alle kostenlos)

- 📝 **gemini-2.5-pro** - Fortgeschrittenes Reasoning für komplexe Probleme
- 📝 **gemini-2.5-flash** - Optimales Preis-Leistungs-Verhältnis mit Thinking
- 💻 **gemini-2.0-flash** - Next-Gen Features mit Tool-Use
- 🎬 **veo-2** - Hochqualitative Videogenerierung aus Text/Bild
- 🎨 **imagen-4** - Modernste Bildgenerierung

## 🎯 Nächste Schritte

✅ **Alles bereit!** Nutzen Sie die Tools für kostenlose AI-Anfragen.

```markdown

## Error Handling

### CLI-Fehler

| Fehlertyp | Beschreibung | Lösung |
|-----------|--------------|--------|
| `not found` | CLI nicht installiert | `npm install -g @google/gemini-cli` |
| `authentication` | Nicht authentifiziert | `gemini auth login` |
| `quota` | Tägliches Limit erreicht | Warten bis zum nächsten Tag |
| `ETIMEDOUT` | CLI-Timeout | Kürzere Anfrage verwenden |

### Beispiel-Fehlerantwort

```

# ❌ Google AI CLI Consultation Fehlgeschlagen

**Modell:** gemini-2.5-pro
**Fehler:** Tägliches Limit erreicht (1000 Anfragen/Tag). Versuchen Sie es morgen erneut.

## 💡 Mögliche Lösungen:

- Installieren Sie Gemini CLI: `npm install -g @google/gemini-cli`
- Authentifizieren Sie sich: `gemini auth login`
- Überprüfen Sie Ihr tägliches Limit (1000 Anfragen/Tag)
- Bei CLI-Problemen: Neustart des Terminals

```markdown

## Modell-Spezifikationen

### Gemini 2.5 Pro
- **Stärke**: Reasoning, komplexe Aufgaben
- **Max Tokens**: 1,048,576
- **Default Temperature**: 0.1
- **Besonderheiten**: 1M Token Kontextfenster, fortgeschrittenes Reasoning

### Gemini 2.5 Flash
- **Stärke**: Multimodal, ausgewogene Performance
- **Max Tokens**: 1,048,576
- **Default Temperature**: 0.2
- **Besonderheiten**: Optimales Preis-Leistungs-Verhältnis

### Veo 2 (in Entwicklung)
- **Stärke**: Videogenerierung
- **Max Tokens**: 8,192
- **Default Temperature**: 0.7
- **Besonderheiten**: 720p, 24fps, bis zu 8 Sekunden

### Imagen 4 (in Entwicklung)
- **Stärke**: Bildgenerierung
- **Max Tokens**: 4,096
- **Default Temperature**: 0.7
- **Besonderheiten**: Hochqualitative, professionelle Bilder

## Best Practices

### 1. Modell-Auswahl

- **Einfache Textaufgaben**: `gemini-2.5-flash`
- **Komplexe Analysen**: `gemini-2.5-pro`
- **Coding-Aufgaben**: `gemini-2.5-pro`
- **Kreative Aufgaben**: `gemini-2.5-flash`
- **Unbekannte Aufgaben**: `smart-cli-route` verwenden

### 2. Quota-Management

- **Monitoring**: Regelmäßig `cli-status` nutzen
- **Optimierung**: Kurze, präzise Prompts verwenden
- **Planung**: Wichtige Aufgaben am Tagesanfang erledigen

### 3. Prompt-Optimierung

```

```markdown
{
"context": "React TypeScript Projekt mit Material-UI",
"query": "Erstelle einen wiederverwendbaren Button-Component mit Props für Varianten"
}
```

```markdown

### 4. Error Recovery

```

# Bei CLI-Problemen

```markdown
gemini auth status
gemini auth login
```

# Bei Quota-Problemen

@Builder with MCP
Nutze "cli-status" für aktuelle Limits

```markdown

## Rate Limits

- **Kostenlose Limits**: 60 Anfragen/Minute, 1000 Anfragen/Tag
- **Reset**: Täglich um Mitternacht UTC
- **Monitoring**: Über `cli-status` Tool verfügbar

## CLI-Befehle

### Direkte CLI-Nutzung (optional)

```

# Einfache Anfrage

```markdown
gemini generate "Erkläre Machine Learning"
```

# Mit Modell-Spezifikation

gemini generate --model="gemini-2.5-pro" "Komplexe Analyse"

# Mit Temperature

```markdown
gemini generate --temperature=0.7 "Kreative Geschichte"
```

```markdown

### Status-Befehle

```

# Version prüfen

```markdown
gemini --version
```

# Authentifizierung prüfen

```markdown
gemini auth status
```

# Quota prüfen (falls verfügbar)

gemini quota

```

```