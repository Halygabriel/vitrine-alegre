# Vitrine Alegre

**Repositório GitHub (entrega):** https://github.com/Halygabriel/vitrine-alegre  
**Site publicado na Vercel:** https://vitrine-alegre-kappa.vercel.app/

> Antes de enviar a tarefa, confirme que os dois endereços acima são os links públicos definitivos. O link da Vercel não pode ser inventado: ele deve ser o endereço real mostrado no painel depois do deploy.

## Sobre o projeto

Vitrine Alegre é uma vitrine de produtos desenvolvida com React + Vite para a disciplina de Desenvolvimento Front-End. O projeto consome a API DummyJSON, usa rotas reais, mantém os filtros da listagem na URL e possui carrinho compartilhado e persistente.

A aplicação foi organizada para que busca, categoria, ordenação e página possam ser recuperadas ao atualizar a tela, usar Voltar/Avançar do navegador ou compartilhar a URL.

## Funcionalidades principais

- listagem de produtos consumida da DummyJSON;
- busca com debounce de 400 ms;
- filtro por categoria;
- ordenação;
- paginação;
- busca, categoria, ordenação e página gravadas na URL;
- página de detalhes em `/products/:id`;
- galeria do produto;
- produtos relacionados da mesma categoria;
- carrinho em `/cart`;
- produtos repetidos somam quantidade em vez de criar linhas duplicadas;
- totais do carrinho calculados a partir dos itens;
- confirmação visual ao adicionar produto ao carrinho;
- mensagem discreta **“Produto já adicionado no carrinho”** dentro do card da vitrine e também nos detalhes, exibida somente quando aquele produto está no carrinho;
- persistência do carrinho no `localStorage`;
- Sign in demonstrativo somente no front-end, sem backend;
- tratamento de loading, erro, vazio e estado inicial;
- layout responsivo;
- acessibilidade de teclado e estados de foco;
- configuração de SPA para o F5 funcionar nas rotas da Vercel.

## Extensão obrigatória além do deploy

A extensão principal escolhida da seção 4.3 foi **carrinho persistente no `localStorage`**.

Ela está implementada em `src/context/CartContext.jsx`. Ao adicionar itens, a lista é salva no navegador. Se a página for recarregada, os produtos e suas quantidades continuam no carrinho.

O projeto também implementa outras extensões da mesma seção:

- **AbortController** para cancelar requisições antigas;
- **hook próprio** `useDebouncedValue` para a busca;
- melhorias de **acessibilidade**.

## Tecnologias

- React 18
- Vite 5
- React Router DOM 6
- JavaScript moderno
- React Hooks
- CSS puro
- Fetch API
- `AbortController`
- `localStorage`
- DummyJSON Products API
- Node Test Runner para testes de lógica

Não são usados Bootstrap, Tailwind, biblioteca de componentes ou biblioteca externa de gerenciamento de estado.

## Como rodar do zero

### 1. Pré-requisitos

- Node.js 18 ou superior;
- npm instalado;
- internet para instalar dependências e acessar a DummyJSON.

### 2. Baixar o projeto

Clone o repositório:

```bash
git clone https://github.com/Halygabriel/vitrine-alegre.git
cd vitrine-alegre
```

Ou baixe o ZIP do GitHub e extraia a pasta.

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o projeto

```bash
npm run dev
```

O Vite mostrará o endereço local, normalmente semelhante a:

```text
http://localhost:5173/
```

### 5. Gerar a versão de produção

```bash
npm run build
```

### 6. Visualizar a build localmente

```bash
npm run preview
```

## Testes

```bash
npm test
```

Os testes cobrem lógica de preço e desconto, ordenação sem mutação, resposta da DummyJSON, combinação de busca com categoria, erros HTTP, IDs inválidos e validação de categorias.

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Vitrine/listagem |
| `/products/:id` | Detalhes do produto |
| `/cart` | Carrinho |
| qualquer outra | Página 404 controlada |

Exemplo:

```text
/products/1
```

## Estado da vitrine na URL

Os filtros importantes não ficam somente no estado interno do React. Eles aparecem na URL.

Exemplos:

```text
/?search=phone
/?category=smartphones&page=2
/?search=phone&category=smartphones&sort=price-asc&page=2
```

Parâmetros aceitos:

- `search`
- `category`
- `sort`
- `page`

Ao mudar busca, categoria ou ordenação, a página volta para 1. O botão Voltar, o F5 e um link compartilhado preservam o estado da vitrine.

## Os quatro estados exigidos

Os estados são reais e podem ser demonstrados durante a apresentação.

### 1. Estado inicial

Abra:

```text
/
```

Sem filtros, a vitrine carrega a listagem inicial.

### 2. Carregando

Recarregue a página. Para enxergar melhor o skeleton, abra o DevTools do navegador, aba **Network**, selecione uma conexão mais lenta e dê F5.

### 3. Vazio

Pesquise por um termo que não exista, por exemplo:

```text
nao-existe-produto-987654
```

A interface mostra o estado de nenhum produto encontrado e oferece **Clear filters**.

### 4. Erro

No DevTools, aba **Network**, marque **Offline** e recarregue a página. A interface exibe o painel de erro e o botão **Try again**. Depois desmarque Offline e clique no botão para a requisição funcionar novamente.

## Camada de serviços

Todas as chamadas para produtos ficam centralizadas em:

```text
src/services/api.js
```

Os componentes não montam URLs da DummyJSON diretamente.

Funções principais:

- `listProducts(...)`
- `getProduct(...)`
- `listCategories(...)`

A camada valida `response.ok`, valida os formatos importantes retornados pela API e converte falhas em mensagens controladas.

## AbortController

As requisições da listagem, categorias, detalhes e produtos relacionados usam `AbortController`.

Quando os parâmetros mudam ou o componente desmonta, a requisição antiga é cancelada. Isso evita que uma resposta atrasada substitua uma busca mais recente.

## Busca com hook próprio

O arquivo:

```text
src/hooks/useDebouncedValue.js
```

implementa o debounce da busca. O usuário pode digitar normalmente e o parâmetro `search` só é atualizado após 400 ms sem nova digitação.

## Carrinho e totais derivados

O estado global do carrinho vive em:

```text
src/context/CartContext.jsx
```

O contexto é responsável por:

- adicionar produto;
- somar quantidade quando o produto já existe;
- remover produto;
- alterar quantidade;
- respeitar o estoque;
- calcular a quantidade total para o badge do header;
- salvar a lista no `localStorage`.

Na tela `src/pages/Cart.jsx`, subtotal, desconto e total são calculados com `reduce()` a partir dos itens atuais. Esses valores não são mantidos como um segundo estado sincronizado.

## Produtos relacionados

Na página de detalhes, a aplicação consulta produtos da mesma categoria e mostra até quatro itens diferentes do produto atual.

A lógica fica em:

```text
src/pages/ProductDetails.jsx
```

## Sign in

O botão **Sign in** é funcional no front-end. Ele abre um modal e aceita e-mail e senha para uma autenticação demonstrativa local.

Não existe backend nem envio de credenciais para servidor. O estado demonstrativo de login é armazenado apenas neste navegador.

## Preços

O projeto usa a regra definida para a atividade:

```text
preço final em USD = price × (1 - discountPercentage / 100)
cotação fixa = R$ 5,20 por USD
```

A formatação usa `Intl.NumberFormat` com moeda BRL.

## Responsividade

A interface foi preparada para desktop, tablet e celular.

Referências de teste:

- 1440 px: desktop;
- 768 px: tablet;
- 360 px: celular.

## Acessibilidade

Entre as melhorias implementadas estão:

- headings semânticos;
- links para navegação e botões para ações;
- labels associados aos campos;
- IDs únicos nos campos de busca;
- `alt` nas imagens;
- foco visível;
- `aria-label` em controles somente com ícone;
- `aria-live` nas confirmações do carrinho;
- galeria navegável por teclado;
- `aria-current` e `aria-pressed` quando aplicável.

## Deploy na Vercel

O arquivo `vercel.json` já está na raiz do projeto:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Essa configuração é necessária para que rotas do React Router funcionem quando o usuário atualiza a página diretamente.

### Publicação

1. deixe o repositório `vitrine-alegre` público no GitHub;
2. entre na Vercel usando a conta do GitHub;
3. escolha **Add New → Project**;
4. importe `vitrine-alegre`;
5. confirme o preset **Vite**;
6. confirme que o **Root Directory** é a raiz do repositório;
7. clique em **Deploy**;
8. abra o endereço publicado;
9. entre em um produto, por exemplo `/products/1`;
10. dê F5 nessa página;
11. teste em aba anônima e no celular;
12. copie o endereço real da Vercel e substitua a linha **PENDENTE** no topo deste README;
13. faça commit e push dessa alteração.

## Estrutura principal

```text
src/
  components/
  context/
    CartContext.jsx
  hooks/
    useDebouncedValue.js
  pages/
    Storefront.jsx
    ProductDetails.jsx
    Cart.jsx
    NotFound.jsx
  services/
    api.js
  styles/
    global.css
  utils/
    currency.js
    pricing.js
    products.js
  App.jsx
  main.jsx

tests/
  api.test.js
  pricing.test.js

README.md
PROMPTS.md
DIARIO-DA-IA.md
vercel.json
```

`node_modules/` e `dist/` estão ignorados pelo `.gitignore` e não devem ser enviados ao GitHub.

## Arquivos de uso de IA

### `PROMPTS.md`

Registra os prompts e instruções que produziram ou modificaram código no projeto.

### `DIARIO-DA-IA.md`

Registra erros reais encontrados durante o desenvolvimento, com diagnóstico, causa e correção.

## Trecho recomendado para a apresentação oral

Um bom trecho para apresentar é o método `addItem` e os valores derivados de `CartContext.jsx`.

Ele permite explicar React de verdade:

- `useState`;
- `useCallback`;
- atualização funcional de estado;
- `find` e `map`;
- por que um produto repetido aumenta quantidade;
- limite pelo estoque;
- `localStorage`;
- `useMemo` para a quantidade total;
- compartilhamento do estado pelo Context.

Durante a demonstração, adicione um produto pela vitrine, mostre a mensagem **“Produto já adicionado no carrinho”** dentro do card, entre no produto e mostre a mesma indicação nos detalhes. Depois adicione o mesmo item novamente e abra o carrinho para explicar como a quantidade é atualizada.

Outro trecho forte é o `useEffect` da listagem em `Storefront.jsx`, porque ele reúne URL, loading, erro, `AbortController`, paginação e limpeza do efeito.

## Checklist antes de enviar

- [ ] repositório público chamado `vitrine-alegre`;
- [ ] histórico com commits reais do processo, não somente um commit genérico;
- [ ] `node_modules/` não está no GitHub;
- [ ] link real do GitHub no topo deste README;
- [ ] link real da Vercel no topo deste README;
- [ ] `PROMPTS.md` no repositório;
- [ ] `DIARIO-DA-IA.md` com pelo menos cinco erros reais;
- [ ] site abre em aba anônima;
- [ ] site abre no celular;
- [ ] F5 em `/products/:id` funciona;
- [ ] busca funciona;
- [ ] categoria funciona;
- [ ] ordenação funciona;
- [ ] paginação aparece na URL;
- [ ] carrinho mantém produtos após F5;
- [ ] trecho de apresentação escolhido e compreendido.
