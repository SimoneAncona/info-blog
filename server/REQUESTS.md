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
- `/auth/login/google` with json body 
```json
{
	"credential": "token"
}
```
- `/auth/client-id/google` get the google client id
- `/auth/get-salt` get sha256 salt