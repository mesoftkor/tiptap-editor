#!/usr/bin/env node

/**
 * 릴리즈 스크립트
 * Git 태그 생성 및 커밋을 위한 헬퍼 스크립트
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`🚀 Creating release for v${version}...`);

try {
  // 모든 변경사항 추가
  console.log('📦 Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // 커밋
  console.log(`📝 Committing changes...`);
  execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' });

  // 태그 생성
  console.log(`🏷️  Creating tag v${version}...`);
  execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });

  // 푸시
  console.log('⬆️  Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  execSync('git push origin --tags', { stdio: 'inherit' });

  console.log(`\n✅ Successfully released v${version}!`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Go to https://github.com/mesoftkor/tiptap-editor/releases`);
  console.log(`   2. Click "Draft a new release"`);
  console.log(`   3. Select tag v${version}`);
  console.log(`   4. Copy changelog from CHANGELOG.md`);
  console.log(`   5. Publish the release`);
} catch (error) {
  console.error('❌ Release failed:', error.message);
  process.exit(1);
}

