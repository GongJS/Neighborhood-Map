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
        status:ko.observable("OK"),
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
        status:ko.observable("OK"),
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
        status:ko.observable("OK"),
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
        status:ko.observable("OK"),
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
        status:ko.observable("OK"),
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

        this.inputData = ko.observable('');
        this.filterName = ko.computed(function(){
            var filter = self.inputData();

            for(var i=0;i<self.locationList().length;i++){
                //首先判断是否
                if(self.locationList()[i].name().includes(filter)===true){
                    self.locationList()[i].showView(true);
                    if(self.locationList()[i].marker !== undefined){
                        self.locationList()[i].marker.setVisible(true);
                    }
                }
                else{
                    self.locationList()[i].showView(false);
                    self.locationList()[i].marker.setVisible(false);
                }
            }
        });

        this.renderMarker = function(){
            var largeInfoWindow = new google.maps.InfoWindow();
            var bounds = new google.maps.LatLngBounds();
            var locations = model.locations;
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
            markers.push(marker);

            self.locationList()[i].marker = marker;

            marker.setMap(map);

            bounds.extend(marker.position);

            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfoWindow);
            });
        }
        //告诉地图融入这些边界
        map.fitBounds(bounds);
        function populateInfoWindow(marker,infowindow){
            if(infowindow.marker != marker){
            infowindow.marker = marker;
            
            infowindow.setContent('<div>'+marker.title+'</div>');
            infowindow.open(map,marker);
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });
        }}
    }
  }
};
//-----------------------------load FourSquare API--------------------------------
var clientid = ;
var clientsecret = ;
var redirecturi = ;
var remembercredentials = ;
var client = new FourSquareClient("<clientid>", "<clientsecret>", "<redirecturi>", "<remembercredentials>");
client.venuesClient.venues("<venue_id>", { 
    onSuccess: function(data) { 
    // do something with the response 
    // actual object data is inside: data.response
}, 
    onFailure: function(data) {
         // the request failed 
}
})
//------------------------------
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
    alert("Google maps API failed to load");
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
