#!/usr/bin/env node

const { GeminiCLIService } = require('./dist/services/gemini-cli.js');
const { GOOGLE_MODELS } = require('./dist/config/models.js');

async function testGeminiCLI() {
  console.log('🧪 Testing Google Gemini CLI Service');
  console.log('=====================================\n');

  const service = new GeminiCLIService();

  try {
    // Test 1: Check if CLI is installed
    console.log('1️⃣ Testing CLI installation...');
    const isInstalled = await service.testConnection();
    console.log(`   Result: ${isInstalled ? '✅ CLI installed' : '❌ CLI not found'}\n`);

    if (!isInstalled) {
      console.log('❌ Gemini CLI is not installed. Please run: npm install -g @google/gemini-cli');
      return;
    }

    // Test 2: Check authentication
    console.log('2️⃣ Testing CLI authentication...');
    const isAuthenticated = await service.checkAuthentication();
    console.log(`   Result: ${isAuthenticated ? '✅ CLI authenticated' : '❌ CLI not authenticated'}\n`);

    // Test 3: Check quota (even if authentication fails)
    console.log('3️⃣ Testing quota check...');
    const quota = await service.getRemainingQuota();
    console.log(`   Requests remaining: ${quota.requests}`);
    console.log(`   Daily limit: ${quota.daily}\n`);

    // Test 4: List available models
    console.log('4️⃣ Available models:');
    Object.entries(GOOGLE_MODELS).forEach(([name, config], index) => {
      console.log(`   ${index + 1}. ${name} - ${config.description}`);
    });
    console.log('');

    // Test 5: Try a simple API call with the smallest model
    if (isAuthenticated) {
      console.log('5️⃣ Testing API call with gemini-2.5-flash...');
      try {
        const modelConfig = GOOGLE_MODELS['gemini-2.5-flash'];
        const result = await service.callModel(
          modelConfig,
          "Hello! Please respond with just 'Hello World' and nothing else.",
          0.1,
          "You are a helpful assistant. Keep responses very short."
        );
        console.log('   ✅ API call successful!');
        console.log('   Response:', result.substring(0, 100) + (result.length > 100 ? '...' : ''));
      } catch (error) {
        console.log('   ❌ API call failed:', error.message);
        
        // Check if it's a quota error
        if (error.message.includes('quota') || error.message.includes('limit')) {
          console.log('   📊 This appears to be a quota limit error, which means authentication is working!');
        }
      }
    } else {
      console.log('5️⃣ ⚠️  Skipping API test due to authentication issues');
      console.log('   To authenticate, you may need to set up your API key.');
      console.log('   Check the Google AI Studio: https://aistudio.google.com/');
    }

    console.log('\n✅ Testing completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Test with different models
async function testDifferentModels() {
  console.log('\n🎯 Testing different model capabilities...');
  console.log('==========================================\n');

  const service = new GeminiCLIService();
  const testPrompt = "What is 2+2? Please answer with just the number.";

  const modelsToTest = ['gemini-2.5-flash', 'gemini-2.5-pro'];

  for (const modelName of modelsToTest) {
    if (GOOGLE_MODELS[modelName]) {
      console.log(`🤖 Testing ${modelName}...`);
      try {
        const result = await service.callModel(
          GOOGLE_MODELS[modelName],
          testPrompt,
          0.1
        );
        console.log(`   ✅ Success: ${result.substring(0, 50)}${result.length > 50 ? '...' : ''}`);
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message.substring(0, 100)}${error.message.length > 100 ? '...' : ''}`);
      }
      console.log('');
    }
  }
}

// Interactive test mode
async function interactiveTest() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const service = new GeminiCLIService();

  console.log('\n🎮 Interactive Test Mode');
  console.log('========================');
  console.log('Enter queries to test the Gemini CLI (type "exit" to quit):\n');

  const askQuestion = () => {
    rl.question('Your query: ', async (query) => {
      if (query.toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }

      if (query.trim()) {
        try {
          console.log('🤖 Calling Gemini...');
          const result = await service.callModel(
            GOOGLE_MODELS['gemini-2.5-flash'],
            query,
            0.7
          );
          console.log('✅ Response:');
          console.log(result);
          console.log('');
        } catch (error) {
          console.log('❌ Error:', error.message);
          console.log('');
        }
      }

      askQuestion();
    });
  };

  askQuestion();
}

// Main test runner
async function main() {
  await testGeminiCLI();
  
  // Ask if user wants to test different models
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\nWould you like to test different models? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await testDifferentModels();
    }

    rl.question('\nWould you like to enter interactive mode? (y/n): ', async (answer2) => {
      if (answer2.toLowerCase() === 'y' || answer2.toLowerCase() === 'yes') {
        rl.close();
        await interactiveTest();
      } else {
        console.log('\n🎉 All tests completed!');
        rl.close();
      }
    });
  });
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}
