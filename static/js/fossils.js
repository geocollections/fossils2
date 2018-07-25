var fossils = {
	init: function () {
		this.set_placeholder();
	},

	get_ajax: function (given) {
		given=given||{};
		$.ajax({
			url:'/ajax',
			data:given.data||{},
			dataType:'json',
			success: given.response.success||null,
			failure: given.response.failure||null,
		});
	},

	set_placeholder: function () {
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
			    input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
			    input.val(input.attr('placeholder'));
			}
		}).blur();
	}
}

fossils.search = {
	taxons: {},
	server_methods: {},
	is_field_populated: [],
	set_autofill: function (el, method) {
		el.addEventListener("keyup", function() {
			$(el).autocomplete({
				source: function( request, response ) {
					fossils.get_ajax({
						data:{
							action:	method||'get_taxon_by_keyword',
							keyword: el.value,
						},
						response:{
							success: function( data ) {
 								response( $.map( data, function( item ) {
									return {
										label: 	item.name,
										value: 	item.id,
									}
								}));
							},
							failure: function () {
								console.log('failure');
							},
						}
					})
				},
				select: function( event, ui ) {
					var method = fossils.search.server_methods[this.id];
					if(method == 'get_taxon_by_keyword') {
						window.location = '/'+ui.item.value;
						ui.item.value = '';
					} else {
						if (ui.item.value.length > 0) {
							var method=method||'get_taxon_by_keyword';
							if (-1 === fossils.search.is_field_populated.indexOf(method)) {
								fossils.search.is_field_populated.push(method);
							}
						}
					}
		        },
				minLength:3,
			})
		});

		//When request result is complex term then when user tries to delete part
		//of it then erase it alltogether so that user must re-initiate ajax request
		el.addEventListener('keyup', function(){
			var pos = fossils.search.is_field_populated
							.indexOf(fossils.search.server_methods[this.id]);
			if (-1 !== pos) {
				this.value='';
				fossils.search.is_field_populated
							.splice(pos,1);
			}
		});
	},

	set_form_values: function (form, values) {
		var sf = fossils.search.server_methods;
		var ids = Object.keys(sf);
		for (var term in values) {
			form[term].value = values[term];
			if(form[term].id.length > 0
				&& -1 !== ids.indexOf(form[term].id)
				&& -1 === fossils.search.is_field_populated.indexOf(term)
				&& values[term].length > 0) {
				fossils.search.is_field_populated
								.push(sf[ form[term].id ]);
			}
		}
	},

	display_message: function (given) {
		var msg_box = document.getElementById('msg-box-'+given.type);
		var out = [];
		for (var i=0;i<given.msg.length;i++)
			if('undefined' !== typeof fossils.messages[ given.msg[i] ])
				out.push('<p>'+fossils.messages[ given.msg[i] ]+'</p>');
		msg_box.innerHTML = out.join('');
		$(msg_box).fadeIn().delay(3000).fadeOut();
	},
}

var initMap = function (fs)
{
   var olMap = new ol.Map ({
    	target: "map",
    	layers: [
    		/*
    		new ol.layer.Tile({
				//source: new ol.source.Stamen({
				//layer: 'toner',
				//})
				source: new ol.source.OSM()
			}),*/

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



	var vectorSource = new ol.source.Vector({
		attributions: [new ol.Attribution({
        	html: " "})]
	});

	for (var i = 0; i < fs.length; i++){
		console.log(fs[i].locid);
		var centroidLL = ol.proj.transform([Number(fs[i].long), Number(fs[i].lat)], 'EPSG:4326', 'EPSG:3857');
		var centroidPoint = new ol.geom.Point(centroidLL);
		var feature = new ol.Feature({ geometry: centroidPoint });
		feature.name = fs[i].locality;
		feature.fid = fs[i].locid;
		vectorSource.addFeature(feature);
	}

    var layerData = new ol.layer.Vector({
			title: "Localities",
			source: vectorSource,
			style: function(feature, resolution) { return defaultStyle(feature, resolution); }
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
    olMap.on('click', function(evt) { openLoc(evt.pixel); });
}

var openLoc = function(pixel) {

  var feature = olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });

  if (feature)
  {
          	//window.location = '/locality/' + feature.fid;
          	window.open('http://geokogud.info/locality/' + feature.fid, '', 'width=750,height=750,scrollbars, resizable');
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
