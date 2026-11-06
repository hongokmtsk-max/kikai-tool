# Build index.html (GitHub Pages / PWA) from src/. Run: python3 build.py
t = open('src/tol.js', encoding='utf-8').read().replace("if(typeof module!=='undefined') module.exports={shaft,hole,fit,rangeOf,RANGES};", "")
u = open('src/ui.part.html', encoding='utf-8').read().replace('/*TOL*/', t)
head = '''<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#1f5f8b">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="機械ツール">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>
'''
sw = '''<script>if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}</script>
'''
# split ui into head part (title/meta/link/style) and body
i = u.index('<div class="wrap">')
open('index.html', 'w', encoding='utf-8').write(head + u[:i] + '</head>\n<body>\n' + u[i:] + sw + '</body>\n</html>\n')
# artifact preview copy (no head)
open('preview.html', 'w', encoding='utf-8').write(u)
print('built')
