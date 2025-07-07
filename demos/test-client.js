#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

class GeminiMCPTestClient {
  constructor() {
    this.mcpProcess = null;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async startMCPServer() {
    console.log('🚀 Starting Google Gemini CLI MCP Server...');
    
    this.mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ MCP Server started successfully!');
    return this.mcpProcess;
  }

  async sendMCPRequest(request) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      let responseData = '';
      
      const onData = (data) => {
        responseData += data.toString();
        try {
          const response = JSON.parse(responseData);
          clearTimeout(timeout);
          this.mcpProcess.stdout.off('data', onData);
          resolve(response);
        } catch (e) {
          // Continue collecting data if JSON is incomplete
        }
      };

      this.mcpProcess.stdout.on('data', onData);
      this.mcpProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async initialize() {
    console.log('🔧 Initializing MCP connection...');
    
    const initRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: "Gemini CLI Test Client",
          version: "1.0.0"
        }
      }
    };

    try {
      const response = await this.sendMCPRequest(initRequest);
      console.log('✅ MCP initialization successful:', response.result?.serverInfo?.name);
      return response;
    } catch (error) {
      console.error('❌ MCP initialization failed:', error.message);
      throw error;
    }
  }

  async listTools() {
    console.log('📋 Listing available tools...');
    
    const listRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    };

    try {
      const response = await this.sendMCPRequest(listRequest);
      if (response.result?.tools) {
        console.log('🔧 Available tools:');
        response.result.tools.forEach((tool, index) => {
          console.log(`  ${index + 1}. ${tool.name} - ${tool.description}`);
        });
        return response.result.tools;
      }
    } catch (error) {
      console.error('❌ Failed to list tools:', error.message);
      throw error;
    }
  }

  async callGemini(query, model = 'gemini-2.5-flash') {
    console.log(`🤖 Calling Gemini with query: "${query}"`);
    
    const toolRequest = {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "consult-gemini-cli",
        arguments: {
          query: query,
          model: model,
          task_type: "text"
        }
      }
    };

    try {
      const response = await this.sendMCPRequest(toolRequest);
      if (response.result?.content) {
        console.log('✅ Gemini Response:');
        response.result.content.forEach(content => {
          if (content.type === 'text') {
            console.log(content.text);
          }
        });
        return response.result;
      } else if (response.error) {
        console.error('❌ Gemini Error:', response.error.message);
        return response.error;
      }
    } catch (error) {
      console.error('❌ Failed to call Gemini:', error.message);
      throw error;
    }
  }

  async checkStatus() {
    console.log('📊 Checking CLI status...');
    
    const statusRequest = {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "cli-status",
        arguments: {}
      }
    };

    try {
      const response = await this.sendMCPRequest(statusRequest);
      if (response.result?.content) {
        console.log('📈 CLI Status:');
        response.result.content.forEach(content => {
          if (content.type === 'text') {
            console.log(content.text);
          }
        });
        return response.result;
      }
    } catch (error) {
      console.error('❌ Failed to check status:', error.message);
      throw error;
    }
  }

  async interactiveMode() {
    console.log('\n🎯 Entering interactive mode. Type "exit" to quit, "status" to check CLI status.');
    console.log('💡 Available models: gemini-2.5-pro, gemini-2.5-flash, gemini-exp-1206, veo-2, imagen-4, notebooklm-plus\n');

    const askQuestion = () => {
      this.rl.question('Enter your query (or "exit"/"status"): ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log('👋 Goodbye!');
          this.cleanup();
          return;
        }
        
        if (input.toLowerCase() === 'status') {
          await this.checkStatus();
          askQuestion();
          return;
        }

        if (input.trim()) {
          try {
            await this.callGemini(input);
          } catch (error) {
            console.error('❌ Error:', error.message);
          }
        }
        
        askQuestion();
      });
    };

    askQuestion();
  }

  async runTests() {
    try {
      // Start MCP server
      await this.startMCPServer();
      
      // Initialize connection
      await this.initialize();
      
      // List available tools
      await this.listTools();
      
      // Check CLI status
      await this.checkStatus();
      
      // Test a simple query
      console.log('\n🧪 Testing with a simple query...');
      await this.callGemini("Hello! Can you tell me what you are?", "gemini-2.5-flash");
      
      // Enter interactive mode
      await this.interactiveMode();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      this.cleanup();
    }
  }

  cleanup() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
    }
    this.rl.close();
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  process.exit(0);
});

// Run the test client
const client = new GeminiMCPTestClient();
client.runTests().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
