import requests, json, re
from pyquery import PyQuery as pq


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
}

r = requests.get('https://zh.wikipedia.org/wiki/%E8%87%BA%E7%81%A3%E8%A1%8C%E6%94%BF%E5%8D%80%E4%BA%BA%E5%8F%A3%E5%88%97%E8%A1%A8', headers=headers)

doc = pq(r.text)

cities = []

for i in doc('.wikitable').eq(0).find('tbody tr'):
    tds = doc(doc(i).find('td'))

    if len(tds.eq(1).text()):
        cities.append({
            'COUNTYNAME': tds.eq(1).text(),
            'COUNTYENG': tds.eq(2).text(),
            'COUNTYTYPE': tds.eq(3).text(),
            'COUNTYFLAG': 'https:%s' % (tds.eq(4).find('img').eq(0).attr('src')),
            'COUNTYAREA': tds.eq(5).text(),
            'COUNTYPUP': tds.eq(6).text(),
            'COUNTYGOVLOC': tds.eq(8).text()
        })    
        
with open('city-info.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(cities, ensure_ascii=False, indent=4))