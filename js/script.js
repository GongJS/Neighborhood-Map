//定义一个model存储程序中用到的数据
//--------------Model-----------------//
var model = {
    //定义五个地点信息
    locations:[
    {
        name : 'beijing',
        address : '北京市',
        location : {
            lat:39.91667,
            lng:116.41667
        },
        title:'Beijing'
    },
    {
        name : 'tianjin',
        address : '天津市',
        location : {
            lat:39.13333,
            lng:117.20000
        },
        title:'Tianjin'
    },
    {
        name : 'shanghai',
        address : '上海市',
        location : {
            lat:31.22,
            lng:121.48
        },
        title:'Shanghai'
    },
    {
        name : 'chengdu',
        address : '四川省成都市',
        location : {
            lat:30.66667,
            lng:104.06667
        },
        title:'Chengdu'
    },
    {
        name : 'nanjing',
        address : '江苏省南京市',
        location : {
            lat:32.05000,
            lng:118.78333
        },
        title:'Nanjing'
    }
    ]
};
//定义地图
var map;
//定义一个标记数组
var markers = [];
//------------------View---------------------//
var view = function(data){
    this.name = ko.observable(data.title);
    this.showView = ko.observable(true);
}
//-----------------ViewModel----------------//
var ViewModel = {
    init : function(){
        var self = this;

        this.locationList = ko.observableArray([]);
        model.locations.forEach(function(item){
            self.locationList.push(new view(item));
        });
        this.selectedLocation = function() {
            var marker = this.marker;
            google.maps.event.trigger(marker, 'click');
        };
        
        model.locations.forEach(function(locat) {
            var loc = new LOCATION(locat);
            markers.push(loc);
       });
        //监测输入的数据
        this.inputData = ko.observable('');
        //匹配地点
        this.filterName = ko.computed(function(){
            var filter = self.inputData();
            
            for(var i=0;i<self.locationList().length;i++){
                //首先判断locationlist是否包含所输入的内容
                if(self.locationList()[i].name().includes(filter)===true){
                    //如果包含，那么显示list
                    self.locationList()[i].showView(true);
                    if(self.locationList()[i].marker !== undefined){
                        //同时如果list存在，那么使标记也显示
                        self.locationList()[i].marker.setVisible(true);
                    }
                }
                else{
                    //否则不包含的话，那么就将list和marker都设置成不显示
                    self.locationList()[i].showView(false);
                    self.locationList()[i].marker.setVisible(false);
                }
            }
        });
        this.renderMarker = function(){
            var largeInfoWindow = new google.maps.InfoWindow();
            var bounds = new google.maps.LatLngBounds();
            var locations = model.locations;
            //循环赋值
            for(var i=0;i<locations.length;i++){
                var position = locations[i].location;
                var name = locations[i].name;
                var title = locations[i].title;
                var marker = new google.maps.Marker({
                    map:map,
                    position:position,
                    title:title,
                    animation:google.maps.Animation.DROP,
                    id:i
            });
            //将marker放进markers数组中
            markers.push(marker);

            self.locationList()[i].marker = marker;

            marker.setMap(map);

            bounds.extend(marker.position);
            //添加监听事件，是的marker被点击的时候，打开信息窗口，并包含wiki API
            marker.addListener('click', function(){
                populateInfowindow(this,largeInfoWindow)
            });
        }    
        //告诉地图融入这些边界
        map.fitBounds(bounds);
        //信息窗口函数
        function populateInfowindow(marker,infowindow){
        if(infowindow.marker != marker){
            infowindow.marker = marker;
            var content =  '<div class="title">' + marker.title + '</div>' 
                        + '<a title="+' + marker.wikiUrl + '" href="' + marker.wikiUrl + '">' + "Wikipedia" + '</a>';
            infowindow.setContent(content);
            //设置标记动画
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 700);
            infowindow.open(map,marker);
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });
        }}
    }
}};
//
function LOCATION(data) {
  this.name = data.name;
  this.location = data.location;
  this.marker = data.marker;
  this.url = data.url;

  var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" 
                + data.name + "&format=json&callback=wikiCallback";

  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    success: function(response) {
      var articleList = response[0][0];
      var url = articleList;
      data.wikiUrl = url;
    },
    error: function(error) {
      console.log("wikipedia has failed to loaded");
    }
  });
  //console.log(url);
}
//---------------------------VIEWMODEL--------------------------------
var viewmodel = new ViewModel.init();
ko.applyBindings(viewmodel);
//callback调用的函数
function initMap(){
   map = new google.maps.Map(document.getElementById('map-view'),{
        //设定地图显示的中心
        center:{
            lat:39.131101838799914,
            lng:117.23467800000006
        },
        //设置缩放值
        zoom:15,
        styles:styles
    });
    viewmodel.renderMarker();
}
//错误处理函数
function googleError(){
    alert("Google maps API has failed to load.Please check your internet connection and try again later");
}
// 此处使用的地图样式使用的是课程中老师使用的样式.
var styles = [
    {
        featureType: 'water',
        stylers: [
            { color: '#19a0d8' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [
            { color: '#ffffff' },
            { weight: 6 }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [
            { color: '#e85113' }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
            { color: '#efe9e4' },
            { lightness: -40 }
        ]
    },
    {
        featureType: 'transit.station',
        stylers: [
            { weight: 9 },
            { hue: '#e85113' }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [
            { visibility: 'off' }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
            { lightness: 100 }
        ]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            { lightness: -100 }
        ]
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
            { visibility: 'on' },
            { color: '#f0e4d3' }
        ]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
        ]
    }
];
