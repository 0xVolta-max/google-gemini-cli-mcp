```markdown
# 📥 Detaillierte Installationsanleitung

## Systemanforderungen

- **Node.js**: Version 18.0.0 oder höher
- **NPM**: Version 8.0.0 oder höher
- **Google-Konto**: Für CLI-Authentifizierung
- **MCP-Client**: Trae IDE, Cline oder andere MCP-kompatible Software
- **Betriebssystem**: Windows, macOS, Linux

## Schritt-für-Schritt Installation

### 1. Gemini CLI Setup

#### Installation der Gemini CLI

```

# Global installieren

```markdown
npm install -g @google/gemini-cli
```

# Version prüfen

```markdown
gemini --version
```

```

#### Authentifizierung

```

# Mit Google-Konto anmelden

```markdown
gemini auth login
```

# Status prüfen

gemini auth status

```markdown

**Wichtig:** Die Authentifizierung öffnet einen Browser und erfordert die Anmeldung mit Ihrem Google-Konto. Nach erfolgreicher Anmeldung erhalten Sie Zugang zu 1000 kostenlosen Anfragen pro Tag.

### 2. MCP Server Installation

#### Repository Setup

```

# Repository klonen

```markdown
git clone https://github.com/yourusername/google-gemini-cli-mcp.git
cd google-gemini-cli-mcp
```

# Dependencies installieren

```markdown
npm install
```

```markdown

#### Projekt builden

```

# TypeScript kompilieren

```markdown
npm run build
```

# Test ob alles funktioniert

```markdown
npm start
```

```markdown

Der Server sollte starten und folgende Ausgabe zeigen:

```

🚀 Google Gemini CLI MCP Server läuft
💚 VÖLLIG KOSTENLOS - 1000 Anfragen/Tag
🎯 Verfügbare Modelle: 12
⚡ Powered by Google Gemini CLI
✅ Gemini CLI bereit für kostenlose Anfragen!

```markdown

#### Global installieren (empfohlen)

```

# Global installieren für einfache Nutzung

```markdown
npm install -g .
```

# Testen

```markdown
google-gemini-cli-mcp --help
```

```markdown

### 3. IDE-Integration

#### Trae IDE

1. **Öffnen Sie Trae IDE**
2. **Gehen Sie zu Einstellungen**:
   - Klicken Sie auf das Zahnrad-Symbol
   - Wählen Sie "MCP"

3. **Neuen Server hinzufügen**:
   - Klicken Sie auf "+"
   - Wählen Sie "Manual Configuration"

4. **Konfiguration einfügen**:

```

```markdown
{
"name": "Google Gemini CLI (KOSTENLOS)",
"description": "Kostenloser Zugang zu Google AI - 1000 Anfragen/Tag",
"transport": "stdio",
"command": "google-gemini-cli-mcp",
"env": {}
}
```

```markdown

5. **Speichern und aktivieren**

#### Cline (VS Code Extension)

1. **Installieren Sie Cline** aus dem VS Code Marketplace
2. **Öffnen Sie VS Code Settings** (Ctrl/Cmd + ,)
3. **Suchen Sie nach "Cline MCP"**
4. **Fügen Sie Server-Konfiguration hinzu**:

```

```markdown
{
"mcpServers": {
"gemini-cli": {
"command": "google-gemini-cli-mcp",
"env": {}
}
}
}
```

```markdown

#### Cursor IDE

1. **Öffnen Sie Cursor Settings**
2. **Navigieren Sie zu Extensions > MCP**
3. **Fügen Sie neue Server-Konfiguration hinzu**:

```

```markdown
{
"name": "gemini-cli",
"command": ["google-gemini-cli-mcp"],
"env": {}
}
```

```markdown

### 4. Erste Schritte

#### CLI-Status prüfen

```

# In Ihrer IDE

@Builder with MCP

Nutze "cli-status" um Installation und Kontingent zu prüfen

```markdown

#### Erste Anfrage testen

```

# In Ihrer IDE

@Builder with MCP

Verwende "consult-gemini-cli" mit:

- model: "gemini-2.5-flash"
- query: "Hallo, kannst du mir bei der Programmierung helfen?"

```markdown

## Erweiterte Konfiguration

### Development Setup

```

# Development dependencies installieren

```markdown
npm install --save-dev
```

# Development Server starten (mit Hot Reload)

```markdown
npm run dev
```

# Code linting (falls konfiguriert)

```markdown
npm run lint
```

```markdown

### Docker Installation (optional)

```

```markdown
FROM node:18-alpine
```

# Gemini CLI installieren

```markdown
RUN npm install -g @google/gemini-cli
```

```markdown
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
```

```markdown
COPY dist/ ./dist/
```

```markdown
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

```

```

# Docker Image erstellen

```markdown
docker build -t google-gemini-cli-mcp .
```

# Container starten

docker run -it google-gemini-cli-mcp

```markdown

## Fehlerbehebung

### Installation schlägt fehl

**Problem**: `npm install -g @google/gemini-cli` schlägt fehl

```

# Node.js Version prüfen

```markdown
node --version  # Sollte >= 18.0.0 sein
```

# NPM Cache leeren

```markdown
npm cache clean --force
```

# Mit sudo versuchen (Linux/Mac)

```markdown
sudo npm install -g @google/gemini-cli
```

```markdown

### Authentifizierung schlägt fehl

**Problem**: `gemini auth login` funktioniert nicht
1. Überprüfen Sie Ihre Internetverbindung
2. Stellen Sie sicher, dass Ihr Browser JavaScript aktiviert hat
3. Versuchen Sie es mit einem anderen Browser
4. Prüfen Sie Firewall-Einstellungen

**Alternative Authentifizierung**:

```

# Manueller Auth-Token (falls verfügbar)

```markdown
gemini auth login --token=YOUR_TOKEN
```

```markdown

### CLI-Befehle funktionieren nicht

**Problem**: `gemini: command not found`

```

# Pfad prüfen

```markdown
echo $PATH
```

# NPM global bin Pfad prüfen

```markdown
npm config get prefix
```

# Pfad zur .bashrc/.zshrc hinzufügen

```markdown
export PATH=$PATH:$(npm config get prefix)/bin
```

```markdown

### MCP Connection Fehler

**Problem**: IDE kann nicht mit Server verbinden
1. Überprüfen Sie dass der Server läuft: `google-gemini-cli-mcp`
2. Prüfen Sie die Pfade in der IDE-Konfiguration
3. Stellen Sie sicher dass die Gemini CLI authentifiziert ist

### Quota-Probleme

**Problem**: "Tägliches Limit erreicht"
- **Lösung**: Warten Sie bis zum nächsten Tag (Reset um Mitternacht UTC)
- **Monitoring**: Nutzen Sie das `cli-status` Tool
- **Optimierung**: Verwenden Sie kürzere Prompts für mehr Anfragen

## Performance Optimierung

### Für bessere Performance:

1. **Modell-Auswahl optimieren**:

```

# Für einfache Aufgaben

```markdown
model: "gemini-2.5-flash"
```

# Für komplexe Analysen

```markdown
model: "gemini-2.5-pro"
```

```markdown

2. **Prompt-Länge reduzieren**:
- Verwenden Sie präzise, kurze Prompts
- Vermeiden Sie unnötige Wiederholungen
- Nutzen Sie Context nur wenn nötig

3. **Batch-Verarbeitung**:
- Kombinieren Sie mehrere Fragen in einer Anfrage
- Nutzen Sie Multi-Model Vergleich sparsam

## Monitoring & Logging

### Quota-Überwachung

```

# Aktuelles Kontingent prüfen

@Builder with MCP
Nutze "cli-status" für aktuelle Quota-Informationen

```

### Debug-Logs aktivieren

```

# Environment Variable setzen

```markdown
export DEBUG=true
```

# Server mit Debug-Modus starten

```markdown
google-gemini-cli-mcp
```

```markdown

### Log-Output umleiten

```

# Logs in Datei speichern

```markdown
google-gemini-cli-mcp 2> server.log
```

# Real-time Monitoring

```markdown
tail -f server.log
```

```markdown

## Nächste Schritte

Nach erfolgreicher Installation:

1. **Lesen Sie [docs/API.md](API.md)** für API-Details
2. **Schauen Sie sich [docs/EXAMPLES.md](EXAMPLES.md)** für Beispiele an
3. **Testen Sie die verschiedenen Tools** in Ihrer IDE
4. **Überwachen Sie Ihr Kontingent** mit `cli-status`

Bei weiteren Fragen erstellen Sie ein Issue im Repository oder kontaktieren Sie den Support.

```