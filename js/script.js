//定义一个model存储程序中用到的数据
//--------------Model-----------------//
var markers = [
    //定义五个地点信息
    {
        name : 'tiananmen',
        address : '天安门',
        position: [116.39756, 39.908808],
        title:'Tiananmen'
    },
    {
        name : 'qianmen',
        address : '前门',
        position: [116.397994,39.900085],
        title:'Qianmen'
    },
    {
        name : 'tiantangongyuan',
        address : '天坛公园',
        position: [116.410886,39.881998],
        title:'Tiantangongyuan'
    },
    {
        name : 'yiheyuan',
        address : '颐和园',
        position: [116.272852,39.992273],
        title:'Yiheyuan'
    },
    {
        name : 'niaocao',
        address : '鸟槽',
        position: [116.396203,39.993575],
        title:'Niaocao'
    },
  ];




var ViewModel = function(){
    // 创建地图对象

}

ko.applyBindings(new ViewModel());

function init (){
var map = new AMap.Map('map', {
    center: [116.397428, 39.90923],
    zoom: 11
});
map.plugin(["AMap.ToolBar"], function() {
    // 添加 工具条
    map.addControl(new AMap.ToolBar());
});


var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
markers.forEach(function(marker) {
        	var newMarker = new AMap.Marker({
        		map: map,
        		position: [marker.position[0], marker.position[1]],
        		title: marker.title,
        		offset: new AMap.Pixel(-12,-36)
        	});
        	newMarker.content = '我是' + marker.title;
            // 为标记绑定 点击事件
        	newMarker.on('click', markerClick);
        });
        function markerClick(e) {
              	infoWindow.setContent(e.target.content);
              	infoWindow.open(map, e.target.getPosition());
              }
              // 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
     map.setFitView();
}
