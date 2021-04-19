var race = [
  "No Filter",
  "American Indian/Alaska Native",
  "Asian",
  "Black",
  "White",
  "Native Hawaiian/Other Pacific Islander",
  "Multiple/Other",
  "Unknown",
  "No Filter",
];
var raceDropdownChange = function () {
  var currentRace = d3.select(this).property("value");
  race = currentRace;
};
var race;
var raceDropdown = d3
  .select("#race-dropdown")
  .insert("select", "svg")
  .on("change", raceDropdownChange);
raceDropdown
  .selectAll("option")
  .data(race)
  .enter()
  .append("option")
  .attr("value", function (d) {
    return d;
  })
  .text(function (d) {
    return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
  });

var sex = ["No Filter", "Male", "Female", "Other", "Missing", "NA", "Unknown"];
var sexDropdownChange = function () {
  var currentsex = d3.select(this).property("value");
  sex = currentsex;
};
var sex;
var sexDropdown = d3
  .select("#sex-dropdown")
  .insert("select", "svg")
  .on("change", sexDropdownChange);
sexDropdown
  .selectAll("option")
  .data(sex)
  .enter()
  .append("option")
  .attr("value", function (d) {
    return d;
  })
  .text(function (d) {
    return d;
  });

var age = [
  "No Filter",
  "0 - 17 years",
  "18 to 49 years",
  "50 to 64 years",
  "Unknown",
  "Missing",
  "NA",
];
var ageDropdownChange = function () {
  var currentage = d3.select(this).property("value");
  age = currentage;
};
var age;
var ageDropdown = d3
  .select("#age-dropdown")
  .insert("select", "svg")
  .on("change", ageDropdownChange);
ageDropdown
  .selectAll("option")
  .data(age)
  .enter()
  .append("option")
  .attr("value", function (d) {
    return d;
  })
  .text(function (d) {
    return d;
  });

var time = [
  "No Filter",
  "2020-01",
  "2020-02",
  "2020-03",
  "2020-04",
  "2020-05",
  "2020-06",
  "2020-07",
  "2020-08",
  "2020-09",
  "2020-10",
  "2020-11",
  "2020-12",
  "2021-01",
  "2021-02",
  "2021-03",
];
var time;
function timeDropdownChange() {
  var currentTime = d3.select(this).property("value");
  time = currentTime;
}
var timeDropdown = d3
  .select("#time-dropdown")
  .insert("select", "svg")
  .on("change", timeDropdownChange);
timeDropdown
  .selectAll("option")
  .data(time)
  .enter()
  .append("option")
  .attr("value", function (d) {
    return d;
  })
  .text(function (d) {
    return d;
  });
var api =
  "https://data.cdc.gov/resource/n8mc-b4w4.json?$$app_token=RKTJDZZUJEMzBDQDZCBHJJk46&$limit=23000&";

//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo
  .albersUsa()
  .translate([width / 2, height / 2])
  .scale([1000]);

var path = d3.geo.path().projection(projection);

var color = d3.scale
  .linear()
  .range([
    "rgb(255,0,0)",
    "rgb(255,128,0)",
    "rgb(255,255,51)",
    "rgb(0,255,0)",
    "rgb(0,0,255)",
  ]);
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
let totalCases = 0;
var stateMap = new Map();
var cityMap = new Map();
d3.json(api, function (data) {
  console.log(api);
  color.domain([0, 1, 2, 3, 4]);
  for (var i = 0; i < 5; i++) {
    console.log(data[i]);
  }
  let totalCases = 0;
  d3.json("US.json", function (json) {
    for (var i = 0; i < data.length; i++) {
      var dataState = data[i].res_state;
      if (stateMap.has(dataState)) {
        var increase = stateMap.get(dataState);
        stateMap.set(dataState, increase + 1);
      } else {
        stateMap.set(dataState, 1);
      }
      var dataCity = data[i].res_county;
      if (cityMap.has(dataCity)) {
        var increase = cityMap.get(dataCity)[1];
        cityMap.set(dataCity, [data[i].res_state, increase + 1]);
      } else {
        cityMap.set(dataCity, [data[i].res_state, 1]);
      }
    }
    let stateKeys = Array.from(stateMap.keys());
    for (var x = 0; x < stateKeys.length; x++) {
      if (stateMap.get(stateKeys[x]) > totalCases) {
        totalCases = stateMap.get(stateKeys[x]);
      }
    }
    for (var j = 0; j < json.features.length; j++) {
      var jsonState = json.features[j].properties.NAME;
      json.features[j].properties.visited = stateMap.get(jsonState);
    }
    var legend = d3
      .select("body")
      .append("svg")
      .attr("class", "legend")
      .attr("width", 140)
      .attr("height", 200)
      .selectAll("g")
      .data(color.domain().slice())
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
    var legendText = [
      "Over" + Math.floor(totalCases / 5) * 4,
      "Between " +
        (Math.floor(totalCases / 5) * 3 + 1) +
        "- " +
        Math.floor(totalCases / 5) * 4,
      "Between " +
        (Math.floor(totalCases / 5) * 2 + 1) +
        "- " +
        Math.floor(totalCases / 5) * 3,
      "Between " +
        (Math.floor(totalCases / 5) + 1) +
        "- " +
        Math.floor(totalCases / 5) * 2,
      "Between " + 1 + "- " + Math.floor(totalCases / 5),
      "No Cases Reported",
    ];
    legend
      .append("text")
      .data(legendText)
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function (d) {
        return d;
      });
    console.log(stateMap);
    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function (d) {
        var value = d.properties.visited;
        if (value) {
          if (value >= 0 && value <= Math.floor(totalCases / 5)) {
            return color(4);
          }
          if (
            value > Math.floor(totalCases / 5) &&
            value <= Math.floor(totalCases / 5) * 2
          ) {
            return color(3);
          }
          if (
            value > Math.floor(totalCases / 5) * 2 &&
            value <= Math.floor(totalCases / 5) * 3
          ) {
            return color(2);
          }
          if (
            value > Math.floor(totalCases / 5) * 3 &&
            value <= Math.floor(totalCases / 5) * 4
          ) {
            return color(1);
          }
          if (value > Math.floor(totalCases / 5) * 4) {
            return color(0);
          }
        } else {
          return "rgb(213,222,217)";
        }
      })
      .on("mouseover", function (d) {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .text(d.properties.visited)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
      });
  });
});

function submit() {
  d3.selectAll("svg > *").remove();
  api =
    "https://data.cdc.gov/resource/n8mc-b4w4.json?$limit=23000&";

  if (time != "No Filter") {
    api += "case_month=" + time + "&";
  }
  if (race != "No Filter") {
    api += "race=" + race + "&";
  }
  if (sex != "No Filter") {
    api += "sex=" + sex + "&";
  }
  if (age != "No Filter") {
    if (age == "18 to 49 years") {
      api += "age_group=18%20to%2049%20years" + "&";
    }
    if (age == "50 to 64 years") {
      api += "age_group=50%20to%2064%20years" + "&";
    }
    if (age == "0 - 17 years") {
      api += "age_group=0%20-%2017%20years" + "&";
    }
  }

  cityMap.clear();
  stateMap.clear();
  d3.json(api, function (data) {
    console.log(api);
    color.domain([0, 1, 2, 3, 4]);
    let totalCases = 0;
    d3.json("US.json", function (json) {
      for (var i = 0; i < data.length; i++) {
        var dataState = data[i].res_state;
        if (stateMap.has(dataState)) {
          var increase = stateMap.get(dataState);
          stateMap.set(dataState, increase + 1);
        } else {
          stateMap.set(dataState, 1);
        }
        var dataCity = data[i].res_county;
        if (cityMap.has(dataCity)) {
          var increase = cityMap.get(dataCity)[1];
          cityMap.set(dataCity, [data[i].res_state, increase + 1]);
        } else {
          cityMap.set(dataCity, [data[i].res_state, 1]);
        }
      }
      let stateKeys = Array.from(stateMap.keys());
      for (var x = 0; x < stateKeys.length; x++) {
        if (stateMap.get(stateKeys[x]) > totalCases) {
          totalCases = stateMap.get(stateKeys[x]);
        }
      }
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.NAME;
        json.features[j].properties.visited = stateMap.get(jsonState);
      }
      var legend = d3
        .select("body")
        .append("svg")
        .attr("class", "legend")
        .attr("width", 140)
        .attr("height", 200)
        .selectAll("g")
        .data(color.domain().slice())
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
      var legendText = [
        "Over " + Math.floor(totalCases / 5) * 4,
        "Between " +
          (Math.floor(totalCases / 5) * 3 + 1) +
          "- " +
          Math.floor(totalCases / 5) * 4,
        "Between " +
          (Math.floor(totalCases / 5) * 2 + 1) +
          "- " +
          Math.floor(totalCases / 5) * 3,
        "Between " +
          (Math.floor(totalCases / 5) + 1) +
          "- " +
          Math.floor(totalCases / 5) * 2,
        "Between " + 1 + "- " + Math.floor(totalCases / 5),
        "No Cases Reported",
      ];
      legend
        .append("text")
        .data(legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
          return d;
        });
      console.log(stateMap);
      svg
        .selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function (d) {
          var value = d.properties.visited;
          if (value) {
            if (value >= 0 && value <= Math.floor(totalCases / 5)) {
              return color(4);
            }
            if (
              value > Math.floor(totalCases / 5) &&
              value <= Math.floor(totalCases / 5) * 2
            ) {
              return color(3);
            }
            if (
              value > Math.floor(totalCases / 5) * 2 &&
              value <= Math.floor(totalCases / 5) * 3
            ) {
              return color(2);
            }
            if (
              value > Math.floor(totalCases / 5) * 3 &&
              value <= Math.floor(totalCases / 5) * 4
            ) {
              return color(1);
            }
            if (value > Math.floor(totalCases / 5) * 4) {
              return color(0);
            }
          } else {
            return "rgb(213,222,217)";
          }
        })
        .on("mouseover", function (d) {
          div.transition().duration(200).style("opacity", 0.9);
          div
            .text(d.properties.visited)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(500).style("opacity", 0);
        });

      console.log(totalCases);
    });
  });
}
