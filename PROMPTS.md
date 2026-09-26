# PROMPTS.md — uso de IA no Vitrine Alegre

Este arquivo registra instruções que realmente produziram ou alteraram código do projeto. Foram removidas conversas sem impacto no código.

## 1. Implementação-base da atividade

**Instrução usada:** implementar a Vitrine Alegre em React/Vite seguindo a especificação da atividade, usando a DummyJSON, React Router, carrinho compartilhado, estados de carregamento/erro/vazio, responsividade, tratamento da API e documentação do uso de IA.

**Impacto no código:** estrutura do projeto, páginas, componentes, camada de serviços, rotas, carrinho, estilos, testes e documentação.

---

## 2. Estado da listagem na URL

**Instrução usada:** busca, categoria, ordenação e página não poderiam existir somente em estado local; deveriam ser representadas na URL para que F5, Voltar/Avançar e compartilhamento da página preservassem a vitrine.

**Impacto no código:** `Storefront.jsx`, `useSearchParams`, normalização dos parâmetros e reset da página ao trocar filtros.

---

## 3. Busca com debounce

**Instrução usada:** implementar busca sem disparar uma alteração a cada tecla, aguardando aproximadamente 400 ms após a última digitação.

**Impacto no código:** criação de `src/hooks/useDebouncedValue.js` e integração com `Storefront.jsx`.

---

## 4. Camada de serviços e tratamento da API

**Instrução usada:** concentrar toda comunicação com DummyJSON em `src/services/api.js`, verificar `response.ok`, trabalhar com o formato real da API e tratar falhas de forma controlada.

**Impacto no código:** `api.js`, `ApiError`, `listProducts`, `getProduct`, `listCategories` e testes de serviço.

---

## 5. Cancelamento de requisições

**Instrução usada:** evitar que respostas antigas substituíssem resultados novos quando os parâmetros mudassem, usando `AbortController` e cleanup dos efeitos.

**Impacto no código:** listagem, categorias, detalhes do produto e produtos relacionados.

---

## 6. Carrinho compartilhado e persistente

**Instrução usada:** o carrinho deveria usar Context, somar quantidade ao adicionar o mesmo produto, respeitar estoque, persistir em `localStorage` e calcular totais a partir dos itens em vez de manter totais duplicados no estado.

**Impacto no código:** `CartContext.jsx`, `Cart.jsx`, header e botões de adicionar.

---

## 7. Correções solicitadas depois da primeira versão

**Prompt real do desenvolvimento:**

> "analise a página e você irá adicionar as mudanças que estão informadas abaixo, sem modificar o resto que já está feito. quando eu entro em um produto, a logo lá no header some, ela não pode sumir. deve aparecer uma mensagem ao incluir produto ao carinho, tipo, produto adicionado no carrinho, como uma confirmação, mensagem que produto já está adicionado no carinho quando você seleciona ele. sign in deve esar funcional, não precisa de backend apenas que sejá clicavel"

**Impacto no código:**

- logo mantida no header da página de produto;
- toast de confirmação do carrinho;
- mensagem diferente quando o produto já existe no carrinho;
- botão Sign in passou a abrir uma interface funcional somente no front-end.

---

## 8. Produtos relacionados

**Prompt real do desenvolvimento:**

> "gere agora uma aba que quando voce entra em um produto aparece em baixo uma lista de produtos relacionados"

**Impacto no código:** `ProductDetails.jsx` passou a buscar produtos da mesma categoria, excluir o item atual e mostrar até quatro relacionados no final da página.

---

## 9. Empacotamento do projeto

**Instrução usada:** o ZIP deveria abrir diretamente nos arquivos do projeto, sem uma pasta com o mesmo projeto dentro de outra pasta, e não deveria transportar `node_modules`.

**Impacto no projeto:** pacote final com `package.json`, `src`, `public` e demais arquivos diretamente na raiz do ZIP. As dependências são instaladas com `npm install` na máquina do usuário.

---

## 10. Preparação para a entrega na Vercel

**Prompt real da etapa final:** preparar o projeto para a entrega com repositório público, README com links no topo, `PROMPTS.md`, `DIARIO-DA-IA.md`, deploy obrigatório na Vercel, F5 nas rotas e pelo menos uma extensão da seção 4.3.

**Impacto no projeto:** revisão do README, documentação explícita das extensões, revisão do `vercel.json`, instruções de demonstração dos quatro estados e checklist final.


## 11. Indicação discreta no próprio produto

**Prompt real do desenvolvimento:**

> "mande novamente o projeto a unica diferença é que você vai acrescentar o seguinte, "produto já adicionado no carrinho" depois de você adicionar um produto no carrinho, lá na aba inicial do site vai aparecer essa pequena mensagem, sem muito destaque, dentro do card do produto, entendeu? E quando você entra no card do produto também. Mas ela só deverá aparecer realmente quando você [...] adicionar um produto no carrinho, só após isso."

**Impacto no código:** `ProductCard.jsx` e `ProductDetails.jsx` passaram a verificar se o produto está no carrinho e, somente nessa condição, mostram a mensagem discreta pedida. O estilo foi mantido pequeno para não competir visualmente com preço e botão.
