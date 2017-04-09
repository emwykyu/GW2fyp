**********************
** INSTALLING NODEJs**
**********************
Install NodeJs from https://nodejs.org/en/
This will also install the Node Package Manager, NPM

The package.JSON contains the dependencies required to run the project.

***************************
**INSTALLING DEPENDENCIES**
***************************

Navigate to the project folder
Open a command shell (I personally prefer using Git Bash)

*NodeJs may require being added to the PATH. 

in the CLI, type in: 
	
	npm install 

this will install all the dependencies for the project into a folder within the directory
called 'node modules'


bower can be installed by the following command: 

	npm install -g bower grunt-cli

the following bower components also need to be installed with the following commands:

bower install dlr.gw2Api
bower install foundation-sites
bower install ionicons
bower install jquery-ui
bower install modernizr
bower install motion-ui --save
bower install what-input
bower install wowjs

***************************
**RUNNING PROJECT**
***************************
In the project folder, open a command shell (I prefer Git Bash)
type 
	node app

or 
	node app.js


The console will output 'server started on port 3000'

In a web browser, navigate to 
	
	http://localhost/3000
