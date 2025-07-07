#!/usr/bin/env node

const { GeminiCLIService } = require('./dist/services/gemini-cli.js');
const { GOOGLE_MODELS } = require('./dist/config/models.js');

async function quickDemo() {
  console.log('🚀 Google Gemini CLI MCP Server Demo');
  console.log('====================================\n');

  const service = new GeminiCLIService();

  // Check installation and auth
  const isInstalled = await service.testConnection();
  const isAuthenticated = await service.checkAuthentication();
  const quota = await service.getRemainingQuota();

  console.log('📊 System Status:');
  console.log(`   🔧 CLI Installed: ${isInstalled ? '✅' : '❌'}`);
  console.log(`   🔐 Authenticated: ${isAuthenticated ? '✅' : '❌'}`);
  console.log(`   📈 Quota: ${quota.requests}/min, ${quota.daily}/day`);
  console.log('');

  console.log('🤖 Available AI Models:');
  Object.entries(GOOGLE_MODELS).forEach(([name, config], index) => {
    const icon = {
      'text': '📝',
      'coding': '💻', 
      'creative': '🎨',
      'video': '🎬',
      'audio': '🔊',
      'reasoning': '🧠',
      'multimodal': '🎭'
    }[config.strength] || '🤖';
    
    console.log(`   ${icon} ${name} - ${config.description}`);
  });

  console.log('\n🎯 MCP Server Features:');
  console.log('   • consult-gemini-cli - Direct model consultation');
  console.log('   • smart-cli-route - Automatic model selection');
  console.log('   • cli-status - System status checks');

  console.log('\n💡 Example Usage:');
  console.log('   1. Start MCP server: npm start');
  console.log('   2. Connect via MCP client (Claude Desktop, Cline, etc.)');
  console.log('   3. Use tools to interact with Google AI models');

  if (isAuthenticated) {
    console.log('\n✅ Ready for AI requests!');
    console.log('   The server can now process requests through MCP clients.');
  } else {
    console.log('\n⚠️  Authentication needed for API calls.');
    console.log('   The CLI is installed but may need API key configuration.');
  }

  console.log('\n🆓 Cost: COMPLETELY FREE (1000 requests/day via CLI)');
  console.log('🌟 No API key fees - powered by Google Gemini CLI');
}

// Try a minimal API test if requested
async function testAPICall() {
  console.log('\n🧪 Testing API with minimal request...');
  
  const service = new GeminiCLIService();
  
  try {
    const result = await service.callModel(
      GOOGLE_MODELS['gemini-2.5-flash'],
      "Hi",
      0.1
    );
    console.log('✅ API Test Successful!');
    console.log(`📝 Response preview: ${result.substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log('❌ API Test Failed:', error.message);
    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.log('📊 Note: Quota error means authentication is working, just hit daily limit.');
      return true;
    }
    return false;
  }
}

async function main() {
  await quickDemo();
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\nTry a quick API test? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      await testAPICall();
    }
    
    console.log('\n🎉 Demo completed!');
    console.log('🔗 Ready to connect MCP clients to this server.');
    rl.close();
  });
}

if (require.main === module) {
  main().catch(console.error);
}
