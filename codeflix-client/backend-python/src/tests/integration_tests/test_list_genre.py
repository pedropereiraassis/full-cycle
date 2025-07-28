from elasticsearch import Elasticsearch

from src.application.list_genre import GenreSortableFields, ListGenre, ListGenreInput
from src.application.listing import ListOutputMeta
from src.domain.repository import SortDirection
from src.infra.elasticsearch.elasticsearch_genre_repository import (
    ElasticsearchGenreRepository,
)


class TestListGenre:
    def test_list_categories_with_default_input(
        self, populated_es: Elasticsearch, movie, series, drama, romance
    ):
        repository = ElasticsearchGenreRepository(client=populated_es)
        list_category = ListGenre(repository=repository)

        input = ListGenreInput()

        output = list_category.execute(input=input)

        print(output)
        assert output.data == [drama, romance]
        assert output.data[0].categories == {movie.id, series.id}
        assert output.data[1].categories == set()
        assert output.meta == ListOutputMeta(
            page=1,
            per_page=5,
            sort=GenreSortableFields.NAME,
            direction=SortDirection.ASC,
        )
