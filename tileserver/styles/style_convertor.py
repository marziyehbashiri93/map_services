import json

file_name = 'token_day_1.json'
server_source_file = 'server_config.json'
token_file = 'token.json'
converted_style_file = file_name.replace('token_', '')
converted_to_server_style_file = file_name.replace('token_', 'server_')
with open(file_name, 'r') as f:
    data = json.load(f)
with open(server_source_file, 'r') as f:
    server_source = json.load(f)

with open(token_file, 'r') as f:
    token = json.load(f)

key_token = tuple(token.keys())
for layer in data['layers']:
    if layer.get('paint'):
        paint = layer.get('paint')

        for k, v in paint.items():
            if type(v) == list:
                new_arr = []
                for i in v:
                    if i in key_token:
                        new_arr.append(token[i])
                    else:
                        new_arr.append(i)
                paint[k] = new_arr
            elif type(v) != list and v in key_token:
                paint[k] = token[v]

with open(converted_style_file, 'w') as f:
    f.write(json.dumps(data))

data["sources"] = server_source["sources"]
data["sprite"] = server_source["sprite"]
data["glyphs"] = server_source["glyphs"]

with open(converted_to_server_style_file, 'w') as f:
    f.write(json.dumps(data))
from pathlib import Path
current_dir = Path.cwd()

js_file = '/home/bashiri/drive_f/git/viuna/map_services//site/index.js'
with open(js_file, 'w') as f:
    f.write("const theme=" + json.dumps(data))
