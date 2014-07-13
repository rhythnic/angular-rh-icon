# README #

angular-rh-icon is a simple collection of icons that can be used easily through the use of directives in angular.

For better usage instructions, and to see all currently available icons,
visit http://rhythnic.com/rh-icon
<a href="http://www.rhythnic.com/rh-icon">http://rhythnic.com/rh-icon</a>

### What is this repository for? ###

* This repository is for a collection of icons that are intended to be used as inline SVG in angular.
* 0.0.0

### How do I get set up? ###

Using bower:
bower install --save angular-rh-icon

or:
download the files from bitbucket


Add the file to your index.html
<script src="angular-rh-icon/angular-rh-icon.js"></script>


Add the module dependency to your angular app
angular.module('yourApp', [rhIcon])


Icons.json has all of the icon information needed to display them.  Set this filepath in app.config
rhIconCollection.setFilePath('path/to/icons/from/web/root/icons.json');

For production, consider creating a new json file that contains only the icons that you need.
*Note: add the special angular text to the front of your json file to make it secure
Start your json on line 2, and on line 1 put:  )]}',
For an example, look at icons.json
*more info:  https://docs.angularjs.org/api/ng/service/$http



Add the 'rh-def' directive shortly after your opening body tag
This will create an svg and def tag that includes a symbol with viewBox for each icon
<body>
    <rh-def></rh-def>
    
    
Add the rh-icon directive wherever you would like an icon to appear
Specify the icon name using icon="name"
Specify an svg title using title="title"
example:
<rh-icon icon="camera" title="Upload your image"></rh-icon>

This creates an svg tag with viewBox.  Inside of the svg tag there is a use tag that
points to the symbol created by rh-def.

Style the icons by adding a class to the rh-icon element and setting a css rule.
<rh-icon class="my-icon-class" icon="camera" title="Upload your image"></rh-icon>

(in your css file)
.my-icon-class {
    width: 3em;
    height: 3em;
    fill: red;         // fill color
    stroke: black;     // border/outline color
    stroke-width: 2;   // border/outline width
}


* Dependencies
  angular


### Adding Icons ###
Each icon needs a path and the x, y, width(w), height(h) info for the viewBox.
The raphael.js function Raphael.pathBBox is used to get the viewBox info.
If you can get the path for a new icon then inside of the add_icons directory
there is an html file that will help you produce the object to insert into
your custom icons.json file.



Nicholas Baroni
nick@rhythnic.com