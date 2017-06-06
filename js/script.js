//定义一个model存储程序中用到的数据
//--------------Model-----------------//
var model = {
    //定义五个地点信息
    locations:[
    {
        name : 'water park',
        category:"park",
        address : '天津市南开区水上公园东路12号',
        location : {
            lat:39.08838,
            lng:117.16958
        },
        title:'水上公园'
    },
    {
        name : 'museum',
        category:"museum",
        address : '天津市河西区宾馆西路19号',
        location : {
            lat:39.08463,
            lng:117.20243000000005
        },
        title:'天津市博物馆'
    },
    {
        name : 'TJPU',
        category:"university",
        address : '天津市西青区宾水西道399号',
        location : {
            lat:39.131101838799914,
            lng:117.23467800000006
        },
        title:'天津工业大学'
    },
    {
        name : 'TJU',
        category:"university",
        address : '天津市南开区铭德道',
        location : {
            lat:39.11007502845973,
            lng:117.169189453125
        },
        title:'天津大学'
    },
    {
        name : 'people park',
        category:"park",
        address : '天津市河西区厦门路',
        location : {
            lat:39.10505,
            lng:117.21753999999999
        },
        title:'人民公园'
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
        this.renderMarker = ko.computed(function(){
            var largeInfoWindow = new google.maps.InfoWindow();
            var bounds = new google.maps.LatLngBounds();
            var locations = model.locations;
            //循环赋值
            for(var i=0;i<locations.length;i++){
                var position = locations[i].location;
                var name = locations[i].name;
                var title = locations[i].title;
                var picture = locations[i].picture;
                var marker = new google.maps.Marker({
                    map:map,
                    position:position,
                    title:title,
                    picture:picture,
                    animation:google.maps.Animation.DROP,
                    id:i
            });
            //将marker放进markers数组中
            markers.push(marker);

            self.locationList()[i].marker = marker;

            marker.setMap(map);

            bounds.extend(marker.position);
            //添加监听事件，是的marker被点击的时候，打开信息窗口，并包含wiki API
            marker.addListener('click', function(marker,largeInfoWindow){
                // Wikipedia API
                var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ position +'&format=json&callback=wikiCallback';

                $.ajax({
                url: wikiUrl,
                dataType: "jsonp"
                }).done(function(response){
                var article = response[1];
                var url = '<div>'+ '<a href ="'+ article +'" target="_blank">'+ title +'</a></div>';
                //给弹出的窗口设置内容
                largeInfoWindow.setContent(url);
                //打开内容窗口
                largeInfoWindow.open(map, marker);
                }).fail(function(){
                largeInfoWindow.setContent('<em><br>'+ "Wikipedia data isn't loading"+'</em>');
                largeInfoWindow.open(map, marker);
                });
            });
        }    
        //告诉地图融入这些边界
        map.fitBounds(bounds);
    });
}};
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
