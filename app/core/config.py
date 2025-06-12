# from pydantic import BaseSettings
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./todo.db"

    class Config:
        env_file = ".env"


settings = Settings()
