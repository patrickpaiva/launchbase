<h1 align="center">
  <img src="https://github.com/patrickpaiva/launchbase-foodfy/blob/master/public/img/chef.png" alt="FOODFY LOGO" width="200">

<br>  
<br>
 Foodfy - Launchbase
</h1>

<p align="center">Project developed as Rocketseat Launchbase's final challenge.</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

<hr />

# :rocket: Getting started

This application represents a theoretical project developed over Launchbase Bootcamp. It´s a recipes website based on Node.js and built using MVC design pattern. At Foodfy you can manage registered users, chefs and published recipes in our control panel which adapts according to users permission.

# :pushpin: Tecnologies used

- Node.js + Express
- PostgreSQL
- Nunjucks
- HTML + CSS

# :construction_worker: Installation

0)	Clone this repository to your machine;
1)	Execute “npm install” command to install all necessary dependencies;
2)	Add your database access credentials to file “src/app/config/db.js”. You’ll need PostgreSQL to proceed.
3)	With your database online, execute the seed file (node seed.js) to populate the website with sample data.
4)	Add an image file to “public/images” with the name “placeholder.png” or use the one that is already there. All sample data will use this image.

**_Be careful while deleting users or chefs, because it will remove your ‘placeholder.png” file. We left a backup in the same folder, in case you lose it.😊_**

5)	Execute application with “npm start” command.


# :bookmark_tabs: Notes

To access restricted area, just choose one user from table “users”, copy it´s e-mail address and use with password ‘1’.

If you want to test the recovery password feature, add your Mailtrap configuration to the file ‘src/lib/mailer.js’.

In case your database is already populated with Foodfy data, execute the cleaning routine which can be found in the file ‘database.sql’ under the tag ‘—to run seeds’.

You should create new chefs and recipes before testing the removing and editing features, because the sample data created by seed.js share the same placeholder image.


# :blue_book: License

Released in 2020. This project is under the [MIT license](https://github.com/patrickpaiva/launchbase-foodfy/blob/master/LICENSE).

Proudly made by [Patrick Paiva](https://github.com/patrickpaiva) :+1: :satisfied: