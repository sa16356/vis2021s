/**
 * 
 * @callback parseTopojsonCallback
 * @param {object} data - 一個包含地圖SVG的html節點
 * @returns 
 */

/**
 * 
 * @param {string} topojsonPath - topojson的路徑
 * @param {string} citiesInfoPath - citiesInfo的路徑
 * @param {parseTopojsonCallback} callback - 處理 topojson 的callback
 * @returns 
 */
function getMap(topojsonPath, citiesInfoPath, callback){ 

    //先載入城市相關資訊的object
    return d3.json(citiesInfoPath, function(citiesInfo){

        //儲存城市相關資訊的object
        var cityMap = {};
        return d3.json(topojsonPath, function(topojsonFile){

            
            /**
             * 利用topojson.feature函式處理topojson，轉成d3.js可以使用的geojson格式
             * topojson.feature的第二個參數必須給定原本.shp檔案的檔名，所以請同學再mapshaper轉換完topojson之後不要改檔名，使用預設的檔名才可以正確讀入資訊
             * */
            var features = topojson.feature(topojsonFile, topojsonFile.objects[topojsonPath.split('.')[0]]).features;

            //這個函式可以產生隨機的顏色
            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            }

            //svg的大小
            var height = 1000;
            var width = 1000;

            var node = document.createElement("div");
    
            var svg = d3.select(node)
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('viewBox', '0 0 ' + width + ' ' + height)
                        
    
            /**
             * 設定麥卡托投影
             * 設定縮放係數為12000倍
             * 設定中央位置在x=121, y=25的位置，越往右邊則x值越小，越往下則y值越大，同學可以自行尋找最優的參數
             */
            var myPrjection = d3.geoMercator()
                                .scale(12000)
                                .center([121, 25]);
                                
            /**
             * 這邊會依照縮放的參數計算svg的path參數
             * d3.geoPath().projection會回傳一個function，將geojson的feature值丟入myPath中以計算svg的path
             */
            var myPath = d3.geoPath()
                           .projection(myPrjection);
    
            
            svg.selectAll("path")
                .data(features)
                .enter()
                .append('path')
                .attr('d', function(d){return myPath(d)})
                //設定地圖的預設顏色為BASE_COLOR
                .attr('fill', BASE_COLOR)              
                //設定透明度、邊界顏色、邊界線條粗細、游標、動畫效果...等                
                .style('opacity', '0.8')
                .style('stroke', '#FFF')
                .style('stroke-width', '2px')
                .style('cursor', 'pointer')
                .style('transition', 'fill .5s ease, stroke .5s ease, transform .5s ease')
                //設定滑鼠移動至縣市區塊的效果
                .on('mouseover', function(d){
                    
                    //將上方的文字改成縣市名稱
                    d3.select('#city-title').text(d.properties.COUNTYNAME);

                    //cityMap中若沒有紀錄該縣市的詳細資料，則從citiesInfo取得資料置入cityMap
                    if(typeof cityMap[d.properties.COUNTYNAME] == 'undefined'){
                        citiesInfo.find(function(target){
                            if(target.COUNTYNAME == d.properties.COUNTYNAME){
                                cityMap[d.properties.COUNTYNAME] = {};
                                for(var i in target){
                                    if(i != 'COUNTYNAME'){
                                        cityMap[d.properties.COUNTYNAME][i] = target[i];
                                    }
                                }
                            }
                        });
                    }

                    /**
                     * 滑鼠移至該縣市後，該區塊會向上浮起5px
                     * 透明度會變成不透明
                     * 並塗上一個隨機的顏色
                     */
                    d3.select(this)
                        .style('transform', 'translateY(-5px)')
                        .style('opacity', 1)
                        //如果同學想要使用固定的顏色也可以直接給定一個顏色
                        .style('fill', getRandomColor());

                    //依照目前游標的位置設定提示框出現的位置
                    d3.select('#info-box')
                        .style('top', d3.event.pageY)
                        .style('left', d3.event.pageX)
                        .style('display', 'flex');
                    
                    d3.select('#info-box')
                        .html('')
                        .text(d.properties.COUNTYENG)
                        .append('img')
                        .attr('src', cityMap[d.properties.COUNTYNAME].COUNTYFLAG);
                    
                    //設定右側縣市詳細資訊
                    d3.select('#country-name').text(d.properties.COUNTYNAME);
                    d3.select('#country-eng').text(cityMap[d.properties.COUNTYNAME].COUNTYENG);
                    d3.select('#country-govloc').text(cityMap[d.properties.COUNTYNAME].COUNTYGOVLOC);
                    d3.select('#country-pup').text(cityMap[d.properties.COUNTYNAME].COUNTYPUP);
                    d3.select('#country-type').text(cityMap[d.properties.COUNTYNAME].COUNTYTYPE);
                    d3.select('#country-area').text(cityMap[d.properties.COUNTYNAME].COUNTYAREA);

                    d3.select('#country-flag')
                        .append('img')
                        .attr('src', cityMap[d.properties.COUNTYNAME].COUNTYFLAG.replace(/[0-9]+px/, '200px'));

                })
                //當游標離開該縣市區域，則清空資料
                .on('mouseleave', function(d){
                    d3.select('#city-title').text('台灣');

                    d3.select(this)
                        .style('transform', 'translateY(0)')
                        .style('opacity', 0.8)
                        .style('fill', BASE_COLOR);

                    d3.select('#info-box')
                        .style('display', 'none');
                    document.getElementById('info-box').innerHTML = '';

                    d3.select('#country-name').text('台灣');
                    d3.select('#country-eng').text('');
                    d3.select('#country-govloc').text('');
                    d3.select('#country-pup').text('');
                    d3.select('#country-type').text('');
                    d3.select('#country-area').text('');

                    d3.select('#country-flag').html('');
                });


            /**
             * 請在以下加入畫點的功能
             * 畫點的教學可以參考附件中的 "如何畫點.js"
             */



            /**
             * 請在以上加入畫點的功能
             */
            
            return callback(node);
        });
    })
};