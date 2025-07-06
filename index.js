#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const dotenv = __importStar(require("dotenv"));
const models_js_1 = require("./config/models.js");
const gemini_cli_js_1 = require("./services/gemini-cli.js");
const routing_js_1 = require("./utils/routing.js");
dotenv.config();
const geminiCLIService = new gemini_cli_js_1.GeminiCLIService();
const server = new mcp_js_1.McpServer({
    name: "Google Gemini CLI Expert Delegation Server",
    version: "1.0.0"
});
const availableModels = Object.keys(models_js_1.GOOGLE_MODELS);
server.tool("consult-gemini-cli", "Konsultiere Google AI Modelle über die kostenlose Gemini CLI", {
    query: zod_1.z.string().describe("Die Anfrage für das Google AI Modell"),
    model: zod_1.z.enum(availableModels).describe("Welches Google AI Modell verwendet werden soll"),
    context: zod_1.z.string().optional().describe("Zusätzlicher Kontext"),
    temperature: zod_1.z.number().min(0).max(2).optional().describe("Temperature-Wert (0.0-2.0)"),
    task_type: zod_1.z.enum(["text", "coding", "creative", "video", "audio", "reasoning", "multimodal"]).optional().describe("Art der Aufgabe"),
    system_instruction: zod_1.z.string().optional().describe("System-Anweisung für das Modell")
}, async ({ query, model, context, temperature, task_type = "text", system_instruction }) => {
    try {
        const modelConfig = models_js_1.GOOGLE_MODELS[model];
        if (!modelConfig) {
            throw new Error(`Unbekanntes Modell: ${model}`);
        }
        const systemPrompts = {
            text: "Du bist ein Experte für Textgenerierung. Liefere klare, strukturierte und hilfreiche Antworten.",
            coding: "Du bist ein Senior Software-Entwickler. Liefere sauberen, effizienten Code mit Best Practices.",
            creative: "Du bist ein kreativer Experte. Entwickle innovative und ansprechende Lösungen.",
            video: "Du bist ein Experte für Videoproduktion. Erstelle detaillierte Konzepte für Videos.",
            audio: "Du bist ein Experte für Audioproduktion. Erstelle natürliche Audioinhalte.",
            reasoning: "Du bist ein Experte für komplexe Analysen. Liefere durchdachte Lösungen.",
            multimodal: "Du bist ein Experte für multimodale AI-Anwendungen.",
            embedding: "Du bist ein Experte für semantische Analyse."
        };
        let finalPrompt = query;
        if (context) {
            finalPrompt = `**Kontext:**\n${context}\n\n**Aufgabe:**\n${query}`;
        }
        const systemInstr = system_instruction || systemPrompts[task_type];
        const result = await geminiCLIService.callModel(modelConfig, finalPrompt, temperature ?? modelConfig.defaultTemperature, systemInstr);
        if (!result) {
            throw new Error("Unerwartete CLI-Antwort: Kein Content erhalten");
        }
        const quota = await geminiCLIService.getRemainingQuota();
        const costIcon = "💚";
        const quotaInfo = `📊 **Verbleibendes Kontingent:** ${quota.requests}/min, ${quota.daily}/Tag`;
        return {
            content: [
                {
                    type: "text",
                    text: `# 🆓 Google AI CLI Consultation (KOSTENLOS)\n\n## 🤖 ${model}\n\n${result}\n\n---\n\n**📋 Modell-Details:**\n- *${modelConfig.description}*\n- *🎯 Stärke: ${modelConfig.strength}*\n- *${costIcon} Kosten: KOSTENLOS über CLI*\n- *📥 Input: ${modelConfig.inputTypes.join(", ")}*\n- *📤 Output: ${modelConfig.outputTypes.join(", ")}*\n- *🌡️ Temperature: ${temperature ?? modelConfig.defaultTemperature}*\n- *⚡ Powered by Google Gemini CLI*\n\n${quotaInfo}`
                }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `# ❌ Google AI CLI Consultation Fehlgeschlagen\n\n**Modell:** ${model}\n**Fehler:** ${error.message}\n\n## 💡 Mögliche Lösungen:\n- Installieren Sie Gemini CLI: \`npm install -g @google/gemini-cli\`\n- Authentifizieren Sie sich: \`gemini auth login\`\n- Überprüfen Sie Ihr tägliches Limit (1000 Anfragen/Tag)\n- Bei CLI-Problemen: Neustart des Terminals`
                }
            ],
            isError: true
        };
    }
});
server.tool("smart-cli-route", "Automatische Auswahl des optimalen Google AI Modells über kostenlose CLI", {
    query: zod_1.z.string().describe("Die Anfrage zur Analyse und Weiterleitung"),
    context: zod_1.z.string().optional().describe("Zusätzlicher Kontext"),
    force_model: zod_1.z.enum(availableModels).optional().describe("Erzwinge ein bestimmtes Modell")
}, async ({ query, context, force_model }) => {
    try {
        const routing = routing_js_1.SmartRouter.analyzeAndRoute(query, force_model);
        const modelConfig = models_js_1.GOOGLE_MODELS[routing.selectedModel];
        if (!modelConfig) {
            throw new Error(`Modell-Konfiguration für ${routing.selectedModel} nicht gefunden`);
        }
        let finalPrompt = query;
        if (context) {
            finalPrompt = `**Kontext:**\n${context}\n\n**Aufgabe:**\n${query}`;
        }
        const result = await geminiCLIService.callModel(modelConfig, finalPrompt, modelConfig.defaultTemperature, "Du bist ein AI-Experte, der detaillierte, präzise Analysen liefert.");
        if (!result) {
            throw new Error("Unerwartete CLI-Antwort: Kein Content erhalten");
        }
        const quota = await geminiCLIService.getRemainingQuota();
        const confidenceBar = "█".repeat(Math.floor(routing.confidence * 10)) +
            "░".repeat(10 - Math.floor(routing.confidence * 10));
        return {
            content: [
                {
                    type: "text",
                    text: `# 🎯 Smart CLI Routing (KOSTENLOS)\n\n## 🤖 Routing-Analyse\n- **Gewähltes Modell:** 🤖 ${routing.selectedModel}\n- **Begründung:** ${routing.reasoning}\n- **Task-Typ:** ${routing.taskType}\n- **Confidence:** ${confidenceBar} ${(routing.confidence * 100).toFixed(0)}%\n- **💚 Kosten:** KOSTENLOS\n\n## 🎭 AI Response\n\n${result}\n\n---\n\n**📊 CLI Status:**\n- *${modelConfig.description}*\n- *Verbleibendes Kontingent: ${quota.requests}/min, ${quota.daily}/Tag*\n- *⚡ Powered by Google Gemini CLI*`
                }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `# ❌ Smart CLI Routing Fehlgeschlagen\n\n**Fehler:** ${error.message}\n\nBitte überprüfen Sie Ihre CLI-Installation und Authentifizierung.`
                }
            ],
            isError: true
        };
    }
});
server.tool("cli-status", "Überprüfe Gemini CLI Status und verbleibendes kostenloses Kontingent", {}, async () => {
    try {
        const isInstalled = await geminiCLIService.testConnection();
        const isAuthenticated = await geminiCLIService.checkAuthentication();
        const quota = await geminiCLIService.getRemainingQuota();
        let statusText = "# 📊 Gemini CLI Status\n\n";
        statusText += `## 🔧 Installation\n`;
        statusText += isInstalled
            ? "✅ **Gemini CLI installiert**\n"
            : "❌ **Gemini CLI nicht installiert** - Führen Sie aus: `npm install -g @google/gemini-cli`\n";
        statusText += `\n## 🔐 Authentifizierung\n`;
        statusText += isAuthenticated
            ? "✅ **Authentifiziert und bereit**\n"
            : "❌ **Nicht authentifiziert** - Führen Sie aus: `gemini auth login`\n";
        statusText += `\n## 💚 Kostenloses Kontingent\n`;
        statusText += `- **Anfragen pro Minute:** ${quota.requests}/60\n`;
        statusText += `- **Anfragen pro Tag:** ${quota.daily}/1000\n`;
        statusText += `- **Kosten:** VÖLLIG KOSTENLOS 🎉\n`;
        statusText += `\n## 🤖 Verfügbare Modelle (alle kostenlos)\n`;
        for (const [modelName, config] of Object.entries(models_js_1.GOOGLE_MODELS)) {
            const strengthIcon = {
                text: "📝", coding: "💻", creative: "🎨", video: "🎬",
                audio: "🔊", reasoning: "🧠", multimodal: "🎭", embedding: "🔢"
            }[config.strength] || "🤖";
            statusText += `- ${strengthIcon} **${modelName}** - ${config.description}\n`;
        }
        statusText += `\n## 🎯 Nächste Schritte\n`;
        if (!isInstalled) {
            statusText += `1. Installieren: \`npm install -g @google/gemini-cli\`\n`;
        }
        if (!isAuthenticated) {
            statusText += `${isInstalled ? '1' : '2'}. Anmelden: \`gemini auth login\`\n`;
        }
        if (isInstalled && isAuthenticated) {
            statusText += `✅ **Alles bereit!** Nutzen Sie die Tools für kostenlose AI-Anfragen.\n`;
        }
        return {
            content: [
                {
                    type: "text",
                    text: statusText
                }
            ]
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `# ❌ CLI Status Check Fehlgeschlagen\n\n**Fehler:** ${error.message}\n\nMöglicherweise ist die Gemini CLI nicht korrekt installiert.`
                }
            ],
            isError: true
        };
    }
});
async function main() {
    try {
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        console.error("🚀 Google Gemini CLI MCP Server läuft");
        console.error("💚 VÖLLIG KOSTENLOS – 1000 Anfragen/Tag");
        console.error("🎯 Verfügbare Modelle:", Object.keys(models_js_1.GOOGLE_MODELS).length);
        console.error("⚡ Powered by Google Gemini CLI");
        const isInstalled = await geminiCLIService.testConnection();
        const isAuthenticated = await geminiCLIService.checkAuthentication();
        if (!isInstalled) {
            console.error("⚠️  Gemini CLI nicht installiert. Führen Sie aus: npm install -g @google/gemini-cli");
        }
        else if (!isAuthenticated) {
            console.error("⚠️  Gemini CLI nicht authentifiziert. Führen Sie aus: gemini auth login");
        }
        else {
            console.error("✅ Gemini CLI bereit für kostenlose Anfragen!");
        }
    }
    catch (error) {
        console.error("❌ Fehler beim Starten des Servers:", error);
        process.exit(1);
    }
}
main().catch(console.error);
//# sourceMappingURL=index.js.map