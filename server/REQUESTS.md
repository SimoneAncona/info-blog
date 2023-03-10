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
- `/news/article?id` get article

## POST
- `/resources/avatar` get the profile picture. You must send `username` in json body
- `/resources/media?id` get media
- `/news/cover?id` get the cover of a news
- `/news/latest` get the cover of 12 latest news.
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
- `/auth/signin/` signin. Rquire a JSON body
```json
{
	"username": "string",
	"password": "sha256withSalt",
	"email": "string",
	"birth": "YYYY-MM-DD",
	"phone": "string"
}
```
- `/auth/check-username` check if an username exist. Require json body
```json
{
	"username": "string"
}
```
- `/auth/check-email` check if an email exist. Require json body
```json
{
	"email": "string"
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