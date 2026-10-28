import pathlib
s=pathlib.Path('src')
h=(s/'index.template.html').read_text()
pp=(s/'pinyin-pro.min.js').read_text(); assert '</script' not in pp
h=h.replace('/*__PINYIN_PRO__*/','/* pinyin-pro (MIT) */\n'+pp).replace('/*__TEXTO_PRINCIPAL__*/',(s/'main-text.js').read_text()).replace('/*__CONTENT__*/',(s/'content-built.js').read_text()+'\n'+(s/'hash.js').read_text()+'\nconst BASE_HISTORY = '+(s/'base-history.json').read_text()+';\n')
pathlib.Path('index.html').write_text(h); print(len(h))
