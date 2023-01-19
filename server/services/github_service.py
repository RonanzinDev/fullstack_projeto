import httpx
from configs.config import CLIENT_ID, GITHUB_CLIENT_SECRET


async def get_access_code(code, headers):
    params = {
        'client_id': CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url=f"https://github.com/login/oauth/access_token", params=params, headers=headers)
        response_json = response.json()
        access_token = response_json['access_token']
        return access_token
    
async def get_user_email(access_token, headers):
    async with httpx.AsyncClient() as client:
        headers.update({"Authorization": f'Bearer {access_token}'})
        email_data = await client.get("https://api.github.com/user/emails", headers=headers)
        email = email_data.json()[0]['email']
        return email
    
async def get_user_id(headers):
    async with httpx.AsyncClient() as client:
        data = await client.get("https://api.github.com/user", headers=headers)
        user_data = data.json()
        id = user_data["id"]
        username = user_data["login"]
        return id, username