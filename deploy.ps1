# Vanguard XI - Deployment Setup Script for Vercel
# Run this script to prepare your project for deployment
# Requires: Git to be installed (https://git-scm.com)

Write-Host "🚀 Vanguard XI - Deployment Setup" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Check if Git is installed
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git found: $gitVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Git not found! Install from: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Initialize Git repository if not exists
if (!(Test-Path .git)) {
    Write-Host "📍 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git config user.name "Vanguard Team"
    git config user.email "team@vanguard.local"
    Write-Host "✅ Git repository initialized`n" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Git repository already initialized`n" -ForegroundColor Blue
}

# Check .gitignore
if (!(Test-Path .gitignore)) {
    Write-Host "❌ .gitignore not found!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ .gitignore verified`n" -ForegroundColor Green

# Check node_modules
if (Test-Path node_modules) {
    Write-Host "ℹ️  node_modules exists, skipping npm install" -ForegroundColor Blue
} else {
    Write-Host "📍 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed`n" -ForegroundColor Green
}

# Test build
Write-Host "📍 Testing build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful`n" -ForegroundColor Green

# Create initial commit
Write-Host "📍 Creating initial commit..." -ForegroundColor Yellow
git add .
$commitCount = git rev-list --count HEAD 2>$null
if ([string]::IsNullOrEmpty($commitCount) -or $commitCount -eq 0) {
    git commit -m "Initial commit: Vanguard XI team management platform"
    Write-Host "✅ Initial commit created`n" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Commits already exist`n" -ForegroundColor Blue
}

# Display next steps
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ PROJECT READY FOR DEPLOYMENT" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`n📋 NEXT STEPS:`n" -ForegroundColor Yellow

Write-Host "1️⃣  Create GitHub Account (if not already done):" -ForegroundColor Cyan
Write-Host "   → https://github.com/signup`n"

Write-Host "2️⃣  Create GitHub Repository:" -ForegroundColor Cyan
Write-Host "   → Go to https://github.com/new" -ForegroundColor White
Write-Host "   → Repository name: 'Vanguardxi'" -ForegroundColor White
Write-Host "   → Description: 'Team management and match analysis platform'" -ForegroundColor White
Write-Host "   → Click 'Create repository'`n"

Write-Host "3️⃣  Connect Local Repository to GitHub:" -ForegroundColor Cyan
Write-Host "   → Run this command (replace YOUR_USERNAME):`n" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/Vanguardxi.git" -ForegroundColor Magenta
Write-Host "   git branch -M main" -ForegroundColor Magenta
Write-Host "   git push -u origin main`n" -ForegroundColor Magenta
Write-Host "   → When prompted for password, create a Personal Access Token:" -ForegroundColor White
Write-Host "     https://github.com/settings/tokens" -ForegroundColor White
Write-Host "     (Check 'repo' permission)`n"

Write-Host "4️⃣  Deploy to Vercel:" -ForegroundColor Cyan
Write-Host "   → Go to https://vercel.com/sign-up" -ForegroundColor White
Write-Host "   → Click 'Continue with GitHub'" -ForegroundColor White
Write-Host "   → Authorize Vercel" -ForegroundColor White
Write-Host "   → Click 'Import Git Repository'" -ForegroundColor White
Write-Host "   → Select 'Vanguardxi' repository" -ForegroundColor White
Write-Host "   → Review settings (all defaults OK)" -ForegroundColor White
Write-Host "   → Add Environment Variables:" -ForegroundColor White
Write-Host "     - NEXT_PUBLIC_SUPABASE_URL = [your Supabase URL]" -ForegroundColor White
Write-Host "     - NEXT_PUBLIC_SUPABASE_ANON_KEY = [your anon key]" -ForegroundColor White
Write-Host "     - NEXT_PUBLIC_USE_MOCK_AUTH = true" -ForegroundColor White
Write-Host "   → Click 'Deploy'`n"

Write-Host "5️⃣  Your App Will Be Live At:" -ForegroundColor Cyan
Write-Host "   → https://vanguardxi.vercel.app (or your custom domain)`n"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📚 Configuration Files Created:" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   ✓ vercel.json - Vercel configuration" -ForegroundColor Green
Write-Host "   ✓ .env.example - Environment variables template" -ForegroundColor Green
Write-Host "   ✓ Updated package.json with correct project info`n" -ForegroundColor Green

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "💡 HELPFUL COMMANDS:" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   npm run dev       - Start development server" -ForegroundColor White
Write-Host "   npm run build     - Build for production" -ForegroundColor White
Write-Host "   npm run start     - Start production server" -ForegroundColor White
Write-Host "   git status        - Check git status" -ForegroundColor White
Write-Host "   git log           - View commit history`n" -ForegroundColor White

Write-Host "✅ Setup complete! Ready to deploy? Follow steps 2-4 above." -ForegroundColor Green
