Installation
------------

install nodejs, bower , mogodb, npm

eg:

```
ubuntu: sudo apt-get install nodejs
arch  : sudo pacman -S nodejs
```
```
git clone <this repo>
cd penny-node
bower install
npm install
```
#### database setup

```
mkdir data
mongod --dbpath data // mongod --dbpath git_repos/javascripting/fileup/data
mongo
```
