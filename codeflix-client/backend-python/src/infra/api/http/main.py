from fastapi import FastAPI

from src.infra.api.http.cast_member_router import cast_member_router
from src.infra.api.http.category_router import category_router
from src.infra.api.http.genre_router import genre_router
from src.infra.api.http.video_router import video_router
from src.infra.api.graphql.schema import graphql_router

app = FastAPI()
app.include_router(category_router, prefix="/categories")
app.include_router(cast_member_router, prefix="/cast_members")
app.include_router(genre_router, prefix="/genres")
app.include_router(video_router, prefix="/videos")

app.include_router(graphql_router, prefix="/graphql")


@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}
