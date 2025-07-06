```markdown
# 🎯 Praktische Beispiele

Dieser Guide zeigt Ihnen praktische Anwendungsfälle für den kostenlosen Google Gemini CLI MCP Server.

## Schnellstart-Beispiele

### Basis-Verwendung in Trae IDE

```

@Builder with MCP

Verwende "smart-cli-route" für: "Erkläre mir die Grundlagen von React Hooks"

```markdown

## 💻 Coding & Development

### React-Komponente erstellen

```

@Builder with MCP

Nutze "consult-gemini-cli" mit:

- model: "gemini-2.5-pro"
- task_type: "coding"
- query: "Erstelle eine React TypeScript Komponente für einen responsiven Navbar mit folgenden Features:
    - Logo links
    - Navigation-Links in der Mitte
    - User-Avatar rechts
    - Mobile Hamburger-Menü
    - Dark/Light Mode Toggle"

```markdown

### Code-Review und Optimierung

```

@Builder with MCP

Verwende "gemini-2.5-pro" über "consult-gemini-cli" für:
"Reviewe diesen Python Code und optimiere ihn:

```python
def find_duplicates(lst):
    duplicates = []
    for i in range(len(lst)):
        for j in range(i+1, len(lst)):
            if lst[i] == lst[j] and lst[i] not in duplicates:
                duplicates.append(lst[i])
    return duplicates

```

Fokus auf Performance und Lesbarkeit."

```markdown

### API-Design

```

@Builder with MCP

Smart-Route diese Anfrage: "Entwirf eine REST API für ein E-Commerce System mit Produkten, Bestellungen und Benutzern. Include OpenAPI Spezifikation."

```markdown

## 🧠 Reasoning & Analysis

### Komplexe Problemlösung

```

@Builder with MCP

Nutze "gemini-2.5-pro" mit task_type "reasoning" für:
"Analysiere das folgende Geschäftsproblem und entwickle eine Lösung:

Ein Software-Startup hat 50 Entwickler, aber die Code-Qualität sinkt bei schnellem Wachstum. Deployments dauern 3 Stunden, Bugs nehmen zu, und neue Features brauchen doppelt so lange wie geplant.

Entwickle eine systematische Lösung mit konkreten Schritten."

```markdown

### Technische Architektur-Entscheidungen

```

@Builder with MCP

Verwende "consult-gemini-cli" mit:

- model: "gemini-2.5-pro"
- context: "SaaS-Plattform, 100k aktive Nutzer, Team von 20 Entwicklern"
- query: "Soll ich von einer Monolith-Architektur zu Microservices wechseln? Analysiere Vor- und Nachteile für unseren spezifischen Fall."

```markdown

## 🎨 Kreative Aufgaben

### Content-Erstellung

```

@Builder with MCP

Nutze "gemini-2.5-flash" für creative tasks:
"Schreibe einen technischen Blog-Post über 'WebAssembly in der Praxis' für ein Developer-Publikum. Der Artikel soll:

- 1500 Wörter lang sein
- Praktische Beispiele enthalten
- Vor- und Nachteile aufzeigen
- Call-to-Action am Ende haben"

```markdown

### Marketing-Copy

```

@Builder with MCP

Smart-Route: "Erstelle eine Landing-Page Copy für ein neues Code-Editor Plugin. Zielgruppe: JavaScript-Entwickler. Features: AI-Autocomplete, Smart Refactoring, Bug Detection."

```markdown

## 📊 Datenanalyse & Algorithmen

### Algorithmus-Implementierung

```

@Builder with MCP

Verwende "gemini-2.5-pro" für:
"Implementiere den A* Pathfinding Algorithmus in JavaScript mit:

- Vollständiger Dokumentation
- Visualisierung auf HTML5 Canvas
- Optimierung für große Grids
- Unit Tests"

```markdown

### Datenstruktur-Erklärung

```

@Builder with MCP

Nutze "consult-gemini-cli" mit task_type "reasoning":
"Erkläre B-Trees ausführlich mit:

- Funktionsweise und Eigenschaften
- Insertion und Deletion Algorithmen
- Praktische Anwendungsfälle
- Vergleich mit anderen Tree-Strukturen
- Code-Beispiele in Python"

```markdown

## 🔧 DevOps & Infrastructure

### Docker-Setup

```

@Builder with MCP

Smart-Route: "Erstelle ein vollständiges Docker-Setup für eine Node.js + PostgreSQL Anwendung mit:

- Multi-stage Dockerfile
- docker-compose.yml
- Nginx Reverse Proxy
- SSL-Zertifikate
- Health Checks
- Development und Production Konfiguration"

```markdown

### CI/CD Pipeline

```

@Builder with MCP

Verwende "gemini-2.5-pro" für:
"Entwirf eine GitHub Actions CI/CD Pipeline für eine React + Node.js Anwendung:

- Automated Testing
- Code Quality Checks
- Security Scanning
- Deployment zu AWS
- Rollback-Strategie"

```markdown

## 🎬 Multimodale Aufgaben (in Entwicklung)

### Video-Konzept

```

@Builder with MCP

Nutze "consult-gemini-cli" mit model "veo-2":
"Erstelle ein Konzept für ein 8-Sekunden Erklärvideo über 'Wie funktioniert Git Branching':

- Visuelle Metaphern
- Schritt-für-Schritt Animation
- Farbschema und Stil
- Timing und Übergänge"

```markdown

### Bild-Design

```

@Builder with MCP

Verwende "imagen-4" über "consult-gemini-cli":
"Entwirf ein professionelles Header-Bild für eine Developer-Portfolio Website:

- Minimalistisch und modern
- Dunkles Farbschema
- Subtile Code-Elemente
- 1920x600 Pixel
- Hohe Qualität"

```markdown

## 🚀 Workflow-Optimierung

### Multi-Step Development

```

@Builder with MCP

# Schritt 1: Planung

```markdown
Verwende "gemini-2.5-pro" für: "Plane die Architektur für eine Chat-Anwendung mit WebSockets"
```

# Schritt 2: Implementation

```markdown
Dann nutze "gemini-2.5-pro": "Implementiere den WebSocket-Server basierend auf der Planung"
```

# Schritt 3: Testing

```markdown
Schließlich "gemini-2.5-flash": "Erstelle umfassende Tests für die Chat-Funktionalität"
```

```markdown

### Code-Generierung Pipeline

```

@Builder with MCP

# API-Design

```markdown
Smart-Route: "Entwirf REST API für Task-Management"
```

# Backend-Implementation

```markdown
Nutze "gemini-2.5-pro": "Implementiere Express.js Backend für die API"
```

# Frontend-Integration

```markdown
Verwende "gemini-2.5-flash": "Erstelle React Frontend für die API"
```

# Testing

Nutze "gemini-2.5-pro": "Schreibe E2E Tests mit Cypress"

```markdown

## 📈 Advanced Use Cases

### Performance-Optimierung

```

@Builder with MCP

Nutze "gemini-2.5-pro" mit context:
"
Context: React SPA mit 50+ Komponenten, Bundle-Größe 2MB, First Paint 4 Sekunden

Query: Entwickle eine systematische Performance-Optimierung Strategie mit konkreten Maßnahmen und erwarteten Verbesserungen.
"

```markdown

### Security-Audit

```

@Builder with MCP

Verwende "consult-gemini-cli" mit:

- model: "gemini-2.5-pro"
- task_type: "reasoning"
- query: "Führe ein Security-Audit für diese Node.js Express App durch und identifiziere potentielle Vulnerabilities:

[Code hier einfügen]

Fokus auf: Authentication, Input Validation, SQL Injection, XSS, CSRF"

```markdown

## 🎛️ CLI-Status Monitoring

### Quota-Überwachung

```

@Builder with MCP

# Aktuelles Kontingent prüfen

Nutze "cli-status" um zu sehen:

- Verbleibende Anfragen heute
- Anfragen pro Minute
- CLI-Authentifizierung Status
- Verfügbare Modelle

```markdown

### Performance-Tracking

```

@Builder with MCP

# Vor wichtigen Aufgaben

```markdown
Nutze "cli-status" für Quota-Check
```

# Nach Batch-Verarbeitung

```markdown
Erneut "cli-status" für verbrauchte Anfragen
```

```markdown

## 💡 Pro Tips für kostenlosen Zugang

### 1. Quota-Management

```

# ✅ Effizient

@Builder with MCP
Smart-Route: "Kurze, präzise Frage"

# ❌ Verschwenderisch

@Builder with MCP
Nutze "gemini-2.5-pro" für: "Sehr lange, wiederholende Frage mit viel unnötigem Text..."

```markdown

### 2. Modell-Auswahl Optimierung

- **Einfache Fragen**: `gemini-2.5-flash` (spart Quota)
- **Komplexe Analysen**: `gemini-2.5-pro` (bessere Qualität)
- **Unbekannt**: `smart-cli-route` (automatische Optimierung)

### 3. Batch-Verarbeitung

```

@Builder with MCP

# Kombiniere mehrere Fragen

Nutze "gemini-2.5-pro" für:
"Beantworte diese 3 Fragen in einer Antwort:

1. Wie funktioniert React useEffect?
2. Was ist der Unterschied zu useLayoutEffect?
3. Wann sollte ich welchen Hook verwenden?"

```markdown

### 4. Context-Wiederverwendung

```

@Builder with MCP

# Setze Context einmal

Verwende "consult-gemini-cli" mit:

- context: "React TypeScript Projekt, Material-UI, Redux Toolkit"
- query: "Erstelle Login-Komponente"

# Nutze gleichen Context für Follow-up

Verwende "consult-gemini-cli" mit:

- context: "React TypeScript Projekt, Material-UI, Redux Toolkit"
- query: "Erstelle Dashboard-Komponente"

```markdown

### 5. Tagesplanung

- **Morgens**: Komplexe Aufgaben mit `gemini-2.5-pro`
- **Mittags**: Standard-Aufgaben mit `smart-cli-route`
- **Abends**: Einfache Aufgaben mit `gemini-2.5-flash`

## 🔄 Troubleshooting-Beispiele

### CLI-Probleme diagnostizieren

```

@Builder with MCP

# Status prüfen

```markdown
Nutze "cli-status"
```

# Falls Probleme:

# 1. Terminal neu starten

# 2. Erneut authentifizieren: gemini auth login

# 3. CLI neu installieren: npm install -g @google/gemini-cli

```markdown

### Quota-Optimierung

```

@Builder with MCP

# Vor wichtigen Aufgaben

Nutze "cli-status" für aktuelles Kontingent

# Bei niedrigem Kontingent

```markdown
Verwende kürzere Prompts und "smart-cli-route"
```

```markdown

Diese Beispiele zeigen die Vielseitigkeit und das Einsparungspotential des kostenlosen Google Gemini CLI MCP Servers. Mit 1000 kostenlosen Anfragen pro Tag können Sie umfangreiche Entwicklungsaufgaben erledigen, ohne API-Kosten zu verursachen!

```