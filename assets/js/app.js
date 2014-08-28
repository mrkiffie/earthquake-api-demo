/*jslint indent: 2 */
/*global window: true, document: true, jQuery: true, Modernizr: true, localStorage: true*/
'use strict';

/**
 * Adds a filter to all AJAX requests, sending them through the CORS proxy
 */
jQuery.ajaxPrefilter(function(options) {

  if (options.crossDomain && jQuery.support.cors) {
    options.url = (window.location.protocol === 'http:' ? 'http:' : 'https:') +
      '//cors-anywhere.herokuapp.com/' + options.url;
    }

});

jQuery(document).ready(function ($) {

  /**
   * A simple localStorage abstraction
   */
  var cache = {

    get : function (key) {
      return JSON.parse(localStorage.getItem(key));
    },

    set : function (key, data) {
      return localStorage.setItem(key, JSON.stringify(data));
    }

  };

  /**
   * Formats the date d mmmm yyyy @ hh:mm
   */
  var formatDate = function (date){

    var regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
      dateArray = regex.exec(date),
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      // d M Y @ H:i
      return parseInt(dateArray[3],10) + ' ' + months[dateArray[2]-1] + ' ' + dateArray[1] + ' @ ' + dateArray[4] + ':' + dateArray[5];

  }

  var earthquakeStat = {

    config: {

      localStorage: 'earthquakeStatData',

      endPoint: 'http://www.seismi.org/api/eqs/'

    },

    localStorage: Modernizr.localstorage,

    data: {},


    loadData: function (endPoint) {

      var dfd = $.Deferred();

      $.ajax({
        url: endPoint,
        success: function (response) {

          earthquakeStat.data = response;
          dfd.resolve(response);
          cache.set(endPoint, response);
        },
        dataType: 'json'
      });
      return dfd.promise();
    },

    doNothing : function (event){
      event.preventDefault();
    },
    buildQuery : function (){

      var year, month, limit, min_magnitude, query, path, querystring;

      year = $('#year').val();
      month = $('#month').val();
      limit = $('#limit').val();
      min_magnitude = $('#min_magnitude').val();

      if ( year !== ''){
        path = year;
        if (month >= 1 && month <= 12){
          path = path + '/' + month;
        }
      }

      querystring = {};
      // the API's limit is 900
      if (limit > 1 && limit < 900 ) {

        querystring.limit = limit;
      }
      if (min_magnitude > 1 && min_magnitude < 10 ) {
        querystring.min_magnitude = min_magnitude;
      }
      querystring = $.param(querystring);

      query = path + '?' + querystring;

      return query;
    },

    loadMap : function () {
      var img = $('<img/>'),
        parent = $(this).parent(),
        src = parent.attr('data-map-src');

      $(this).attr('disabled', 'disabled');

      img.attr('src', src)
        .attr('width', 800)
        .attr('height', 800);

      img.insertAfter(parent.find('h2'));
    },

    getData: function () {
      var dfd = $.Deferred(),
        endPoint = earthquakeStat.config.endPoint + earthquakeStat.buildQuery();

      if (earthquakeStat.localStorage) {
        earthquakeStat.data = cache.get(endPoint);
        if (earthquakeStat.data === null) {
          $.when(earthquakeStat.loadData(endPoint)).done(dfd.resolve);
        } else {
          dfd.resolve();
        }
      } else {
        $.when(earthquakeStat.loadData(endPoint)).done(dfd.resolve);
      }
      return dfd.promise();

    },

    init: function () {

      earthquakeStat.loadDataSet();

      $('#feed').on('click', 'button', earthquakeStat.loadMap);
      $('#controls').on('click', '#submit', earthquakeStat.doNothing);
      $('#controls').on('click', '#submit', earthquakeStat.loadDataSet);
    },

    loadDataSet : function () {

      $('#feed').empty().addClass('loading');
      $.when(earthquakeStat.getData()).done(earthquakeStat.renderFeed);

    },


    renderFeed: function () {
      var fragment = document.createDocumentFragment(),
        li,
        region,
        magnitude,
        time,
        depth,
        coords,
        button,
        message;

      if (earthquakeStat.data.count < 1) {
        message = $('<h2/>')
          .text('No results matched the query.');
        $('#feed').removeClass('loading').empty().append(message);
        console.log('asfdasd');
        return;
      }

      $.each(earthquakeStat.data.earthquakes, function (i) {

        coords = earthquakeStat.data.earthquakes[i].lat + ',' + earthquakeStat.data.earthquakes[i].lon;

        li = $('<li/>')
          .attr('data-lat', earthquakeStat.data.earthquakes[i].lat)
          .attr('data-lon', earthquakeStat.data.earthquakes[i].lon)
          .attr('data-map-src', 'http://maps.googleapis.com/maps/api/staticmap?center=' + coords + '&markers=size:mid%7Ccolor:red%7C' + coords + '&zoom=3&scale=2&size=400x400&maptype=hybrid&format=png')
          .addClass('cf');

        region = $('<h2/>')
          .text(earthquakeStat.data.earthquakes[i].region === '.' ? '(location not provided)' : earthquakeStat.data.earthquakes[i].region);

        time = $('<time/>')
          .attr('datetime', earthquakeStat.data.earthquakes[i].timedate)
          .text(formatDate(earthquakeStat.data.earthquakes[i].timedate));

        magnitude = $('<span/>')
          .addClass('magnitude')
          .text('Magnitude: ' + earthquakeStat.data.earthquakes[i].magnitude);

        depth = $('<span/>')
          .addClass('depth')
          .text('Depth: ' + earthquakeStat.data.earthquakes[i].depth + 'km');

        button = $('<button/>')
          .text('Load Map');

        li.append(region)
          .append(time)
          .append(magnitude)
          .append(depth)
          .append(button);

        li.appendTo(fragment);
      });

      $('#feed').removeClass('loading').empty().append(fragment);
    }
  };

  earthquakeStat.init();

  window.earthquakeStat = earthquakeStat;
});
