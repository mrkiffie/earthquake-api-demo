/*jslint indent: 2 */
/*global window: true, document: true, jQuery: true, Modernizr: true, localStorage: true*/
'use strict';
jQuery(document).ready(function ($) {
  var earthquakeStat = {

    config: {

      localStorage: 'earthquakeStatData',

      endPoint: '/api/service.json'

    },

    localStorage: Modernizr.localstorage,

    data: {},


    loadData: function () {

      $.ajax({
        url: earthquakeStat.config.endPoint,
        success: function (response) {

          earthquakeStat.data = response;

          localStorage.setItem(earthquakeStat.config.localStorage, JSON.stringify(earthquakeStat.data));

        },
        dataType: 'json'
      });

    },

    loadMap : function (event) {
      var img = $(this).siblings('img');

      event.preventDefault();

      $(this).attr('disabled', 'disabled');

      img.attr('width', 800)
        .attr('height', 800);
      img.attr('src', img.attr('data-src'));

    },

    init: function () {

      if (earthquakeStat.localStorage) {
        earthquakeStat.data = JSON.parse(localStorage.getItem(earthquakeStat.config.localStorage));
        if (earthquakeStat.data === null) {
          earthquakeStat.loadData();
        }
      } else {
        earthquakeStat.loadData();
      }

      earthquakeStat.renderFeed();

      $('#feed').on('click', 'button', earthquakeStat.loadMap);
    },


    renderFeed: function () {
      var fragment = document.createDocumentFragment(),
        li,
        region,
        img,
        magnitude,
        time,
        depth,
        coods,
        button;

      $.each(earthquakeStat.data.earthquakes, function (i) {

        li = $('<li/>')
          .attr('data-lat', earthquakeStat.data.earthquakes[i].lat)
          .attr('data-lon', earthquakeStat.data.earthquakes[i].lon)
          .addClass('cf');

        region = $('<h2/>')
          .text(earthquakeStat.data.earthquakes[i].region === '.' ? '(location not provided)' : earthquakeStat.data.earthquakes[i].region);

        coods = earthquakeStat.data.earthquakes[i].lat + ',' + earthquakeStat.data.earthquakes[i].lon;

        img = $('<img/>')
          .attr('data-src', 'http://maps.googleapis.com/maps/api/staticmap?center=' + coods + '&markers=size:mid%7Ccolor:red%7C' + coods + '&zoom=3&scale=2&size=400x400&maptype=hybrid&format=png')
          .attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
          .attr('width', 800)
          .attr('height', 800);

        time = $('<time/>')
          .attr('datetime', earthquakeStat.data.earthquakes[i].timedate)
          .text(earthquakeStat.data.earthquakes[i].timedate);

        magnitude = $('<span/>')
          .addClass('magnitude')
          .text('Magnitude: ' + earthquakeStat.data.earthquakes[i].magnitude);

        depth = $('<span/>')
          .addClass('depth')
          .text('Depth: ' + earthquakeStat.data.earthquakes[i].depth + 'km');

        button = $('<button/>')
          .text('Load Map');

        li.append(region)
          .append(img)
          .append(time)
          .append(magnitude)
          .append(depth)
          .append(button);

        li.appendTo(fragment);
      });

      $('#feed').append(fragment);
    }
  };

  earthquakeStat.init();

  window.earthquakeStat = earthquakeStat;
});
