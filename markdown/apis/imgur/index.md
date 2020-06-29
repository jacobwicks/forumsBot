# To get the Imgur api keys follow the 4 steps below
If you already have an account with Imgur, you can skip step 1.

1. Register an Imgur account

    <a href="https://imgur.com/register" target="_blank">https://imgur.com/register</a>

2. Log in to Imgur

    <a href="https://imgur.com/signin/" target="_blank">https://imgur.com/signin/</a>

3. Register an application on Imgur

Registering an application will get you the client_id and client_secret.

Go to this link:
        <a href="https://api.imgur.com/oauth2/addclient" target="_blank">https://api.imgur.com/oauth2/addclient</a>


You'll need to log in with your imgur account if you haven't already.

To register the application type the application name. 

It can be anything. I suggest something like "saForumsBot"

Select "OAuth 2 authorization without a callback URL".

Skip the Authorization callback url and website fields.

Fill in the email and description fields.

Do the captcha if there is one.

Click submit.

Copy and paste the client_id and client_secret into the fields on this screen.

The client_id is used to upload images "anonymously", meaning they don't go into one of the named albums on the account.

4. Click the "Get Token" button to use your Imgur username and password to get the access token

The access token is used to upload images to albums.