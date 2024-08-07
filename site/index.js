const theme ={
  "id": "day_1",
  "name": "day_1",
  "draft": false,
  "owner": "viuna",
  "glyphs": "http://5.201.178.229:9090/fonts/{fontstack}/{range}.pbf",
  "version": 8.0,
  "modified": 0.0,
  "created": 0.0,
  "transition": {
    "delay": 300.0,
    "duration": 300.0
  },
  "sprite": "http://5.201.178.229:9090/styles/day_1/sprite",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "#F5F5F2"
      }
    },
    {
      "id": "cities-fill",
      "type": "fill",
      "paint": {
        "fill-color": "#EFEFEA"
      },
      "filter": [
        "==",
        [
          "get",
          "place_level"
        ],
        "city"
      ],
      "source": "static_admin_division",
      "maxzoom": 22.1,
      "minzoom": 1.0,
      "source-layer": "admin_divisions_polygon"
    },
    {
      "id": "landuse-green-1",
      "type": "fill",
      "paint": {
        "fill-color": "#bae5ce",
        "fill-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          4.0,
          0.3,
          4.5,
          1.0
        ]
      },
      "filter": [
        "in",
        [
          "get",
          "landuse_type"
        ],
        [
          "literal",
          [
            "wood",
            "forest",
            "resevior"
          ]
        ]
      ],
      "source": "static_landuse",
      "maxzoom": 22.1,
      "minzoom": 4.0,
      "source-layer": "landuse"
    },
    {
      "id": "landuse-water-1",
      "type": "fill",
      "paint": {
        "fill-color": "#82d4d7",
        "fill-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          7.0,
          0.3,
          8.0,
          0.5,
          22.0,
          0.5
        ]
      },
      "filter": [
        "match",
        [
          "get",
          "landuse_type"
        ],
        [
          "sea",
          "bay",
          "lake"
        ],
        true,
        false
      ],
      "source": "static_landuse",
      "maxzoom": 22.1,
      "minzoom": 4.5,
      "source-layer": "landuse"
    },
    {
      "id": "landuse-green-2",
      "type": "fill",
      "paint": {
        "fill-color": "#bae5ce",
        "fill-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          6.0,
          0.3,
          6.5,
          1.0
        ]
      },
      "filter": [
        "in",
        [
          "get",
          "landuse_type"
        ],
        [
          "literal",
          [
            "playground",
            "park",
            "garden",
            "fitness_station",
            "dog_park",
            "vineyard",
            "orchard",
            "farmland",
            "recreation_ground"
          ]
        ]
      ],
      "source": "static_landuse",
      "maxzoom": 22.1,
      "minzoom": 12.0,
      "source-layer": "landuse"
    },
    {
      "id": "landuse-water-2",
      "type": "fill",
      "paint": {
        "fill-color": "#82d4d7",
        "fill-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          7.0,
          0.3,
          8.0,
          0.5,
          22.0,
          0.5
        ]
      },
      "filter": [
        "in",
        [
          "get",
          "landuse_type"
        ],
        [
          "literal",
          [
            "river",
            "stream",
            "oxbow",
            "stream_pool",
            "canal",
            "ditch",
            "agoon",
            "reservoir",
            "fountain",
            "water"
          ]
        ]
      ],
      "source": "static_landuse",
      "maxzoom": 22.1,
      "minzoom": 6.5,
      "source-layer": "landuse"
    },
    {
      "id": "river-stroke",
      "type": "line",
      "paint": {
        "line-color": "#82d4d7",
        "line-width": {
          "base": 1.0,
          "stops": [
            [
              6.0,
              0.4
            ],
            [
              10.0,
              1.0
            ],
            [
              12.0,
              2.0
            ],
            [
              14.0,
              5.0
            ],
            [
              16.0,
              8.0
            ],
            [
              18.0,
              10.0
            ]
          ]
        },
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          7.0,
          0.3,
          8.0,
          0.5,
          22.0,
          0.5
        ]
      },
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_landuse",
      "maxzoom": 22.1,
      "minzoom": 7.0,
      "source-layer": "river"
    },
    {
      "id": "road-other-stroke",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          16.0,
          2.0,
          18.0,
          4.0,
          20.0,
          6.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ]
      },
      "filter": [
        "any",
        [
          "!=",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ],
        [
          "!=",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.0,
      "source-layer": "road_other"
    },
    {
      "id": "road-other-stroke-tunnel",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          16.0,
          2.0,
          18.0,
          4.0,
          20.0,
          6.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ],
        [
          "!=",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.0,
      "source-layer": "road_other"
    },
    {
      "id": "road-other-stroke-bridge",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          16.0,
          3.0,
          18.0,
          5.5,
          20.0,
          8.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "!=",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.0,
      "source-layer": "road_other"
    },
    {
      "id": "road-minor-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-tunnel-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-bridge-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          9.0,
          18.0,
          18.0,
          20.0,
          25.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-tunnel-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-bridge-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          2.0,
          12.0,
          2.0,
          13.0,
          5.0,
          16.0,
          12.0,
          18.0,
          23.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-tunnel-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-bridge-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -2.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-tunnel-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-bridge-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-tunnel-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-bridge-stroke-under",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-fill-under",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          1.0,
          15.0,
          4.0,
          16.0,
          5.0,
          18.0,
          10.0,
          20.0,
          15.0
        ]
      },
      "filter": [
        "<=",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        -1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.3,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-fill-under",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          1.0,
          13.0,
          2.0,
          16.0,
          7.0,
          18.0,
          16.0,
          20.0,
          25.0
        ]
      },
      "filter": [
        "<=",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        -1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 12.3,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-fill-under",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-fill-under",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-fill-under",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "<=",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          -1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-tunnel-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-bridge-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          9.0,
          18.0,
          18.0,
          20.0,
          25.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-tunnel-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-bridge-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          2.0,
          12.0,
          2.0,
          13.0,
          5.0,
          16.0,
          12.0,
          18.0,
          23.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-tunnel-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-bridge-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-tunnel-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-bridge-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-tunnel-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-bridge-stroke-base",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-other-fill",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": {
          "stops": [
            [
              16.0,
              1.0
            ],
            [
              18.0,
              1.5
            ],
            [
              20.0,
              2.0
            ]
          ]
        },
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ],
        "line-dasharray": [
          5.0,
          2.0
        ]
      },
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.0,
      "source-layer": "road_other"
    },
    {
      "id": "road-footway",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": {
          "stops": [
            [
              16.0,
              1.0
            ],
            [
              18.0,
              1.5
            ],
            [
              20.0,
              2.0
            ]
          ]
        },
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ],
        "line-dasharray": [
          2.0,
          5.0
        ]
      },
      "filter": [
        "!=",
        [
          "get",
          "bridge"
        ],
        "yes"
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.0,
      "source-layer": "road_footway"
    },
    {
      "id": "road-minor-fill-base",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          1.0,
          15.0,
          4.0,
          16.0,
          5.0,
          18.0,
          10.0,
          20.0,
          15.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        0.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.3,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-fill-base",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          1.0,
          13.0,
          2.0,
          16.0,
          7.0,
          18.0,
          16.0,
          20.0,
          25.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        0.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 12.3,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-fill-base",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-fill-base",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-fill-base",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          0.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-tunnel-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-bridge-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          9.0,
          18.0,
          18.0,
          20.0,
          25.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-tunnel-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-bridge-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          2.0,
          12.0,
          2.0,
          13.0,
          5.0,
          16.0,
          12.0,
          18.0,
          23.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-tunnel-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-bridge-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-tunnel-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-bridge-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-tunnel-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-bridge-stroke-up-L1",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-fill-up-L1",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          1.0,
          15.0,
          4.0,
          16.0,
          5.0,
          18.0,
          10.0,
          20.0,
          15.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.3,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-fill-up-L1",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          1.0,
          13.0,
          2.0,
          16.0,
          7.0,
          18.0,
          16.0,
          20.0,
          25.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 12.3,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-fill-up-L1",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-fill-up-L1",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-fill-up-L1",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-tunnel-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-bridge-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          9.0,
          18.0,
          18.0,
          20.0,
          25.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-tunnel-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-bridge-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          2.0,
          12.0,
          2.0,
          13.0,
          5.0,
          16.0,
          12.0,
          18.0,
          23.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-tunnel-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-bridge-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-tunnel-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-bridge-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-tunnel-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-bridge-stroke-up-L2",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-fill-up-L2",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          1.0,
          15.0,
          4.0,
          16.0,
          5.0,
          18.0,
          10.0,
          20.0,
          15.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.3,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-fill-up-L2",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          1.0,
          13.0,
          2.0,
          16.0,
          7.0,
          18.0,
          16.0,
          20.0,
          25.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 12.3,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-fill-up-L2",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-fill-up-L2",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-fill-up-L2",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          2.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-tunnel-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          7.0,
          18.0,
          14.0,
          20.0,
          20.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-bridge-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          1.0,
          14.0,
          1.0,
          15.0,
          7.0,
          16.0,
          9.0,
          18.0,
          18.0,
          20.0,
          25.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          13.0,
          0.2,
          14.0,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 13.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-tunnel-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          1.0,
          12.0,
          1.0,
          13.0,
          4.0,
          16.0,
          9.0,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-bridge-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          2.0,
          12.0,
          2.0,
          13.0,
          5.0,
          16.0,
          12.0,
          18.0,
          23.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          11.0,
          0.3,
          11.5,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 11.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-tunnel-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-bridge-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#d8d8cd",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "primary",
            "primary_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-tunnel-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-bridge-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "trunk",
            "trunk_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "all",
          [
            "!=",
            [
              "get",
              "tunnel"
            ],
            "yes"
          ],
          [
            "!=",
            [
              "get",
              "bridge"
            ],
            "yes"
          ]
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-tunnel-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          3.0,
          14.0,
          5.0,
          16.0,
          10.0,
          18.0,
          22.0,
          20.0,
          35.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ],
        "line-dasharray": [
          1.0,
          0.2
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "tunnel"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-bridge-stroke-up-L3",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          1.0,
          7.0,
          2.0,
          8.0,
          3.0,
          9.0,
          4.0,
          12.0,
          4.0,
          14.0,
          7.0,
          16.0,
          12.0,
          18.0,
          28.0,
          20.0,
          40.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          1.0
        ],
        [
          "match",
          [
            "get",
            "highway"
          ],
          [
            "motorway",
            "motorway_link"
          ],
          true,
          false
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-minor-fill-up-L3",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          1.0,
          15.0,
          4.0,
          16.0,
          5.0,
          18.0,
          10.0,
          20.0,
          15.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.3,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-fill-up-L3",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          1.0,
          13.0,
          2.0,
          16.0,
          7.0,
          18.0,
          16.0,
          20.0,
          25.0
        ]
      },
      "filter": [
        "==",
        [
          "to-number",
          [
            "get",
            "layer"
          ]
        ],
        1.0
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 12.3,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-primary-fill-up-L3",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#FFF",
          "#FFF"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "primary_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-fill-up-L3",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "trunk_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-motorway-fill-up-L3",
      "type": "line",
      "paint": {
        "line-color": [
          "match",
          [
            "get",
            "tunnel"
          ],
          "yes",
          "#facbac",
          "#fac9a9"
        ],
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.7,
          7.0,
          1.0,
          8.0,
          1.5,
          9.0,
          2.0,
          12.0,
          2.5,
          14.0,
          3.5,
          16.0,
          7.5,
          18.0,
          20.0,
          20.0,
          30.0
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          5.5,
          0.3,
          5.8,
          1.0
        ]
      },
      "filter": [
        "all",
        [
          "==",
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ],
          3.0
        ],
        [
          "any",
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway"
          ],
          [
            "==",
            [
              "get",
              "highway"
            ],
            "motorway_link"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 5.5,
      "source-layer": "road_major"
    },
    {
      "id": "road-footway-bridge-stroke",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": {
          "stops": [
            [
              16.0,
              2.0
            ],
            [
              18.0,
              3.0
            ],
            [
              20.0,
              4.0
            ]
          ]
        },
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ]
      },
      "filter": [
        "any",
        [
          "==",
          [
            "get",
            "highway"
          ],
          "steps"
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 14.0,
      "source-layer": "road_footway"
    },
    {
      "id": "road-footway-bridge",
      "type": "line",
      "paint": {
        "line-color": "#FFF",
        "line-width": {
          "stops": [
            [
              16.0,
              1.0
            ],
            [
              18.0,
              1.5
            ],
            [
              20.0,
              2.0
            ]
          ]
        },
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          14.0,
          0.3,
          14.3,
          1.0
        ],
        "line-dasharray": [
          2.0,
          5.0
        ]
      },
      "filter": [
        "any",
        [
          "==",
          [
            "get",
            "highway"
          ],
          "steps"
        ],
        [
          "==",
          [
            "get",
            "bridge"
          ],
          "yes"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "static_road",
      "maxzoom": 22.1,
      "minzoom": 15.0,
      "source-layer": "road_footway"
    },
    {
      "id": "road-other-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 0.8
      },
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              16.0,
              8.0
            ],
            [
              17.0,
              13.0
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "minzoom": 16.0,
      "source-layer": "road_other"
    },
    {
      "id": "road-footway-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 0.8
      },
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              16.0,
              8.0
            ],
            [
              17.0,
              13.0
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "minzoom": 16.0,
      "source-layer": "road_footway"
    },
    {
      "id": "road-minor-arrow-on-direction",
      "type": "symbol",
      "paint": {},
      "filter": [
        "==",
        [
          "get",
          "oneway"
        ],
        "yes"
      ],
      "layout": {
        "icon-size": {
          "stops": [
            [
              15.0,
              0.005
            ],
            [
              17.0,
              0.01
            ],
            [
              18.0,
              0.02
            ]
          ]
        },
        "icon-image": "right-long-solid.png",
        "symbol-spacing": 200.0,
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line"
      },
      "source": "static_road",
      "minzoom": 16.0,
      "source-layer": "road_minor"
    },
    {
      "id": "road-minor-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 0.8
      },
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              15.0,
              10.0
            ],
            [
              17.0,
              13.0
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "minzoom": 15.3,
      "source-layer": "road_minor"
    },
    {
      "id": "road-intermediate-arrow-on-direction",
      "type": "symbol",
      "paint": {},
      "filter": [
        "==",
        [
          "get",
          "oneway"
        ],
        "yes"
      ],
      "layout": {
        "icon-size": {
          "stops": [
            [
              15.0,
              0.005
            ],
            [
              17.0,
              0.01
            ],
            [
              18.0,
              0.02
            ]
          ]
        },
        "icon-image": "right-long-solid.png",
        "symbol-spacing": 200.0,
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line"
      },
      "source": "static_road",
      "minzoom": 15.0,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-intermediate-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 0.8
      },
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              13.0,
              9.0
            ],
            [
              14.0,
              11.0
            ],
            [
              17.0,
              14.0
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "minzoom": 13.2,
      "source-layer": "road_intermediate"
    },
    {
      "id": "road-major-arrow-on-direction",
      "type": "symbol",
      "paint": {},
      "filter": [
        "==",
        [
          "get",
          "oneway"
        ],
        "yes"
      ],
      "layout": {
        "icon-size": {
          "stops": [
            [
              15.0,
              0.005
            ],
            [
              17.0,
              0.01
            ],
            [
              18.0,
              0.02
            ]
          ]
        },
        "icon-image": "right-long-solid.png",
        "symbol-spacing": 200.0,
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line"
      },
      "source": "static_road",
      "minzoom": 15.0,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "any",
        [
          "==",
          [
            "get",
            "highway"
          ],
          "trunk"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "trunk_link"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "motorway"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "motorway_link"
        ]
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnBold"
        ],
        "text-size": {
          "stops": [
            [
              11.0,
              11.5
            ],
            [
              14.0,
              13.5
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "maxzoom": 12.3,
      "minzoom": 11.0,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-primary-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "any",
        [
          "==",
          [
            "get",
            "highway"
          ],
          "primary"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "primary_link"
        ]
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnBold"
        ],
        "text-size": {
          "stops": [
            [
              12.0,
              11.5
            ],
            [
              14.0,
              13.0
            ],
            [
              17.0,
              15.5
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "minzoom": 12.3,
      "source-layer": "road_major"
    },
    {
      "id": "road-major-trunk-label",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-halo-color": "#FFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "any",
        [
          "==",
          [
            "get",
            "highway"
          ],
          "trunk"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "trunk_link"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "motorway"
        ],
        [
          "==",
          [
            "get",
            "highway"
          ],
          "motorway_link"
        ]
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnBold"
        ],
        "text-size": {
          "stops": [
            [
              12.0,
              12.0
            ],
            [
              14.0,
              13.5
            ],
            [
              17.0,
              16.0
            ]
          ]
        },
        "text-field": "{name}",
        "symbol-sort-key": [
          "-",
          10.0,
          [
            "to-number",
            [
              "get",
              "layer"
            ]
          ]
        ],
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-rotation-alignment": "map"
      },
      "source": "static_road",
      "minzoom": 12.3,
      "source-layer": "road_major"
    },
    {
      "id": "complication_point",
      "type": "circle",
      "paint": {
        "circle-blur": [
          "step",
          [
            "zoom"
          ],
          0.0,
          8,
          0.4
        ],
        "circle-color": "#4e5561",
        "circle-radius": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          6,
          1,
          9,
          3
        ]
      },
      "source": "static_complication",
      "source-layer": "complication",
      "maxzoom": 10,
      "minzoom": 8
    },
    {
      "id": "complication-icon",
      "type": "symbol",
      "paint": {},
      "layout": {
        "icon-size": {
          "stops": [
            [
              10,
              0.01
            ],
            [
              16,
              0.02
            ],
            [
              22,
              0.06
            ]
          ]
        },
        "icon-image": "camera.png",
        "icon-anchor": "bottom",
        "symbol-placement": "point"
      },
      "source": "static_complication",
      "source-layer": "complication",
      "maxzoom": 22,
      "minzoom": 10.01
    },
    {
      "id": "province-label",
      "type": "symbol",
      "paint": {
        "text-color": "#4c767f",
        "text-opacity": [
          "step",
          [
            "zoom"
          ],
          0.0,
          3.0,
          [
            "match",
            [
              "get",
              "name"
            ],
            "\u062a\u0647\u0631\u0627\u0646",
            1.0,
            0.0
          ],
          4.0,
          1.0
        ],
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "==",
        [
          "string",
          [
            "get",
            "place_level"
          ]
        ],
        "state"
      ],
      "layout": {
        "icon-size": 0.35,
        "text-font": [
          "IRANYekanWebFnMedium"
        ],
        "text-size": {
          "stops": [
            [
              4.0,
              9.5
            ],
            [
              4.5,
              10.0
            ],
            [
              5.0,
              11.0
            ]
          ]
        },
        "icon-image": [
          "match",
          [
            "get",
            "name"
          ],
          "\u062a\u0647\u0631\u0627\u0646",
          "center province.png",
          ""
        ],
        "text-field": "{name}",
        "text-anchor": "center",
        "text-offset": [
          "match",
          [
            "get",
            "name"
          ],
          "\u062a\u0647\u0631\u0627\u0646",
          [
            "literal",
            [
              0.0,
              0.9
            ]
          ],
          [
            "literal",
            [
              0.0,
              0.0
            ]
          ]
        ],
        "text-max-width": 8.0,
        "symbol-placement": "point",
        "text-allow-overlap": true
      },
      "source": "static_admin_division",
      "maxzoom": 5.0,
      "minzoom": 3.0,
      "source-layer": "admin_divisions_point_major"
    },
    {
      "id": "capitals-label",
      "type": "symbol",
      "paint": {
        "text-color": "#314d53",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.5
      },
      "filter": [
        "==",
        [
          "get",
          "place_level"
        ],
        "capital"
      ],
      "layout": {
        "icon-size": 0.3,
        "text-font": [
          "IRANYekanWebFnMedium"
        ],
        "text-size": {
          "stops": [
            [
              5.0,
              11.0
            ],
            [
              10.5,
              17.0
            ]
          ]
        },
        "icon-image": [
          "match",
          [
            "get",
            "name"
          ],
          "\u062a\u0647\u0631\u0627\u0646",
          "center province.png",
          "center city.png"
        ],
        "text-field": "{name}",
        "text-anchor": "center",
        "text-offset": [
          0.0,
          1.0
        ],
        "symbol-placement": "point",
        "text-allow-overlap": true
      },
      "source": "static_admin_division",
      "maxzoom": 10.5,
      "minzoom": 5.0,
      "source-layer": "admin_divisions_point_major"
    },
    {
      "id": "village-label",
      "type": "symbol",
      "paint": {
        "text-color": "#606060",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 0.8
      },
      "filter": [
        "any",
        [
          "==",
          [
            "get",
            "place_level"
          ],
          "village"
        ],
        [
          "==",
          [
            "get",
            "place_level"
          ],
          "hamlet"
        ]
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              9.0,
              8.5
            ],
            [
              10.0,
              10.5
            ]
          ]
        },
        "text-field": "{name}",
        "text-anchor": "center",
        "text-padding": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          8.0,
          20.0,
          16.0,
          5.0
        ],
        "text-max-width": 7.0
      },
      "source": "static_admin_division",
      "maxzoom": 16.0,
      "minzoom": 9.5,
      "source-layer": "admin_divisions_point_minor"
    },
    {
      "id": "town-label",
      "type": "symbol",
      "paint": {
        "text-color": "#606060",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "==",
        [
          "get",
          "place_level"
        ],
        "town"
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              7.0,
              9.0
            ],
            [
              10.0,
              12.0
            ]
          ]
        },
        "text-field": "{name}",
        "text-anchor": "center"
      },
      "source": "static_admin_division",
      "maxzoom": 15.0,
      "minzoom": 8.0,
      "source-layer": "admin_divisions_point_minor"
    },
    {
      "id": "cities-label",
      "type": "symbol",
      "paint": {
        "text-color": "#314d53",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.1
      },
      "filter": [
        "any",
        [
          "==",
          [
            "string",
            [
              "get",
              "place_level"
            ]
          ],
          "city"
        ],
        [
          "==",
          [
            "string",
            [
              "get",
              "place_level"
            ]
          ],
          "island"
        ]
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnRegular"
        ],
        "text-size": {
          "stops": [
            [
              5.5,
              10.0
            ],
            [
              10.0,
              14.0
            ]
          ]
        },
        "text-field": "{name}",
        "text-anchor": "center"
      },
      "source": "static_admin_division",
      "maxzoom": 14.0,
      "minzoom": 6.5,
      "source-layer": "admin_divisions_point_major"
    },
    {
      "id": "suburb",
      "type": "symbol",
      "paint": {
        "text-color": "#3A4C57",
        "text-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          10.5,
          1.0,
          13.0,
          0.4
        ],
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "==",
        [
          "get",
          "place_level"
        ],
        "suburb"
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnBold"
        ],
        "text-size": {
          "stops": [
            [
              10.5,
              11.0
            ],
            [
              11.5,
              13.0
            ],
            [
              13.0,
              14.0
            ]
          ]
        },
        "text-field": "{name}",
        "text-anchor": "center",
        "text-offset": [
          "match",
          [
            "get",
            "id"
          ],
          44151.0,
          [
            "literal",
            [
              5.0,
              0.0
            ]
          ],
          [
            "literal",
            [
              0.0,
              0.0
            ]
          ]
        ],
        "symbol-placement": "point"
      },
      "source": "static_admin_division",
      "maxzoom": 13.0,
      "minzoom": 10.5,
      "source-layer": "admin_divisions_point_minor"
    },
    {
      "id": "neighbourhood",
      "type": "symbol",
      "paint": {
        "text-color": "#252525",
        "text-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          1.0,
          13.0,
          0.8,
          14.5,
          0.5
        ],
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.0
      },
      "filter": [
        "==",
        [
          "get",
          "place_level"
        ],
        "neighbourhood"
      ],
      "layout": {
        "text-font": [
          "IRANYekanWebFnBold"
        ],
        "text-size": {
          "stops": [
            [
              12.0,
              10.0
            ],
            [
              14.5,
              13.0
            ]
          ]
        },
        "text-field": "{name}",
        "text-anchor": "center",
        "text-padding": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          12.0,
          10.0,
          14.5,
          5.0
        ],
        "symbol-placement": "point"
      },
      "source": "static_admin_division",
      "maxzoom": 14.5,
      "minzoom": 12.0,
      "source-layer": "admin_divisions_point_minor"
    },
    {
      "id": "province_outline",
      "type": "line",
      "filter": [
        "==",
        [
          "get",
          "place_level"
        ],
        "province"
      ],
      "minzoom": 3,
      "layout": {
        "line-join": "bevel"
      },
      "paint": {
        "line-color": "#15130b",
        "line-width": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          7,
          0.8,
          12,
          2
        ],
        "line-opacity": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          3,
          0.1,
          8,
          0.5
        ],
        "line-dasharray": [
          1,
          0
        ],
        "line-blur": [
          "interpolate",
          [
            "linear"
          ],
          [
            "zoom"
          ],
          3,
          0,
          8,
          3
        ]
      },
      "source": "static_admin_division",
      "source-layer": "admin_divisions_polygon"
    }
  ],
  "sources": {
    "static_road": {
      "name": "roads",
      "type": "vector",
      "tiles": [
        "http://5.201.178.229:9090/data/static_road/{z}/{x}/{y}.pbf"
      ],
      "format": "pbf",
      "scheme": "xyz",
      "maxzoom": 18,
      "tilejson": "2.2.0",
      "attribution": "Viuna Attribution",
      "mapbox_logo": false,
      "vector_layers": [
        {
          "id": "road_major",
          "fields": {},
          "source": "static-road",
          "description": "",
          "source_name": "road_major"
        },
        {
          "id": "road_intermediate",
          "fields": {},
          "source": "static-road",
          "description": "",
          "source_name": "road_intermediate"
        },
        {
          "id": "road_minor",
          "fields": {},
          "source": "static-road",
          "description": "",
          "source_name": "road_minor"
        },
        {
          "id": "road_footway",
          "fields": {},
          "source": "static-road",
          "description": "",
          "source_name": "road_footway"
        },
        {
          "id": "road_other",
          "fields": {},
          "source": "static-road",
          "description": "",
          "source_name": "road_other"
        },
        {
          "id": "road_block",
          "fields": {},
          "source": "static-road",
          "description": "",
          "source_name": "road_block"
        }
      ]
    },
    "static_complication": {
      "name": "complication",
      "attribution": "Viuna Attribution",
      "type": "vector",
      "tiles": [
        "http://5.201.178.229:9090/data/static_complication/{z}/{x}/{y}.pbf"
      ],
      "format": "pbf",
      "scheme": "xyz",
      "maxzoom": 18,
      "tilejson": "2.2.0",
      "mapbox_logo": false,
      "vector_layers": [
        {
          "id": "complication",
          "fields": {},
          "source": "static_complication",
          "description": "",
          "source_name": "complication"
        },
        {
          "id": "station",
          "fields": {},
          "source": "static_complication",
          "description": "",
          "source_name": "station"
        }
      ]
    },
    "static_admin_division": {
      "name": "admin division",
      "attribution": "Viuna Attribution",
      "type": "vector",
      "tiles": [
        "http://5.201.178.229:9090/data/static_admin_division/{z}/{x}/{y}.pbf"
      ],
      "format": "pbf",
      "scheme": "xyz",
      "maxzoom": 18,
      "tilejson": "2.2.0",
      "mapbox_logo": false,
      "vector_layers": [
        {
          "id": "admin_divisions_polygon",
          "fields": {},
          "source": "static_admin_division",
          "description": "",
          "source_name": "admin_divisions_polygon"
        },
        {
          "id": "admin_divisions_point_major",
          "fields": {},
          "source": "static_admin_division",
          "description": "",
          "source_name": "admin_divisions_point_major"
        },
        {
          "id": "admin_divisions_point_minor",
          "fields": {},
          "source": "static_admin_division",
          "description": "",
          "source_name": "admin_divisions_point_minor"
        }
      ]
    },
    "static_landuse": {
      "name": "landuse",
      "type": "vector",
      "attribution": "Viuna Attribution",
      "tiles": [
        "http://5.201.178.229:9090/data/static_landuse/{z}/{x}/{y}.pbf"
      ],
      "format": "pbf",
      "scheme": "xyz",
      "maxzoom": 18,
      "tilejson": "2.2.0",
      "mapbox_logo": false,
      "vector_layers": [
        {
          "id": "landuse",
          "fields": {},
          "source": "static_landuse",
          "description": "",
          "source_name": "landuse"
        },
        {
          "id": "river",
          "fields": {},
          "source": "static_landuse",
          "description": "",
          "source_name": "river"
        }
      ]
    }
  }
}