## Zuraaa votador

Um simples votador de bot para o `Zuraaa` feito com puppeteer.

Você pode usar este programa para obter inúmeros votos no seu bot em [ZURAAA](https://zuraaa.com/), mas você precisará de `tokens de usuário`.

<hr> </hr>

## Instruções

### Baixando

- Baixe o código-fonte ou clone o repo com `git clone`.
- Instale o [`NodeJS`](https://nodejs.org).
- Depois de instalar o [`NodeJS`](https://nodejs.org) execute` npm i` no terminal para instalar as dependências.
- Renomeie `config.example.js` para` config.js` e mude `botID` para o id que você deseja e adicione tokens para que o programa possa votar.
- Depois de tudo isso, você pode executar `npm start`.

### Executando periodicamente

Eu não testei ainda, mas você pode usar a biblioteca [`cron`](https://www.npmjs.com/package/cron). [`Cron`](https://www.npmjs.com/package/cron) basicamente executa uma função periodicamente de acordo com o que você definiu em sua configuração, como [ZURAAA](https://zuraaa.com/) dá a você um delay de 4 horas para votar, você pode usar o código abaixo:

```js
const { CronJob } = require("cron");

const job = new CronJob (
    "0 */4 * * *",
    () => {
        console.log ("Você verá esta mensagem a cada 12 horas");
        // ...
    },
    null,
    true,
    "America/Sao_Paulo" // Seu fuso horário, pode ser encontrado aqui: https://momentjs.com/timezone/
);

job.start();
```

Ou se você for preguiçoso, já fizemos isso para você, basta digitar `npm run cron` no terminal.

## Quaisquer problemas?

Fale comigo no Discord `notsapinho#2975`
