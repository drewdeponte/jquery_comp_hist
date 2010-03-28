// This is a jQuery plugin that provides a comparitive histogram given a data
// set in the format described below. Since it is a comparitive histogram the
// two sets of data are generally going to be from the same population and
// will also be broken down into groups that crosses the bounderies of the
// initial two data sets. A prime example of this is gender based
// demographics. Generally you have two main groups from a single population,
// Male and Female. Both of these main groups can be broken into shared sub
// groups, in this case age ranges 13-17, 18-24, 25-34, 35-44, 45-54,  and
// 55+. In all these cases including this specific one we are interested in
// the total percentage of our population that is Male and Female. Beyond
// that we are interested in the total percentage of our population that
// falls within each of the subgroups as well as the percentage of the
// population that falls within the Male/Female and each subgroup. All the
// above described information can be obtained by providing the following
// information:
//
// {
//  population_label: 'Active Fans This Week',
//  group_1_label: 'Male', group_2_label: 'Female',
//  subgroups: [
//  { label: '13-17', group_1_count: 3, group_2_count: 16 },
//  { label: '18-24', group_1_count: 7, group_2_count: 27 },
//  { label: '25-34', group_1_count: 3, group_2_count: 29 },
//  { label: '35-44', group_1_count: 2, group_2_count: 9 },
//  { label: '45-54', group_1_count: 0, group_2_count: 4 },
//  { label: '55+', group_1_count: 0, group_2_count: 0 }
//  ],
//  non_demo_count: 230
// }

jQuery.fn.comphist = function(options, data) {
  var settings = jQuery.extend({
    value: 5, name: "pete", bar: 655
  }, options);
  
  function calcPerc(sample_size, population_size) {
    if (sample_size == 0) {
      return 0;
    } else {
      return Math.floor((sample_size/population_size) * 100);
    }
  }
  
  function inspect(obj) {
    for (prop in obj) {
      console.log(typeof(obj[prop]) + " - " + prop + ": " + obj[prop]);
      if ((typeof(obj[prop]) == 'object') && (obj[prop] != null)) {
        inspect(obj[prop]);
      }
    }
  }
  
  function procData(raw_data) {
    var res = { population_label: raw_data.population_label,
      group_1_label: raw_data.group_1_label,
      group_2_label: raw_data.group_2_label,
      subgroups: [] };
    
    // Iterate through the subgroups for each of the two primary groups and
    // sum up the total primary group sizes and then sum up those to obtain
    // the total population size
    res.group_1_count = 0;
    res.group_2_count = 0;
    var i;
    var tmp_
    for (i = 0; i < raw_data.subgroups.length; i++) {
      res.group_1_count = res.group_1_count + raw_data.subgroups[i].group_1_count;
      res.group_2_count = res.group_2_count + raw_data.subgroups[i].group_2_count;
      res.subgroups.push({ label: raw_data.subgroups[i].label,
        group_1_count: raw_data.subgroups[i].group_1_count,
        group_2_count: raw_data.subgroups[i].group_2_count });
    }
    res.population_count = res.group_1_count + res.group_2_count;
  
    // Obtain the percentages of the primary groups with respect to the total
    // population and the percentages of the subgroups with respect to the
    // total population.
    res.group_1_perc = calcPerc(res.group_1_count, res.population_count);  
    res.group_2_perc = calcPerc(res.group_2_count, res.population_count);
    for (i = 0; i < raw_data.subgroups.length; i++) {
      // res.subgroups
      res.subgroups[i].group_1_perc = calcPerc(raw_data.subgroups[i].group_1_count, res.population_count);
      res.subgroups[i].group_2_perc = calcPerc(raw_data.subgroups[i].group_2_count, res.population_count);
      res.subgroups[i].tot_perc = res.subgroups[i].group_1_perc + res.subgroups[i].group_2_perc;
    }
    
    // Now that all the calculations of percentages are finished. I can add
    // the non demographic count to produce a total population count of
    // both items with demographic attributes and items without demo graphic
    // attributes. I am not sure that we really want to keep this working
    // this way. I feel like it would be better if we could figure out a way
    // to represent the items with no demo data and then adjust the total
    // above so that the percentages still relate to the total.
    if (raw_data.non_demo_count) {
      res.population_count = res.population_count + raw_data.non_demo_count;      
    }
    
    return res;
  }
  
  // Validate that the provided data is in an acceptable format.
  //
  // The validDataFormat() function is designed to take in the raw data as it
  // is provided by the client application and verify that it is in a valid
  // format such that we can acutally use it to perform the calculations and
  // render the comparative histogram and the supported percentages. If it
  // is in a valid format then validDataFormat() returns true. If it is in an
  // invalid format then it returns false.
  function validDataFormat(raw_data) {
    return true;
  }
  
  // Render processed data into comparative histogram and associated stats.
  //
  // The renderData() function is designed to take in the data after it has
  // been processed render (draw) the comparative histogram and the
  // associated percentages.
  function renderData(container, processed_data) {
    
    // Different Container Div States and how to function in each state.
    //
    // 1. Neither height nor width is specified for the containing dv.
    //
    //    In this state the widget should be defined by the sum of all its
    //    children. Hence, intelligent defaults will be used and it will
    //    be rendered.
    //
    // 2. Both height and width are specified.
    //
    //    In this state the widget size is defined explicitly, hence the
    //    widget will be the size explicity defined and the contents will be
    //    horizontally and vertically scaled to fit N sub groups where N is
    //    the number of subgroups provided..
    //
    // 3. Only width is specified
    
    // Diffrent Container Div States
    //
    // 1. The client application didn't specify a width or height, so they
    // are expecting the width and height of that div to be defined by the
    // combination of its children and its parent.
    //
    // 2. The client application does specify a width and height, so they
    // are expecting the div to only take up the provided width and height
    // in area.
    // 1. Make everything fit into the specified height and width of the div.
    //
    // 2. 
    
    
    // var i;
    var html = "";
    // var max_bar_width = 125;
    
    // function calcBarLength(perc, max_bar_width) {
    //   var r;
    //   r = Math.floor((perc/100) * max_bar_width);
    //   if (r == 0) {
    //     r = 1;
    //   }
    //   return r;
    // }

    //container.addClass("ui-widget");
    //container.addClass("ui-comphist-widget");

    // Obtain the height of the container div and set the font-size to that
    // height in pixels so that I can then make all of the fonts and child
    // elements sized relative to that size.
    var container_width_in_px = container.height();
    //container.css('font-size', container_width_in_px + 'px');

    html += '<div class="ui-comphist-widget" style="font-size: ' + container_width_in_px + 'px;">';
    // Create the comparitive histogram header    
    html += '  <div class="ui-comphist-header">';
    html += '    <span class="ui-comphist-pop-size">' + processed_data.population_count + '</span>';
    html += '    <span class="ui-comphist-pop-label">' + processed_data.population_label + '</span>';
    html += '  </div>';
    
    html += '  <div class="ui-comphist-spacer">';
    html += '  </div>';

    html += '  <div class="ui-comphist-pseudotable">';
    // // Create primary group one bars column.
    html += '    <div class="ui-comphist-bars-col">';
    html += '      <div class="ui-comphist-label-row  ui-comphist-left-row">';
    html += '        <div class="ui-comphist-group-label ui-comphist-left-label">' + processed_data.group_1_label + '</div>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    html += '      <div class="ui-comphist-sum-row">';
    if (processed_data.group_1_perc == 0) {
      html += '        <div class="ui-comphist-sum-bar ui-comphist-left" style="width: 1%;">';
    } else {
      html += '        <div class="ui-comphist-sum-bar ui-comphist-left" style="width: ' + processed_data.group_1_perc + '%;">';
    }
    html += '        </div>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    for (i = 0; i < processed_data.subgroups.length; i++) {
      html += '      <div class="ui-comphist-subgroup-row">';
      if (processed_data.subgroups[i].group_1_perc == 0) {
        html += '        <div class="ui-comphist-bar ui-comphist-left" style="width: 1%;">';
      } else {
        html += '        <div class="ui-comphist-bar ui-comphist-left" style="width: ' + processed_data.subgroups[i].group_1_perc + '%;">';
      }
      html += '        </div>';
      html += '        <div style="clear: both;"></div>';
      html += '      </div>';
    }
    html += '    </div>'; // close group one bars column
    // 
    // // Create primary group two bars column.
    html += '    <div class="ui-comphist-bars-col">';
    html += '      <div class="ui-comphist-label-row">';
    html += '        <div class="ui-comphist-group-label ui-comphist-right-label">' + processed_data.group_2_label + '</div>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    html += '      <div class="ui-comphist-sum-row">';
    if (processed_data.group_2_perc == 0) {      
      html += '        <div class="ui-comphist-sum-bar ui-comphist-right" style="width: 1%;">';
    } else {
      html += '        <div class="ui-comphist-sum-bar ui-comphist-right" style="width: ' + processed_data.group_2_perc + '%;">';
    }
    html += '        </div>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    for (i = 0; i < processed_data.subgroups.length; i++) {
      html += '      <div class="ui-comphist-subgroup-row">';
      if (processed_data.subgroups[i].group_2_perc == 0) {
        html += '        <div class="ui-comphist-bar ui-comphist-right" style="width: 1%;">';
      } else {
        html += '        <div class="ui-comphist-bar ui-comphist-right" style="width: ' + processed_data.subgroups[i].group_2_perc + '%;">';
      }
      html += '        </div>';
      html += '        <div style="clear: both;"></div>';
      html += '      </div>';
    }    
    html += '    </div>'; // close group two bars column

    // Create the subgroup labels bar
    html += '    <div class="ui-comphist-subgroup-label-col">';
    html += '      <div class="ui-comphist-label-row">';
    html += '      </div>';
    html += '      <div class="ui-comphist-sum-row">';
    html += '      </div>';
    for (i = 0; i < processed_data.subgroups.length; i++) {
      html += '      <div class="ui-comphist-subgroup-row">';
      html += '        <span class="ui-comphist-subgroup-label ui-comphist-right">' + processed_data.subgroups[i].label + '</span>';
      html += '        <div style="clear: both;"></div>';
      html += '      </div>';
    }
    html += '    </div>'

    // Create the group one stats column
    html += '    <div class="ui-comphist-subgroup-col">';
    html += '      <div class="ui-comphist-label-row  ui-comphist-left-row">';
    html += '        <div class="ui-comphist-group-label ui-comphist-left-label">' + processed_data.group_1_label + '</div>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    html += '      <div class="ui-comphist-sum-row ui-comphist-row-left">';
    html += '        <span class="ui-comphist-sum-val ui-comphist-left">' + processed_data.group_1_perc + '%</span>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    for (i = 0; i < processed_data.subgroups.length; i++) {
      html += '      <div class="ui-comphist-subgroup-row ui-comphist-row-left">';
      html += '        <span class="ui-comphist-subgroup-val ui-comphist-left">' + processed_data.subgroups[i].group_1_perc + '%</span>';
      html += '        <div style="clear: both;"></div>';
      html += '      </div>';
    }
    html += '    </div>';
    // 
    // // Create the group two stats column
    html += '    <div class="ui-comphist-subgroup-col">';
    html += '      <div class="ui-comphist-label-row">';
    html += '        <div class="ui-comphist-group-label ui-comphist-right-label">' + processed_data.group_2_label + '</div>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    html += '      <div class="ui-comphist-sum-row">';
    html += '        <span class="ui-comphist-sum-val ui-comphist-right">' + processed_data.group_2_perc + '%</span>';
    html += '        <div style="clear: both;"></div>';
    html += '      </div>';
    for (i = 0; i < processed_data.subgroups.length; i++) {
      html += '      <div class="ui-comphist-subgroup-row">';
      html += '        <span class="ui-comphist-subgroup-val ui-comphist-right">' + processed_data.subgroups[i].group_2_perc + '%</span>';
      html += '        <div style="clear: both;"></div>';
      html += '      </div>';
    }
    html += '    </div>';
    // 
    // // Create the subgroup totals column
    html += '    <div class="ui-comphist-totals-col">';
    html += '      <div class="ui-comphist-label-row">';
    html += '      </div>';
    html += '      <div class="ui-comphist-sum-row">';
    html += '      </div>';
    for (i = 0; i < processed_data.subgroups.length; i++) {
      html += '      <div class="ui-comphist-subgroup-row">';
      html += '        <span class="ui-comphist-subgroup-tot-val ui-comphist-right">' + processed_data.subgroups[i].tot_perc + '%</span>';
      html += '        <div style="clear: both;"></div>';
      html += '      </div>';
    }
    html += '    </div>';
    
    html += "  </div>"; // close the ui-comphist-pseudotable
    html += "</div>"; // close the ui-comphist-widget
    
    container.html(html);
    
    container.mouseover(function (event) {
      var curo = $(event.target);
      if (curo.hasClass("ui-comphist-bar") || curo.hasClass("ui-comphist-sum-bar")) {
        container.trigger("barover", [curo.css("width"), curo.position()]);
      }
    });
    container.mouseout(function (event) {
      var curo = $(event.target);
      if (curo.hasClass("ui-comphist-bar") || curo.hasClass("ui-comphist-sum-bar")) {
        container.trigger("barout", [curo.css("width"), curo.position()]);
      }
    });
  }
  
  var proc_data = null;
  if (validDataFormat(data)) {
    proc_data = procData(data);
    renderData(this, proc_data);
  }
      
  return this;
};