from dotenv import dotenv_values

config = dotenv_values(".env")
user = config["USER"]
password = config["PASSWORD"]
host = config["HOST"]
port = config["PORT"]
database = config["DB"]
SECRET_KEY = config["SECRET_KEY"]
ALGORITHM = config["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(config["ACCESS_TOKEN_EXPIRE_MINUTES"])
CLIENT_ID = config['GITHUB_CLIENT_ID']
GITHUB_CLIENT_SECRET = config['GITHUB_CLIENT_SECRET']
GOOGLE_CLIENT_ID = config["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = config["GOOGLE_CLIENT_SECRET"]