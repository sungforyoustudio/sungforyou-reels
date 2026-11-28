set -e
cd /home/claude/pt/me
for o in p l; do d=mm_$o; mkdir -p $d; cp cfg_$o.js $d/cfg.js; cp cut.m4a $d/cut.m4a; cat head.html helpers.js scene.js scene2.js > $d/reel.html; done
sed -i 's/const CW=58/const CW=58/' mm_p/reel.html
