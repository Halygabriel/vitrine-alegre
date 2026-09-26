# DIARIO-DA-IA.md — 5 erros que encontrei usando IA

## 1. A logo sumia na página do produto
A IA fez o título do produto substituir a marca no header. Eu corrigi o `Header` para a logo da Vitrine Alegre continuar aparecendo em todas as rotas.

## 2. O carrinho atualizava sem deixar claro para o usuário
No começo eu conseguia adicionar o item, mas o feedback não era consistente. Corrigi colocando a confirmação no contexto do carrinho e depois acrescentei a mensagem discreta dentro do próprio produto quando ele está no carrinho.

## 3. O Sign in parecia botão, mas não fazia nada
A primeira versão deixou o Sign in apenas visual. Eu corrigi criando uma interação de login demonstrativa no front-end, sem backend, como a atividade permite.

## 4. O ZIP ficou com uma pasta dentro de outra
Quando tentei usar `npm install`, apareceu `ENOENT` porque o terminal estava uma pasta acima do `package.json`. Eu conferi com `dir /s /b package.json` e depois refiz o ZIP com os arquivos do projeto diretamente na raiz.

## 5. Levar `node_modules` no ZIP causou problema de dependência
Uma versão compactada levou dependências instaladas em outro ambiente e apareceu problema com o Rollup. Eu removi `node_modules` do ZIP e mantive apenas `package.json` e `package-lock.json`, deixando a instalação para `npm install`.
