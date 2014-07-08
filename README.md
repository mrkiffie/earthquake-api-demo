Frontend Developer Test
=======================
A little test to gauge your Javascript and HTML skill level.

#Background
It's the end of the world, nuclear war has broken out and the explosions have caused a rift in the earths seismic
activity causing mass earthquakes around the world.

Luckily the internet continues to be the primary source of communication for human life and you still have a job as a
developer.

#Objective
It is your job to develop an emergency website that displays a list of the most recent earthquakes around the world, you
will need to do the following:

 * Consume the recent earthquake JSON service:
 ```http://www.seismi.org/api/eqs/2011/03?min_magnitude=6``` > further documentation can be found here: (http://www.seismi.org/api/)
 * Render the results on the page
 * The results must be displayed in a timeline fashion similar to Facebook/Twitter timeline
 * A timeline item must display the followin properties:
    * Region
    * Magnitude
    * Time/Date
    * Depth
 * jQuery can be used and absolutely any other library including you deem worthy of using, of course you will need to justify and
 explain your reasoning.
 * Bonus points will be given if you do the following:
    * Add a refresh button
    * Add an auto refresh feature
    * Use live JSON from http://www.seismi.org/api/
    * Figure out a way that does not use any jQuery plugins
    * Lazy load the data on scroll
    * Write clean well documented code (https://github.com/airbnb/javascript)
    * Consider mobile first
    * Object oriented and modular Javascript is favourable: http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
    * Really its all up to you, browser performance, html, css, javascript go nuts... Kill it

#To get started
Fork this repo then pull request your submission on a branch that includes your Github username, e.g:
```ryanwild-awesome-quake-demo```

#Issues
If you have any issues or questions post them in the wiki: