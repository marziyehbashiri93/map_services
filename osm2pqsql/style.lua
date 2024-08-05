------------------------------ road ----------------------------------
local road_table = osm2pgsql.define_way_table('road', {
    { column = 'name', type = 'text' },
    { column = 'highway', type = 'text', not_null = true },
    { column = 'oneway', type = 'text' },
    { column = 'layer', type = 'text' },
    { column = 'bridge', type = 'text' },
    { column = 'tunnel', type = 'text' },
    { column = 'geom', type = 'linestring' },
},{ schema = 'public' }

)

local admin_divisions_point_table = osm2pgsql.define_node_table('admin_divisions_point', {
    { column = 'name', type = 'text' },
    { column = 'place_level', type = 'text', not_null = true },
    { column = 'capital', },
    { column = 'geom', type = 'point' },
},
        { schema = 'public' }
)
local landuse_table = osm2pgsql.define_area_table('landuse', {
    { column = 'name', type = 'text' },
    { column = 'landuse_type', type = 'text', not_null = true },
    { column = 'geom', type = 'polygon' },},
    { schema = 'public' })

local admin_divisions_polygon_table = osm2pgsql.define_area_table('admin_divisions_polygon', {
    { column = 'name', type = 'text' },
    { column = 'place_level', type = 'text', not_null = true },
    { column = 'geom', type = 'multipolygon' },
},
        { schema = 'public' }
)
local complication_table = osm2pgsql.define_node_table('complication', {
    { column = 'name', type = 'text' },
    { column = 'geom', type = 'point' },
},
        { schema = 'public' }
)

local station_table = osm2pgsql.define_area_table('station', {
    { column = 'name', type = 'text' },
    { column = 'type', type = 'text', not_null = true },
    { column = 'geom', type = 'polygon' },
},
        { schema = 'public' }
)


function osm2pgsql.process_way(object)
    if object.tags.highway then
        road_table:insert({
            name = object.tags.name,
            geom = object:as_linestring(),
            highway = object.tags.highway,
            oneway = object.tags.oneway,
            layer = object.tags.layer,
            bridge = object.tags.bridge,
            tunnel = object.tags.tunnel,
        })
    end
end

function osm2pgsql.process_way(object)
    landuse_filter = { 'cemetery', 'forest', 'farmland', 'meadow', 'orchard', 'vineyard', 'recreation_ground',
                       'allotments', 'flowerbed', 'grass', ' greenfield', 'plant_nursery', 'industrial', 'military' }
    leisure_filter = { 'dog_park', 'fitness_station', 'garden', 'park', 'playground', 'golf_course',
                       'miniature_golf', 'stadium' }
    natural_filter = { 'wood', 'scrub', 'heath', 'grassland', 'fell', 'tundra', 'glacier', 'water', 'wetland', 'bay',
                       'cape', 'strait', 'beach', 'coastline', 'reef', 'spring', 'hot_spring', 'geyser' }

    if object.tags.landuse or object.tags.leisure or object.tags.water then
        local landuse_type = object.tags.landuse or object.tags.leisure or object.tags.water
        landuse_table:insert({
            name = object.tags.name,
            geom = object:as_polygon(),
            landuse_type = landuse_type,
        })
    end
end

function osm2pgsql.process_relation(object)
    admin_divisions_polygon_table:insert({
        name = object.tags.name,
        geom = object.as_multipolygon(),
        place_level = object.tags.place,
    })
end

function osm2pgsql.process_node(object)
    admin_divisions_point_table:insert({
        name = object.tags.name,
        geom = object.as_point(),
        place_level = object.tags.place,
        capital = object.tags.capital,
    })
end


function osm2pgsql.process_node(object)
    if object.tags.highway == 'speed_camera' then
        complication_table:insert({
            name = object.tags.name,
            geom = object.as_point()
        })
    end

end


function osm2pgsql.process_way(object)
    if object.tags.public_transport == 'station'  then
        station_table:insert({
            name = object.tags.name,
            geom = object:as_polygon(),
            type = object.tags.public_transport,
        })
    end
end


--public_transport station

------------------------------river------------------