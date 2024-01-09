  import './style.css'


  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  const overlay = new ol.Overlay({
    element: container,
  });

  const key = 'EoYo4y8mOEFasldeNEpr';

  const attribution = new ol.control.Attribution({
    collapsible: false,
  });

  const source = new ol.source.TileJSON({
    url: `https://api.maptiler.com/maps/openstreetmap/tiles.json?key=${key}`, // source URL
    tileSize: 512,
    crossOrigin: 'anonymous'
  });

  const map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: source
      })
    ],
    controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
    target: 'map',
    overlays: [overlay],
    view: new ol.View({
      constrainResolution: true,
      center: ol.proj.fromLonLat([92.904175, 56.018206]), // starting position [lng, lat]
      zoom: 12.3 // starting zoom
    })
  });

  const Branches = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://api.maptiler.com/data/eed7041e-7c78-4c44-851b-097cf83ad7d1/features.json?key=EoYo4y8mOEFasldeNEpr',
      format: new ol.format.GeoJSON(),
    }),
  })

  const Delivery = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'https://api.maptiler.com/data/840fa5b6-0eb3-471c-ba57-ef6e6b6deadc/features.json?key=EoYo4y8mOEFasldeNEpr',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 192, 126, 0.8)'
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 2
      })
    })
  })

  map.addLayer(Delivery)
  map.addLayer(Branches)


  map.on('click', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature, layer){
      if (layer == Delivery) {
        return feature;
      }
    });
    if (feature) {
      var popupContent = '<h3>' + feature.get('name') + '<h3>';
      popupContent += '<p> Минимальная сумма заказа: ' + feature.get('Минимальная сумма заказа') + '<p>';
      content.innerHTML = popupContent;
      const coordinate = evt.coordinate;
      overlay.setPosition(coordinate);
    }
  })

  closer.onclick = function () {
    overlay.setPosition(undefined);
  }