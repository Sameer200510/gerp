const fs = require('fs');
const path = require('path');

const sourceBase = path.join(__dirname, 'apps/frontend/src');
const targetBase = path.join(__dirname, 'uni_erp_clone/frontend/src/admission-portal');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function processContent(content) {
  // Remove "use client"
  content = content.replace(/"use client";?\n?/g, '');
  content = content.replace(/'use client';?\n?/g, '');
  
  // Replace next/link with react-router-dom
  content = content.replace(/import Link from ["']next\/link["']/g, 'import { Link } from "react-router-dom"');
  
  // Replace next/navigation with react-router-dom
  content = content.replace(/import { useRouter } from ["']next\/navigation["']/g, 'import { useNavigate as useRouter } from "react-router-dom"');
  
  // Remove basic TS types like (e: React.FormEvent) -> (e)
  content = content.replace(/\(e: React\.FormEvent\)/g, '(e)');
  content = content.replace(/\(e: any\)/g, '(e)');
  content = content.replace(/:\s*any/g, '');
  content = content.replace(/:\s*string/g, '');
  content = content.replace(/:\s*boolean/g, '');
  
  return content;
}

function copyAndConvert(srcFile, targetFile) {
  let content = fs.readFileSync(srcFile, 'utf8');
  content = processContent(content);
  ensureDir(path.dirname(targetFile));
  fs.writeFileSync(targetFile, content);
}

// 1. Pages
copyAndConvert(
  path.join(sourceBase, 'app/apply/page.tsx'),
  path.join(targetBase, 'applications/pages/ApplyPage.jsx')
);
copyAndConvert(
  path.join(sourceBase, 'app/status/page.tsx'),
  path.join(targetBase, 'applications/pages/StatusPage.jsx')
);
copyAndConvert(
  path.join(sourceBase, 'app/admin/applications/page.tsx'),
  path.join(targetBase, 'dashboard/pages/ManageApplications.jsx')
);
copyAndConvert(
  path.join(sourceBase, 'app/admin/applications/[id]/page.tsx'),
  path.join(targetBase, 'dashboard/pages/ApplicationDetail.jsx')
);
copyAndConvert(
  path.join(sourceBase, 'app/login/page.tsx'),
  path.join(targetBase, 'auth/pages/LoginPage.jsx')
);

// 2. Components
const componentsSrc = path.join(sourceBase, 'components/ui');
const componentsTarget = path.join(targetBase, 'components/ui');
if (fs.existsSync(componentsSrc)) {
  const files = fs.readdirSync(componentsSrc);
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const targetFile = file.replace('.tsx', '.jsx').replace('.ts', '.js');
      copyAndConvert(path.join(componentsSrc, file), path.join(componentsTarget, targetFile));
    }
  }
}

// 3. Utils
const utilsTarget = path.join(targetBase, 'utils');
ensureDir(utilsTarget);
let utilsContent = fs.readFileSync(path.join(sourceBase, 'lib/utils.ts'), 'utf8');
utilsContent = utilsContent.replace(/import { type ClassValue, clsx } from "clsx"/, 'import { clsx } from "clsx"');
fs.writeFileSync(path.join(utilsTarget, 'utils.js'), utilsContent);

// Fix component imports in pages
function fixComponentImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      fixComponentImports(fullPath);
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // @/components/ui/xxx -> ../../../components/ui/xxx (rough approximation, we'll just use absolute or relative)
      // Since Vite supports absolute aliases if configured, but let's make it relative to admission-portal
      // We will replace "@/components" with "../../components" or similar depending on depth.
      // For simplicity, let's just leave "@/components" and warn the user to set up Vite alias, OR rewrite it.
      // Let's rewrite it to be relative to the file.
      const depth = fullPath.split(path.sep).length - path.join(__dirname, 'uni_erp_clone/frontend/src/admission-portal').split(path.sep).length;
      const prefix = '../'.repeat(depth - 1) || './';
      content = content.replace(/@\/components/g, prefix + 'components');
      content = content.replace(/@\/lib\/utils/g, prefix + 'utils/utils');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixComponentImports(targetBase);

console.log("Migration complete.");
