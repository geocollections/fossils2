var initMap = function (fs)
{
   var olMap = new ol.Map ({
    	target: "map",
    	layers: [

			new ol.layer.Tile({
			  source: new ol.source.XYZ({
				url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w'
			  })
			})
    	],
    	controls: ol.control.defaults({
			attributionOptions: ({
			  collapsible: true
			})
		}).extend([
			new ol.control.ScaleLine({units: "metric"}),
			new ol.control.FullScreen()
		]),
		view: new ol.View({
	        projection: "EPSG:3857",
	        center: ol.proj.transform([20.5, 58.5], 'EPSG:4326', 'EPSG:3857'),
	        zoom: 4,
	        maxZoom: 16,
	        minZoom: 4,
			restrictedExtent: ol.proj.transformExtent([-10, 52, 2, 62], 'EPSG:4326', 'EPSG:3857')
    	})
   });

	function defaultStyle(feature, resolution)
	{
		return [
			new ol.style.Style({
				image: new ol.style.Circle({
					radius: 5,
					fill: new ol.style.Fill({ color: 'rgba(236, 102, 37,0.7)', opacity: 0.9 }),
					//stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0)', width: 0})
				}),
				text: (resolution > 500 ? null : new ol.style.Text({
					font: '10pt Arial, Helvetica, Helvetica Neue, Arial, sans-serif',
					text: feature.name,
					fill: new ol.style.Fill({ color: 'rgba(238,59,13,1)' }),
					stroke: new ol.style.Stroke({color: '#fff', width: 3}),
					textAlign: 'left',
					textBaseline: 'bottom',
					offsetX: 5,
					offsetY: -5,
				}))
			})
		]
	};

  function customeStyle(feature, resolution)
  {
    return [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({ color: 'rgba(236, 102, 37,0.7)', opacity: 0.9 }),
          //stroke: new ol.style.Stroke({color: 'rgba(255,255,255,0)', width: 0})
        }),
        text: (resolution > 500 ? null : new ol.style.Text({
          font: '10pt Arial, Helvetica, Helvetica Neue, Arial, sans-serif',
          text: feature.name,
          fill: new ol.style.Fill({ color: 'rgba(238,59,13,1)' }),
          stroke: new ol.style.Stroke({color: '#fff', width: 3}),
          textAlign: 'left',
          textBaseline: 'bottom',
          offsetX: 5,
          offsetY: -5,
        }))
      })
    ]
  };

	var vectorSource = new ol.source.Vector({
		attributions: [new ol.Attribution({
        	html: " "})]
	});

	for (var i = 0; i < fs.length; i++){
		// console.log(fs[i].locid);
		var centroidLL = ol.proj.transform([Number(fs[i].long), Number(fs[i].lat)], 'EPSG:4326', 'EPSG:3857');
		var centroidPoint = new ol.geom.Point(centroidLL);
		var feature = new ol.Feature({ geometry: centroidPoint });
		feature.name = fs[i].locality;
		feature.fid = fs[i].locid;
    feature.hasLargerMarker = fs[i].isImportantLocality
		vectorSource.addFeature(feature);
	}

    var layerData = new ol.layer.Vector({
			title: "Localities",
			source: vectorSource,
			style: function(feature, resolution) {
			  return feature.hasLargerMarker ? customeStyle(feature, resolution) : defaultStyle(feature, resolution); }
    })

    olMap.addLayer(layerData);
    /*
    olMap.getViewport().addEventListener('mousemove', function(evt)
	{
		var pixel = olMap.getEventPixel(evt);
		displayFeatureInfo(pixel);
	});
*/

/*
    var extent = layerData.getSource().getExtent();
    olMap.getView().fit(extent, olMap.getSize());
    var zz = olMap.getView().getZoom();
    if(zz>9)
    {
		olMap.getView().setZoom(9);
	}
*/
    //olMap.on('click', function(evt) { displayFeatureInfo(evt.pixel); }); //Useful for touch-based viewing, e.g. on iPhone.
  olMap.on('click', function(evt) { openLoc(evt.pixel, olMap); });
}

var openLoc = function(pixel,olMap) {

  var feature = olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });

  if (feature)
  {
          	//window.location = '/locality/' + feature.fid;
          	window.open('http://geocollections.info/locality/' + feature.fid, '', 'width=750,height=750,scrollbars, resizable');
   }
   //else
   //{
   //       	document.getElementById('hoverbox').style.display = 'none';
   //}
};

//var highlight;
var displayFeatureInfo = function(pixel) {

  var feature = olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });

  if (feature)

  {
	//
        	document.getElementById('hoverbox').style.display = 'block';
        	//console.log(feature.name);
        	document.getElementById('hoversystem').innerHTML = feature.name;
        	document.getElementById('hoverstat').innerHTML = "";
   } else {
        	document.getElementById('hoverbox').style.display = 'none';
   }
};

//
// $(function(fs) {
//   initMap(fs);
// })

//
// var initLeaflatMap = function (fs)
// {
//     // L.Proj.transformation([20.5, 58.5], 'EPSG:4326', 'EPSG:3857')
//     console.log('initLeaflatMap')
//     var map = L.map('mapid').setView([38.63, -90.23], 12);
//     L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
//         {
//             attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
//             maxZoom: 17,
//             minZoom: 9
//         }).addTo(map);
//
//
// }
