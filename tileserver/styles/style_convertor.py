import json

file_name = 'token_day_1.json'
token_file = 'token.json'
with open(file_name, 'r') as f:
    data = json.load(f)
with open(token_file, 'r') as f:
    token = json.load(f)
key_token = tuple(token.keys())
for layer in data['layers']:
    if layer.get('paint'):
        paint = layer.get('paint')

        for k, v in paint.items():
            if v in key_token:
                paint[k] = token[v]
converted_style_file = file_name.replace('token_','')
with open(converted_style_file, 'w') as f:
    f.write(json.dumps(data))
