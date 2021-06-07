# cs375
# Fitness App

#### Record the running progress and fitness data of users to achieve a running goal.
#### Final deployed website on AWS: http://3.134.105.133:3000/


#### Steps to run a local version of the webapp
#### Prerequisite: Install Postgres Database, Git, NodeJS, NPM...

#### Step 1: Clone git repo to your local machine by git clone https://github.com/sb3958/cs375.git
#### Step 2: Setting up database for website. The website contains 3 tables in the backend: info table for user data 
#### such as weight, height, age...; accounts table for username and hashed password; and progress table for user running progress data
###### - Login to Postgres database with your Postgres username (postgres by default) and create a database by CREATE DATABASE fitness;
###### - Create the 3 db tables by:
###### CREATE TABLE accounts (username VARCHAR(50), hashedpassword VARCHAR(100));
###### CREATE TABLE info (username VARCHAR(50), height INT, weight INT, bmi FLOAT, public BOOLEAN, runninggoal FLOAT, achieved BOOLEAN, age INT);
###### CREATE TABLE progress (username VARCHAR(50), progress FLOAT, date VARCHAR(50));
#### Step 3: Copy the env.json to the directory above our app directory (outside the cs375 folder). This will be the data used by our app to login and connect with Postgres DB.Change the user to your Postgres username and the according password.
#### Step 4: Under our app directory (./cs375/), run 'npm install' to install supporting node modules. The node_modules folder should show up in our app directory.
#### Step 5: Run the server by going to cs375 directory and run 'node server.js'. The terminal should print out listening on localhost at port 3000 and it has connected to the database.
#### Step 6: On web browser, enter localhost:3000 and it should open up our main page. If you are new user, use the create new user field to create new account. If you are returning user, use the login field. You won't be able to use the app if you are not logged in.
#### Step 7: Once logged in, you can use the Setting goal field first to add your personal info and your running goal.
#### Step 8: Once the goal is set, you can enter some running progress or update the info and then going to the search page, enter your username in the search bar to view the graph of your running progress. You can also go to the map page from the main page and enter the location for your source and destination location. You can hide your data from the public if you set privacy to private. The search page will not show your data if your data is set to private. 

#### Organization Structure of Fitness App.
###### cs375/
###### ____public_html/
###### _________add.html
###### _________add.js
###### _________logo.jpg
###### _________search.html
###### _________search.js
###### ____server.js
###### env.json

