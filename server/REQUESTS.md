# List of available requests
## GET
- `/` get index.html
- `/:page` get page.html
- `/resources/css` get common.css
- `/resources/css/:file` get file.css
- `/resources/font` get the main font
- `/resources/js/` get the common.js
- `/resources/js/:file` get file.js
- `/resources/images/:image` get image.image-extension

## POST
- `/resources/avatar` get the profile picture. You must send `username` in json body
- `/resources/media?id`
- `/auth/login/google` with json body 
```json
{
	"credential": "token"
}
```
- `/auth/client-id/google` get the google client id
- `/auth/get-salt` get sha256 salt
- `/auth/login` normal login. Require json body
```json
{
	"username": "string",
	"password": "sha256 with salt password"
}
```
- `/auth/signin/` signin
- `/auth/check-username` check if an username exist. Require json body
```json
{
	"username": "string"
}
```
- `/auth/confirm/google` confirm google registration. Require json body
```json
{
	"email": "string",
	"username": "string",
	"birth": "YYYY-MM-DD",
	"phone": "string"
}
```