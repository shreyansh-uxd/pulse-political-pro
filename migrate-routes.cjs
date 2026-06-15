const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/Uxdlab/Downloads/pulse-political-pro-main/pulse-political-pro-main/src';
const routesDir = path.join(srcDir, 'routes');

function walk(dir, callback) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function removeRouteBlock(content) {
  const index = content.indexOf('export const Route = createFileRoute(');
  if (index === -1) return { content, componentName: null, title: null };

  let braceCount = 0;
  let parenCount = 0;
  let i = index;
  let started = false;

  while (i < content.length) {
    const char = content[i];
    if (char === '(') parenCount++;
    else if (char === ')') parenCount--;
    else if (char === '{') {
      braceCount++;
      started = true;
    }
    else if (char === '}') braceCount--;

    i++;

    if (started && braceCount === 0 && parenCount === 0) {
      break;
    }
  }

  // Check if we also have a trailing semicolon or newline
  while (i < content.length && (content[i] === ';' || content[i] === '\n' || content[i] === '\r' || content[i] === ' ')) {
    i++;
  }

  const routeBlock = content.substring(index, i);
  
  // Extract component name from the block
  const componentMatch = /component:\s*([A-Za-z0-9_]+)/.exec(routeBlock);
  const componentName = componentMatch ? componentMatch[1] : null;

  // Extract title
  const titleMatch = /title:\s*['"]([^'"]+)['"]/.exec(routeBlock);
  const title = titleMatch ? titleMatch[1] : null;

  // Remove the block
  const newContent = content.substring(0, index) + content.substring(i);
  return { content: newContent, componentName, title };
}

walk(routesDir, filePath => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  if (filePath.includes('__root.tsx') || filePath.includes('route.tsx')) {
    console.log(`Skipping structural route file: ${filePath}`);
    return;
  }
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove @tanstack/react-router imports or createFileRoute
  content = content.replace(/import\s+\{[^}]*createFileRoute[^}]*\}\s+from\s+['"]@tanstack\/react-router['"];?\r?\n?/g, '');
  content = content.replace(/import\s+\{[^}]*\}\s+from\s+['"]@tanstack\/react-router['"];?\r?\n?/g, (match) => {
    return match.replace('@tanstack/react-router', 'react-router-dom');
  });

  // Also replace any direct @tanstack/react-router imports
  content = content.replace(/@tanstack\/react-router/g, 'react-router-dom');

  // 2. Parse and remove createFileRoute block
  const result = removeRouteBlock(content);
  content = result.content;
  const componentName = result.componentName;
  const titleStr = result.title;

  if (componentName) {
    // Add default export if not already exported
    if (!content.includes(`export default ${componentName}`)) {
      content += `\nexport default ${componentName};\n`;
    }

    // If we have a title, insert a useEffect to set the title
    if (titleStr) {
      const funcRegex = new RegExp(`(function|const)\\s+${componentName}\\b[^{]*\\{`, 'g');
      content = content.replace(funcRegex, (funcHeader) => {
        const effectStr = `\n  useEffect(() => {\n    document.title = "${titleStr}";\n  }, []);\n`;
        return funcHeader + effectStr;
      });

      // Prepend useEffect import
      content = `import { useEffect } from "react";\n` + content;
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Done!');
