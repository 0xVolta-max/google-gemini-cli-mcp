#!/usr/bin/env node

const { GeminiCLIService } = require('../dist/services/gemini-cli.js');
const { SmartRouter } = require('../dist/utils/routing.js');
const { GOOGLE_MODELS } = require('../dist/config/models.js');
const fs = require('fs').promises;
const path = require('path');

class NextJSCapabilitiesDemo {
  constructor() {
    this.service = new GeminiCLIService();
    this.demoQueries = [
      {
        category: "🏗️ Architecture & Setup",
        queries: [
          "How do I create a new Next.js 14 app with TypeScript and Tailwind CSS?",
          "What are the differences between App Router and Pages Router in Next.js?",
          "How do I set up environment variables in Next.js?",
          "What is the recommended folder structure for a large Next.js application?"
        ]
      },
      {
        category: "🎨 UI & Styling",
        queries: [
          "How do I implement responsive design with Tailwind CSS in Next.js?",
          "What are the best practices for CSS-in-JS with Next.js?",
          "How do I create a dark mode toggle in Next.js with Tailwind?",
          "How do I optimize fonts in Next.js 14?"
        ]
      },
      {
        category: "📊 Data Fetching",
        queries: [
          "What are the differences between getServerSideProps, getStaticProps, and the new App Router data fetching?",
          "How do I implement incremental static regeneration (ISR) in Next.js?",
          "How do I handle API routes and server actions in Next.js 14?",
          "What's the best way to handle form submissions in Next.js with Server Actions?"
        ]
      },
      {
        category: "⚡ Performance",
        queries: [
          "How do I optimize images in Next.js using the Image component?",
          "What are the best practices for code splitting in Next.js?",
          "How do I implement lazy loading and dynamic imports in Next.js?",
          "How do I optimize bundle size in Next.js?"
        ]
      },
      {
        category: "🔧 Advanced Features",
        queries: [
          "How do I implement middleware in Next.js for authentication?",
          "How do I set up internationalization (i18n) in Next.js?",
          "How do I create API routes with rate limiting in Next.js?",
          "How do I implement real-time features with WebSockets in Next.js?"
        ]
      },
      {
        category: "🚀 Deployment & Production",
        queries: [
          "What are the best practices for deploying Next.js to Vercel?",
          "How do I configure Next.js for deployment on AWS or other cloud providers?",
          "How do I implement proper error handling and logging in production Next.js?",
          "How do I set up monitoring and analytics for a Next.js app?"
        ]
      }
    ];
  }

  async demonstrateSmartRouting(query) {
    console.log(`\n🎯 Query: "${query}"`);
    console.log("─".repeat(80));

    try {
      // Use smart routing to analyze and route the query
      const routing = SmartRouter.analyzeAndRoute(query);
      const modelConfig = GOOGLE_MODELS[routing.selectedModel];

      console.log(`🤖 Smart Router Analysis:`);
      console.log(`   Selected Model: ${routing.selectedModel}`);
      console.log(`   Task Type: ${routing.taskType}`);
      console.log(`   Confidence: ${(routing.confidence * 100).toFixed(1)}%`);
      console.log(`   Reasoning: ${routing.reasoning}`);

      // Enhanced prompt for Next.js development
      const enhancedPrompt = `
As an expert Next.js developer, please provide a comprehensive answer about: ${query}

Please structure your response with:
1. **Quick Answer** - Brief summary
2. **Implementation** - Code examples if applicable
3. **Best Practices** - Industry recommendations
4. **Common Pitfalls** - What to avoid
5. **Resources** - Additional learning materials

Focus on Next.js 14+ features and current best practices.
`;

      console.log(`\n💬 Calling ${routing.selectedModel}...`);
      
      const result = await this.service.callModel(
        modelConfig,
        enhancedPrompt,
        modelConfig.defaultTemperature,
        "You are a senior Next.js developer and technical educator. Provide detailed, practical guidance with code examples."
      );

      console.log(`\n✅ Response from ${routing.selectedModel}:`);
      console.log("─".repeat(80));
      console.log(result);
      console.log("─".repeat(80));

      return {
        query,
        routing,
        response: result,
        model: routing.selectedModel
      };

    } catch (error) {
      console.error(`❌ Error processing query: ${error.message}`);
      
      // Handle quota errors gracefully
      if (error.message.includes('quota') || error.message.includes('limit')) {
        console.log('📊 Note: Hit daily quota limit. The smart routing system is working correctly!');
        return {
          query,
          routing: SmartRouter.analyzeAndRoute(query),
          response: "Quota limit reached - but smart routing analysis completed successfully!",
          model: "quota-limited"
        };
      }
      
      throw error;
    }
  }

  async runInteractiveDemo() {
    console.log('🚀 Next.js Capabilities Demo with Smart CLI Routing');
    console.log('====================================================\n');

    console.log('📊 System Status Check...');
    const isInstalled = await this.service.testConnection();
    const isAuthenticated = await this.service.checkAuthentication();
    const quota = await this.service.getRemainingQuota();

    console.log(`   🔧 CLI: ${isInstalled ? '✅' : '❌'}`);
    console.log(`   🔐 Auth: ${isAuthenticated ? '✅' : '❌'}`);
    console.log(`   📈 Quota: ${quota.requests}/min, ${quota.daily}/day\n`);

    console.log('🎯 Available Demo Categories:');
    this.demoQueries.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.category} (${category.queries.length} queries)`);
    });

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askCategoryChoice = () => {
      rl.question('\nSelect a category (1-6) or "custom" for your own query: ', async (choice) => {
        if (choice.toLowerCase() === 'custom') {
          rl.question('Enter your Next.js question: ', async (customQuery) => {
            await this.demonstrateSmartRouting(customQuery);
            askCategoryChoice();
          });
          return;
        }

        const categoryIndex = parseInt(choice) - 1;
        if (categoryIndex >= 0 && categoryIndex < this.demoQueries.length) {
          const category = this.demoQueries[categoryIndex];
          console.log(`\n${category.category}`);
          console.log('─'.repeat(50));
          
          category.queries.forEach((query, index) => {
            console.log(`   ${index + 1}. ${query}`);
          });

          rl.question(`\nSelect a question (1-${category.queries.length}) or "back": `, async (queryChoice) => {
            if (queryChoice.toLowerCase() === 'back') {
              askCategoryChoice();
              return;
            }

            const queryIndex = parseInt(queryChoice) - 1;
            if (queryIndex >= 0 && queryIndex < category.queries.length) {
              const selectedQuery = category.queries[queryIndex];
              await this.demonstrateSmartRouting(selectedQuery);
            }
            
            rl.question('\nContinue with another query? (y/n): ', (continueChoice) => {
              if (continueChoice.toLowerCase() === 'y') {
                askCategoryChoice();
              } else {
                console.log('\n🎉 Demo completed! Thank you for exploring Next.js with smart AI routing!');
                rl.close();
              }
            });
          });
        } else {
          console.log('❌ Invalid choice. Please select 1-6 or "custom".');
          askCategoryChoice();
        }
      });
    };

    askCategoryChoice();
  }

  async runAutomaticDemo() {
    console.log('🤖 Automatic Next.js Capabilities Demo');
    console.log('=======================================\n');

    const selectedQueries = [
      "How do I create a new Next.js 14 app with TypeScript and Tailwind CSS?",
      "What are the differences between App Router and Pages Router in Next.js?",
      "How do I implement responsive design with Tailwind CSS in Next.js?",
      "How do I optimize images in Next.js using the Image component?",
      "How do I implement middleware in Next.js for authentication?"
    ];

    console.log(`🎯 Running ${selectedQueries.length} demonstration queries...\n`);

    const results = [];
    
    for (let i = 0; i < selectedQueries.length; i++) {
      const query = selectedQueries[i];
      console.log(`\n📋 Demo ${i + 1}/${selectedQueries.length}`);
      
      try {
        const result = await this.demonstrateSmartRouting(query);
        results.push(result);
        
        // Small delay between queries
        if (i < selectedQueries.length - 1) {
          console.log('\n⏳ Waiting 2 seconds before next query...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ Failed on query ${i + 1}: ${error.message}`);
        break;
      }
    }

    console.log('\n📊 Demo Summary:');
    console.log('================');
    results.forEach((result, index) => {
      console.log(`${index + 1}. Model: ${result.model} | Task: ${result.routing?.taskType} | Query: ${result.query.substring(0, 60)}...`);
    });

    return results;
  }

  async generateDemoReport(results) {
    const report = `# Next.js Capabilities Demo Report

## Summary
- **Total Queries**: ${results.length}
- **Models Used**: ${[...new Set(results.map(r => r.model))].join(', ')}
- **Task Types**: ${[...new Set(results.map(r => r.routing?.taskType))].join(', ')}

## Results

${results.map((result, index) => `
### ${index + 1}. ${result.query}

**Model Selected**: ${result.model}
**Task Type**: ${result.routing?.taskType}
**Confidence**: ${result.routing ? (result.routing.confidence * 100).toFixed(1) : 'N/A'}%
**Reasoning**: ${result.routing?.reasoning || 'N/A'}

**Response**:
\`\`\`
${result.response.substring(0, 500)}${result.response.length > 500 ? '...' : ''}
\`\`\`

---
`).join('')}

Generated on: ${new Date().toISOString()}
`;

    await fs.writeFile('./nextjs-demo-report.md', report, 'utf-8');
    console.log('\n📄 Demo report saved to: ./nextjs-demo-report.md');
  }
}

async function main() {
  const demo = new NextJSCapabilitiesDemo();
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('🎯 Next.js Smart Routing Demo Options:');
  console.log('1. Interactive Demo (choose your questions)');
  console.log('2. Automatic Demo (predefined questions)');
  console.log('3. Quick Smart Routing Test');

  rl.question('\nSelect demo type (1-3): ', async (choice) => {
    rl.close();
    
    try {
      switch (choice) {
        case '1':
          await demo.runInteractiveDemo();
          break;
        case '2':
          const results = await demo.runAutomaticDemo();
          await demo.generateDemoReport(results);
          break;
        case '3':
          await demo.demonstrateSmartRouting("How do I optimize a Next.js app for production deployment?");
          break;
        default:
          console.log('❌ Invalid choice. Running quick test...');
          await demo.demonstrateSmartRouting("What are the key features of Next.js 14?");
      }
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  });
}

if (require.main === module) {
  main().catch(console.error);
}
