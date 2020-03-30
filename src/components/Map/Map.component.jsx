import React, { Component } from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import styles from './Map.component.scss';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { usData: null }
  }

  componentWillMount() {
    // LOAD DATA
    d3.queue()
      .defer(d3.json, "us.json")
      .await((error, usData) => {
        this.setState({
          usData
        });
      })
  }

  componentDidUpdate() {
    const width = 960, height = 500, active = d3.select(null);

    const projection = d3.geoAlbersUsa()
      .scale([1000])
      .translate([width / 2, height / 2]);

    // const zoom = d3.zoom()
    //   .on("zoom", zoomed);

    // const initialTransform = d3.zoomIdentity
    //   .translate(0, 0)
    //   .scale(1);

    const path = d3.geoPath()
      .projection(projection);

    const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("click", stopped, true);

    svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", reset);

    const g = svg.append("g");

    // svg
    // // .call(zoom) // delete this line to disable free zooming
    // .call(zoom.transform, initialTransform);

    d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json", function (error, us) {
      if (error) throw error;

      g.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
        .on("click", clicked);

      g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);
    })

    function clicked(d) {
      // if (active.node() === this) return reset();
      active.classed("active", false);
      console.log(active)
      active = d3.select(this).classed("active", true);
      // console.log('after: ' + active)

      var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

      // var transform = d3.zoomIdentity
      //   .translate(translate[0], translate[1])
      //   .scale(scale);

      // svg.transition()
      //   .duration(750)
      // .call(zoom.transform, transform);
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      // svg.transition()
      //   .duration(750)
      //   .call(zoom.transform, initialTransform);
    }

    // function zoomed() {
    //   var transform = d3.event.transform;

    //   g.style("stroke-width", 1.5 / transform.k + "px");
    //   g.attr("transform", transform);
    // }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function stopped() {
      if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }
  }
  render() {
    return (
      <svg>
        <g ref="anchor" />;
      </svg >
    )
  }
}

export default Map
