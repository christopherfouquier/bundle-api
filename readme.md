TODO LIST
=========

* Feature : Create user admin by default
* Feature : Control access token
* Feature : Forgot password
* Feature : Config file json
* Fix : Update password sha1

DOCS
====

Get all users `GET` <kbd>/users</kbd>

Get one a user `GET` <kbd>/users/:id</kbd>

Create a user `POST` <kbd>/users</kbd> Params : {username,password,email,role}

Modify a user `PUT` <kbd>/users/:id</kbd> Params : {username,password,email,role}

Remove a user `DELETE` <kbd>/users/:id</kbd>

Connection user `POST` <kbd>/users/login</kbd> Params : {email,password}
