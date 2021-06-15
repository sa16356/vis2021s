d3.csv("yourLab.csv", function(csvData){
    svg.selectAll("circle")
        .data(csvData)
        .enter()
        /**
         * 請同學參考副檔的 csv 檔案 
         * name,lat,lon 分別代表 名字, 緯度, 經度
         * 請同學以實驗室為單位，於 csv 檔案中標出實驗室成員的名字以及住家大概的經緯度
         * 
         * 
         * cx -> 圓心的 x 座標
         * myPrjection([d.lon, d.lat]) -> 回傳一個陣列 [ 投影的 x 座標, 投影的 y 座標 ]
         * return myPrjection([d.lon, d.lat])[0] -> 取得 x 座標回傳，當作是 circle 的 x 座標
         * 
         */
        .attr("cx", function(d){ return myPrjection([d.lon, d.lat])[0]; })
        /**
         * 接著請同學再利用 
         * cy , r ,fill 等 attribute 給定 y 座標、半徑、顏色...等
         * 完成畫點的操作
         */
        .attr( /** */);

    /**
     * 接著，要在點的旁邊標註是哪位同學的住家
     * 方法跟上面標點差不多，就只是改成 append text 而已
     */
     svg.selectAll("text")
            .data(csvData)
            .enter()
            //剩下跟上面差不多，請注意 text 的座標 attribute 為 x, y ，不是 cx, cy

})