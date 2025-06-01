#!/usr/bin/env node

/**
 * SMTP Setup Helper
 * 
 * This script helps set up SMTP configuration for the application.
 * It provides options for common email providers and adds their settings to .env file.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envFile = path.join(__dirname, '../../.env');

const smtpProviders = {
  ethereal: {
    name: 'Ethereal Email (Testing)',
    host: 'smtp.ethereal.email',
    port: '587',
    secure: 'false',
    instructions: 'Ethereal provides disposable test accounts. The script will create one for you.'
  },
  gmail: {
    name: 'Gmail',
    host: 'smtp.gmail.com',
    port: '587',
    secure: 'false',
    instructions: 'Use your Gmail account with an App Password: https://myaccount.google.com/apppasswords'
  },
  sendgrid: {
    name: 'SendGrid',
    host: 'smtp.sendgrid.net',
    port: '587',
    secure: 'false',
    instructions: 'Sign up at https://sendgrid.com and create an API key'
  },
  mailgun: {
    name: 'Mailgun',
    host: 'smtp.mailgun.org',
    port: '587',
    secure: 'false',
    instructions: 'Sign up at https://www.mailgun.com and get your SMTP credentials'
  },
  custom: {
    name: 'Custom SMTP Server',
    instructions: 'Enter your custom SMTP server details'
  }
};

console.log('===== SMTP Configuration Setup =====');
console.log('This script will help you configure SMTP settings for your application.\n');

// List all providers
console.log('Available SMTP providers:');
Object.keys(smtpProviders).forEach((key, index) => {
  console.log(`${index + 1}. ${smtpProviders[key].name}`);
});

const askProvider = () => {
  rl.question('\nSelect a provider (enter number): ', async (answer) => {
    const index = parseInt(answer) - 1;
    const providers = Object.keys(smtpProviders);
    
    if (index >= 0 && index < providers.length) {
      const provider = providers[index];
      const config = smtpProviders[provider];
      
      console.log(`\n${config.name} selected.`);
      console.log(`Instructions: ${config.instructions}\n`);
      
      if (provider === 'ethereal') {
        await setupEthereal();
      } else {
        await setupProvider(provider, config);
      }
    } else {
      console.log('Invalid selection. Please try again.');
      askProvider();
    }
  });
};

const setupEthereal = async () => {
  console.log('Creating an Ethereal Email test account...');
  
  try {
    // Check if nodemailer is installed
    const nodemailer = require('nodemailer');
    
    console.log('Generating test account...');
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('\nTest account created successfully!');
    console.log(`User: ${testAccount.user}`);
    console.log(`Password: ${testAccount.pass}`);
    
    updateEnvFile({
      SMTP_HOST: 'smtp.ethereal.email',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: testAccount.user,
      SMTP_PASSWORD: testAccount.pass,
      EMAIL_FROM: `"YourManagerAI" <${testAccount.user}>`
    });
    
    console.log('\nSMTP configuration has been updated in your .env file.');
    console.log('You can view test emails at https://ethereal.email (login with the credentials above)');
    rl.close();
    
  } catch (error) {
    console.error('Error creating Ethereal account:', error);
    console.log('Please try another provider or install nodemailer first: npm install nodemailer');
    askProvider();
  }
};

const setupProvider = async (provider, config) => {
  const settings = { ...config };
  delete settings.name;
  delete settings.instructions;
  
  if (provider === 'custom') {
    await askCustomSettings(settings);
  } else {
    await askCredentials(settings);
  }
};

const askCustomSettings = async (settings) => {
  rl.question('SMTP Host: ', (host) => {
    settings.host = host;
    
    rl.question('SMTP Port: ', (port) => {
      settings.port = port;
      
      rl.question('Secure (true/false): ', (secure) => {
        settings.secure = secure;
        
        askCredentials(settings);
      });
    });
  });
};

const askCredentials = async (settings) => {
  rl.question('SMTP Username: ', (user) => {
    settings.user = user;
    
    rl.question('SMTP Password: ', (pass) => {
      settings.pass = pass;
      
      rl.question('From Email Address: ', (from) => {
        updateEnvFile({
          SMTP_HOST: settings.host,
          SMTP_PORT: settings.port,
          SMTP_SECURE: settings.secure,
          SMTP_USER: settings.user,
          SMTP_PASSWORD: settings.pass,
          EMAIL_FROM: from
        });
        
        console.log('\nSMTP configuration has been updated in your .env file.');
        rl.close();
      });
    });
  });
};

const updateEnvFile = (settings) => {
  try {
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envFile)) {
      envContent = fs.readFileSync(envFile, 'utf8');
      
      // Update each setting
      Object.keys(settings).forEach(key => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(envContent)) {
          // Replace existing setting
          envContent = envContent.replace(regex, `${key}=${settings[key]}`);
        } else {
          // Add new setting
          envContent += `\n${key}=${settings[key]}`;
        }
      });
    } else {
      // Create new .env file
      Object.keys(settings).forEach(key => {
        envContent += `${key}=${settings[key]}\n`;
      });
    }
    
    // Write to file
    fs.writeFileSync(envFile, envContent);
    
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
};

// Start the process
askProvider(); 