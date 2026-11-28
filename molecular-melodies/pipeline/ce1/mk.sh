set -e
cd /home/claude/pt/ps
for o in p l; do d=mm_$o; mkdir -p $d; cp cfg_$o.js $d/cfg.js; cp cut.m4a $d/cut.m4a; cat head.html helpers.js ps1.js ps2.js ps3.js ps4.js > $d/reel.html; done
python3 - <<'P'
s=open('/home/claude/pt/ps/mm_p/reel.html').read()
js=s[s.index('<script>',s.index('<script src'))+8:s.rindex('</script>')]
open('/tmp/chk2.js','w').write('const document={getElementById:()=>({getContext:()=>({}),width:0})};const CFG={land:false,lines:[]};\n'+js)
P
node --check /tmp/chk2.js && echo SYNTAX_OK
