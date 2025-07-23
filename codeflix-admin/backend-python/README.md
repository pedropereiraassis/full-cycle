# Test End-to-End para o fluxo de criação e processamento de Vídeos com Eventos

O teste End-to-End completo para o fluxo de criação e processamento dO Video está no arquivo `src/tests_e2e/test_complete_video_process.py`.

- Requisitos:

  - O servidor RabbitMQ deve estar rodando separadamente via Docker:
    docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

- Observações:
  - Não é necessário rodar o comando `python manage.py startconsumer` manualmente.
  - O próprio teste inicia o consumer em uma thread separada durante sua execução para facilitar os testes.
