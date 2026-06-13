const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./apps/frontend/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    content = content.replace(/text-white/g, 'text-foreground');
    content = content.replace(/bg-white\/5/g, 'bg-card');
    content = content.replace(/bg-white\/10/g, 'bg-muted');
    content = content.replace(/border-white\/10/g, 'border-border');
    content = content.replace(/border-white\/20/g, 'border-border');
    content = content.replace(/bg-black\/40/g, 'bg-card border-r border-border');
    content = content.replace(/text-gray-400/g, 'text-muted-foreground');
    content = content.replace(/text-gray-500/g, 'text-muted-foreground');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log("Updated: " + file);
    }
});
